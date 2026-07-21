import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseEnvironment } from "@/lib/env";

type FirebaseServices = { app: FirebaseApp; auth: Auth; db: Firestore; storage: FirebaseStorage };

export function initializeFirebase(): FirebaseServices | null {
  const env = getFirebaseEnvironment();
  if (!env) return null;
  const app = getApps().length > 0 ? getApp() : initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });
  return { app, auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) };
}
