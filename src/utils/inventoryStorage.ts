import { Vehicle, AdminUser, VehicleStatus } from '../types';
import { INITIAL_VEHICLES } from '../data/vehicles';
import { optimizeVehiclePhotos } from './imageCompressor';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';

const STORAGE_KEY = 'gtr_motors_inventory_v3';
const AUTH_KEY = 'gtr_motors_admin_auth_v2';
const AUTH_USER_KEY = 'gtr_motors_admin_user_v2';
const SYNC_EVENT = 'gtr_inventory_sync';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notification:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Get initial local vehicles as fast fallback
 */
export function getStoredVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_VEHICLES;
  } catch (error) {
    console.error('Erro ao ler veículos do localStorage:', error);
    return INITIAL_VEHICLES;
  }
}

/**
 * Save to local cache and notify listeners
 */
export function saveStoredVehicles(vehicles: Vehicle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: vehicles }));
    }
  } catch (error) {
    console.error('Erro ao salvar veículos no localStorage:', error);
  }
}

/**
 * Bootstrap Firestore initial data if collection is empty
 */
export async function bootstrapFirestoreInitialData(): Promise<Vehicle[]> {
  try {
    const batch = writeBatch(db);
    for (const v of INITIAL_VEHICLES) {
      const docRef = doc(db, 'vehicles', v.id);
      batch.set(docRef, v);
    }
    await batch.commit();
    return INITIAL_VEHICLES;
  } catch (e) {
    console.warn('Erro ao inicializar dados no Firestore:', e);
    return INITIAL_VEHICLES;
  }
}

/**
 * Fetch vehicles from Firestore with local and API fallback
 */
export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const snap = await getDocs(collection(db, 'vehicles'));
    if (!snap.empty) {
      const list: Vehicle[] = [];
      snap.forEach((d) => {
        list.push(d.data() as Vehicle);
      });
      if (list.length > 0) {
        saveStoredVehicles(list);
        return list;
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'vehicles');
  }

  try {
    const res = await fetch('/api/vehicles');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
        saveStoredVehicles(data.vehicles);
        return data.vehicles;
      }
    }
  } catch (err) {
    console.warn('Erro ao consultar /api/vehicles, usando cache local:', err);
  }
  return getStoredVehicles();
}

/**
 * Subscribe to real-time updates from Firestore
 */
export function subscribeToVehicles(
  onUpdate: (vehicles: Vehicle[]) => void,
  onError?: (err: Error) => void
): () => void {
  let isSubscribed = true;

  // Local window event listener for instant UI reactivity across tabs / components
  const handleLocalSync = (e: any) => {
    if (isSubscribed && e.detail && Array.isArray(e.detail)) {
      onUpdate(e.detail);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(SYNC_EVENT, handleLocalSync);
  }

  // Fast initial load from cache
  const cached = getStoredVehicles();
  if (cached && cached.length > 0) {
    onUpdate(cached);
  }

  // 1. Real-time Firestore Listener
  let unsubscribeFirestore = () => {};
  try {
    const vehiclesCol = collection(db, 'vehicles');
    unsubscribeFirestore = onSnapshot(
      vehiclesCol,
      (snapshot) => {
        if (!isSubscribed) return;
        if (!snapshot.empty) {
          const list: Vehicle[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Vehicle);
          });
          saveStoredVehicles(list);
          onUpdate(list);
        } else {
          // If Firestore is brand new/empty, bootstrap initial catalog
          bootstrapFirestoreInitialData().then((seeded) => {
            if (isSubscribed && seeded.length > 0) {
              saveStoredVehicles(seeded);
              onUpdate(seeded);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'vehicles');
        if (onError) onError(error);
      }
    );
  } catch (e) {
    console.warn('Firestore subscription fallback:', e);
  }

  return () => {
    isSubscribed = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener(SYNC_EVENT, handleLocalSync);
    }
    unsubscribeFirestore();
  };
}

/**
 * Add or update single vehicle in Firestore + LocalStorage + API
 */
export async function saveVehicleToFirestore(vehicle: Vehicle): Promise<Vehicle> {
  const optimizedPhotos = await optimizeVehiclePhotos(vehicle.photos || []);
  const sanitizedVehicle: Vehicle = {
    ...vehicle,
    photos: optimizedPhotos,
    updatedAt: new Date().toISOString(),
  };

  // 1. Optimistic Local Save
  const current = getStoredVehicles();
  const existingIdx = current.findIndex((v) => v.id === sanitizedVehicle.id);
  let optimisticNext: Vehicle[];
  if (existingIdx >= 0) {
    optimisticNext = current.map((v) => (v.id === sanitizedVehicle.id ? sanitizedVehicle : v));
  } else {
    optimisticNext = [sanitizedVehicle, ...current];
  }
  saveStoredVehicles(optimisticNext);

  // 2. Direct Cloud Firestore Save (Durable Cloud Database)
  try {
    const docRef = doc(db, 'vehicles', sanitizedVehicle.id);
    await setDoc(docRef, sanitizedVehicle);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `vehicles/${sanitizedVehicle.id}`);
  }

  // 3. Sync to API / Server
  try {
    await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedVehicle),
    });
  } catch (e) {
    console.warn('Erro ao sincronizar com /api/vehicles:', e);
  }

  return sanitizedVehicle;
}

