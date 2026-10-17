import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
<<<<<<< HEAD
import { getFirestore, type Firestore } from "firebase/firestore";
=======
>>>>>>> 5d66da33deeec2530ed911f657e3f8b838d87124

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredConfig.every(Boolean);

let authInstance: Auth | undefined;
<<<<<<< HEAD
let firestoreInstance: Firestore | undefined;

function getFirebaseApp() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
=======
>>>>>>> 5d66da33deeec2530ed911f657e3f8b838d87124

export function getFirebaseAuth(): Auth {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values from .env.example to .env.local.",
    );
  }

  if (!authInstance) {
<<<<<<< HEAD
    authInstance = getAuth(getFirebaseApp());
=======
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
>>>>>>> 5d66da33deeec2530ed911f657e3f8b838d87124
  }

  return authInstance;
}
<<<<<<< HEAD

export function getFirebaseDb(): Firestore {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values from .env.example to .env.local.",
    );
  }

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }

  return firestoreInstance;
}
=======
>>>>>>> 5d66da33deeec2530ed911f657e3f8b838d87124
