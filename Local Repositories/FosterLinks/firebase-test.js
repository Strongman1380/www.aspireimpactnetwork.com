// Simple script to test Firebase connection
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized');

// Initialize Firestore
const db = getFirestore(app);
console.log('Firestore initialized');

// Initialize Auth
const auth = getAuth(app);
console.log('Auth initialized');

// Test function to list collections
async function listCollections() {
  try {
    // List users collection
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`Users collection has ${usersSnapshot.size} documents`);
    
    // List youth collection
    const youthSnapshot = await getDocs(collection(db, 'youth'));
    console.log(`Youth collection has ${youthSnapshot.size} documents`);
    
    console.log('Firebase connection test successful!');
  } catch (error) {
    console.error('Error testing Firebase connection:', error);
  }
}

// Test authentication (replace with your test credentials)
async function testAuth(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Authentication successful!', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Authentication error:', error.code, error.message);
    return null;
  }
}

// Run tests if credentials are provided as command line arguments
if (process.argv.length >= 4) {
  const email = process.argv[2];
  const password = process.argv[3];
  
  testAuth(email, password)
    .then(user => {
      if (user) {
        return listCollections();
      }
    })
    .catch(console.error);
} else {
  console.log('Usage: node firebase-test.js <email> <password>');
  console.log('No credentials provided, skipping authentication test');
  listCollections().catch(console.error);
}