import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXda8i20YAmJsokhw_bHUpVnN-Codls6k",
  authDomain: "fosterlinks-95182.firebaseapp.com",
  projectId: "fosterlinks-95182",
  storageBucket: "fosterlinks-95182.appspot.com",
  messagingSenderId: "420676452183",
  appId: "1:420676452183:web:9cb9765cfc0393b086c812",
  measurementId: "G-1ZP1YT98RD"
};

// Initialize Firebase
console.log('Initializing Firebase app with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);

// Initialize Firebase services
console.log('Initializing Firebase services...');
export const auth = getAuth(app);
console.log('Firebase Auth initialized:', auth);

// Set auth persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export const db = getFirestore(app);
console.log('Firestore initialized');

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
    .then(() => {
      console.log('Firestore offline persistence enabled');
    })
    .catch((err) => {
      console.error('Error enabling offline persistence:', err);
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });
}

export const storage = getStorage(app);
console.log('Firebase Storage initialized');

// Only initialize analytics in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
console.log('Firebase Analytics initialized');

export default app;