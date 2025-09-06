const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
initializeApp({
  projectId: 'fosterlinks-95182',
});

const auth = getAuth();
const db = getFirestore();

// Create a user
async function createUser() {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: 'admin@example.com',
      password: 'password123',
      displayName: 'Admin User',
    });
    
    console.log('Successfully created user:', userRecord.uid);
    
    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    
    console.log('Successfully created user document in Firestore');
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

createUser();