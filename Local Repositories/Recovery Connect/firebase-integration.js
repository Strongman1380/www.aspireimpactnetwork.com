/**
 * Firebase Integration for Recovery Connect
 * 
 * This file demonstrates how to integrate the provided Firebase configuration
 * with both the Realtime Database and Analytics.
 */

// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, push, set, get } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcp4pvdVEs5jG7yT7532BGzK0kf_aRQ1Q",
  authDomain: "lift-and-renewal-33bbb.firebaseapp.com",
  // Important: Adding databaseURL for Realtime Database access
  databaseURL: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com",
  projectId: "lift-and-renewal-33bbb",
  storageBucket: "lift-and-renewal-33bbb.firebasestorage.app",
  messagingSenderId: "945546956580",
  appId: "1:945546956580:web:25c1c89b1778201f31edb1",
  measurementId: "G-4QK3K2Z4SP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

/**
 * Example: Log an analytics event
 */
function logPageView(pageName) {
  if (analytics) {
    // Using Firebase v9 analytics SDK
    import('firebase/analytics').then((firebaseAnalytics) => {
      firebaseAnalytics.logEvent(analytics, 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
      console.log(`Logged page view for: ${pageName}`);
    });
  }
}

/**
 * Example: Read data from the Realtime Database
 */
function readDatabaseData(path) {
  const dbRef = ref(database, path);
  return new Promise((resolve, reject) => {
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        console.error("Error reading data:", error);
        reject(error);
      });
  });
}

/**
 * Example: Write data to the Realtime Database
 */
function writeDatabaseData(path, data) {
  const dbRef = ref(database, path);
  return set(dbRef, data)
    .then(() => {
      console.log("Data written successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error writing data:", error);
      return false;
    });
}

/**
 * Example: Listen for real-time updates
 */
function subscribeToUpdates(path, callback) {
  const dbRef = ref(database, path);
  return onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

// Export the Firebase app instance and utility functions
export {
  app,
  analytics,
  database,
  logPageView,
  readDatabaseData,
  writeDatabaseData,
  subscribeToUpdates
};