import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

function initFirestore(): Firestore {
  try {
    if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  } catch (err) {
    console.warn('Fallback to default Firestore database instance:', err);
  }
  return getFirestore(app);
}

export const db: Firestore = initFirestore();
export default app;

