import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXda8i20YAmJsokhw_bHUpVnN-Codls6k",
  authDomain: "fosterlinks-95182.firebaseapp.com",
  projectId: "fosterlinks-95182",
  storageBucket: "fosterlinks-95182.firebasestorage.app",
  messagingSenderId: "420676452183",
  appId: "1:420676452183:web:9cb9765cfc0393b086c812",
  measurementId: "G-1ZP1YT98RD"
};

// Initialize Firebase
console.log('Initializing Firebase app...');
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
console.log('Initializing Firebase services...');
export const auth = getAuth(app);
console.log('Firebase Auth initialized');

export const db = getFirestore(app);
console.log('Firestore initialized');

export const storage = getStorage(app);
console.log('Firebase Storage initialized');

// Only initialize analytics in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
console.log('Firebase Analytics initialized');

export default app;