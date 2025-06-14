const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
require('dotenv').config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Test user credentials
const email = 'admin@fosterlinks.test';
const password = 'password123';

async function checkUser() {
  try {
    console.log(`Attempting to sign in with email: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Sign in successful!');
    console.log('User details:');
    console.log(`UID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
    console.log(`Email verified: ${user.emailVerified}`);
    
    console.log('\nYou can use these credentials to log in to the application:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error signing in:', error);
    
    if (error.code === 'auth/user-not-found') {
      console.log(`\nUser with email ${email} does not exist.`);
      console.log('Please run the create-test-user.js script first.');
    } else if (error.code === 'auth/wrong-password') {
      console.log(`\nIncorrect password for user with email ${email}.`);
    } else {
      console.log(`\nError code: ${error.code}`);
      console.log(`Error message: ${error.message}`);
    }
    
    process.exit(1);
  }
}

checkUser();