export async function saveVehicleToSupabase(vehicle: Vehicle): Promise<Vehicle> {
  return saveVehicleToFirestore(vehicle);
}

/**
 * Delete a vehicle from Firestore + LocalStorage + API
 */
export async function deleteVehicleFromFirestore(vehicleId: string): Promise<void> {
  // 1. Optimistic Local Remove
  const current = getStoredVehicles();
  const next = current.filter((v) => v.id !== vehicleId);
  saveStoredVehicles(next);

  // 2. Delete from Cloud Firestore
  try {
    const docRef = doc(db, 'vehicles', vehicleId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `vehicles/${vehicleId}`);
  }

  // 3. Delete from API
  try {
    await fetch(`/api/vehicles/${vehicleId}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.warn('Erro ao excluir do endpoint API:', e);
  }
}

export async function deleteVehicleFromSupabase(vehicleId: string): Promise<void> {
  return deleteVehicleFromFirestore(vehicleId);
}

/**
 * Save all vehicles batch
 */
export async function saveAllVehiclesToFirestore(vehicles: Vehicle[]): Promise<void> {
  saveStoredVehicles(vehicles);
  try {
    const batch = writeBatch(db);
    for (const v of vehicles) {
      const docRef = doc(db, 'vehicles', v.id);
      batch.set(docRef, v);
    }
    await batch.commit();
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'vehicles/batch');
  }
}

/**
 * Reset Firestore inventory to default catalog seed
 */
export async function resetFirestoreVehicles(): Promise<Vehicle[]> {
  saveStoredVehicles(INITIAL_VEHICLES);
  try {
    const existing = await getDocs(collection(db, 'vehicles'));
    const batch = writeBatch(db);
    existing.forEach((d) => {
      batch.delete(d.ref);
    });
    for (const v of INITIAL_VEHICLES) {
      const docRef = doc(db, 'vehicles', v.id);
      batch.set(docRef, v);
    }
    await batch.commit();
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'vehicles/reset');
  }

  try {
    await fetch('/api/vehicles/reset', { method: 'POST' });
  } catch (e) {
    console.warn('Erro ao resetar veículos no servidor:', e);
  }

  return INITIAL_VEHICLES;
}

export async function resetSupabaseVehicles(): Promise<Vehicle[]> {
  return resetFirestoreVehicles();
}

export function resetStoredVehicles(): Vehicle[] {
  return resetFirestoreVehicles() as any;
}

/**
 * Save appraisal / vehicle sell proposal to Firestore
 */
export async function saveAppraisalToFirestore(appraisalData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  desiredPrice?: string;
  notes?: string;
}): Promise<string> {
  const newId = `appraisal-${Date.now()}`;
  const fullData = {
    ...appraisalData,
    id: newId,
    status: 'Novo',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'appraisals', newId);
    await setDoc(docRef, fullData);
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, `appraisals/${newId}`);
  }

  try {
    const res = await fetch('/api/appraisals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData),
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data?.id || newId;
    }
  } catch (e) {
    console.warn('Erro ao salvar proposta no backend:', e);
  }
  return newId;
}

/**
 * Save financing simulation to Firestore
 */
export async function saveSimulationToFirestore(simulationData: {
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  vehicleInterest?: string;
  entryValue?: number;
  installments?: number;
}): Promise<string> {
  const newId = `sim-${Date.now()}`;
  const fullData = {
    ...simulationData,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'simulations', newId);
    await setDoc(docRef, fullData);
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, `simulations/${newId}`);
  }

  try {
    const res = await fetch('/api/simulations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData),
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data?.id || newId;
    }
  } catch (e) {
    console.warn('Erro ao salvar simulação no backend:', e);
  }
  return newId;
}

/**
 * Admin Authentication & Session Management
 */
export async function loginAdmin(email?: string, password?: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      setAdminAuthState(true);
      if (data.user) {
        setStoredAdminUser(data.user);
      }
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'Credenciais inválidas.' };
    }
  } catch (err: any) {
    // Fallback password check
    if (password === 'GTR8217#' || password?.toUpperCase() === 'GTR8217#') {
      setAdminAuthState(true);
      return { success: true, user: { id: 'admin', email: email || 'admin@gtrmotors.com.br', name: 'Administrador GTR', role: 'admin' } };
    }
    return { success: false, error: 'Falha na conexão com o servidor de autenticação.' };
  }
}

export function getAdminAuthState(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthState(isAuth: boolean): void {
  try {
    if (isAuth) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch {
    // Ignore error
  }
}

export function getStoredAdminUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAdminUser(user: AdminUser): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore error
  }
}

