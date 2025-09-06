const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
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
const db = getFirestore(app);

// Test user details
const testUser = {
  email: 'admin@fosterlinks.test',
  password: 'password123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

async function createTestUser() {
  try {
    console.log(`Creating test user with email: ${testUser.email}`);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, testUser.email, testUser.password);
    const user = userCredential.user;
    
    console.log(`User created successfully with UID: ${user.uid}`);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      displayName: `${testUser.firstName} ${testUser.lastName}`,
      role: testUser.role,
      createdAt: new Date().toISOString()
    });
    
    console.log(`User document created in Firestore with role: ${testUser.role}`);
    console.log('Test user creation completed successfully');
    
    // Print login credentials
    console.log('\nLogin Credentials:');
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    console.log(`Role: ${testUser.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log(`\nUser with email ${testUser.email} already exists.`);
      console.log('You can use the following credentials to log in:');
      console.log(`Email: ${testUser.email}`);
      console.log(`Password: ${testUser.password}`);
    }
    
    process.exit(1);
  }
}

createTestUser();