import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

function initFirestore(): Firestore {
  const dbId = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)')
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

  try {
    if (dbId) {
      return initializeFirestore(app, { ignoreUndefinedProperties: true }, dbId);
    }
    return initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch (err) {
    console.warn('Fallback to default Firestore database instance:', err);
    return dbId ? getFirestore(app, dbId) : getFirestore(app);
  }
}

export const db: Firestore = initFirestore();
export default app;

