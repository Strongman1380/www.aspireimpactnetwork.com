/**
 * Auth Tester Utility
 * 
 * This script helps test authentication flows in the browser console.
 * Copy and paste this entire file into your browser console when testing.
 */

const authTester = {
  /**
   * Test user registration
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @param {string} role - User role (admin, worker, foster_parent)
   */
  async testRegistration(email, password, firstName, lastName, role) {
    console.group('🔐 Testing User Registration');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password.replace(/./g, '*')}`);
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Role: ${role}`);
    
    try {
      // Get Firebase auth and firestore from window
      const auth = window.firebase?.auth;
      const firestore = window.firebase?.firestore;
      
      if (!auth || !firestore) {
        console.error('Firebase auth or firestore not found on window object');
        console.groupEnd();
        return;
      }
      
      // Create user
      console.log('Creating user in Firebase Auth...');
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      console.log('✅ User created in Auth:', userCredential.user.uid);
      
      // Create user document
      console.log('Creating user document in Firestore...');
      await firestore().collection('users').doc(userCredential.user.uid).set({
        email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        role,
        createdAt: new Date().toISOString()
      });
      
      console.log('✅ User document created in Firestore');
      console.log('Registration test completed successfully!');
    } catch (error) {
      console.error('❌ Registration test failed:', error);
    }
    
    console.groupEnd();
  },
  
  /**
   * Test user login
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async testLogin(email, password) {
    console.group('🔐 Testing User Login');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password.replace(/./g, '*')}`);
    
    try {
      // Get Firebase auth from window
      const auth = window.firebase?.auth;
      
      if (!auth) {
        console.error('Firebase auth not found on window object');
        console.groupEnd();
        return;
      }
      
      // Sign in user
      console.log('Signing in user...');
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('✅ User signed in:', userCredential.user.uid);
      
      // Get user document
      const firestore = window.firebase?.firestore;
      if (firestore) {
        console.log('Fetching user document...');
        const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();
        
        if (userDoc.exists) {
          console.log('✅ User document found:', userDoc.data());
        } else {
          console.warn('⚠️ User document not found in Firestore');
        }
      }
      
      console.log('Login test completed successfully!');
    } catch (error) {
      console.error('❌ Login test failed:', error);
    }
    
    console.groupEnd();
  },
  
  /**
   * Check current authentication state
   */
  checkAuthState() {
    console.group('🔐 Checking Auth State');
    
    try {
      // Get Firebase auth from window
      const auth = window.firebase?.auth;
      
      if (!auth) {
        console.error('Firebase auth not found on window object');
        console.groupEnd();
        return;
      }
      
      const currentUser = auth().currentUser;
      
      if (currentUser) {
        console.log('✅ User is signed in:');
        console.log('UID:', currentUser.uid);
        console.log('Email:', currentUser.email);
        console.log('Email verified:', currentUser.emailVerified);
        console.log('Anonymous:', currentUser.isAnonymous);
        console.log('Provider data:', currentUser.providerData);
      } else {
        console.log('❌ No user is signed in');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
    
    console.groupEnd();
  },
  
  /**
   * Sign out current user
   */
  async signOut() {
    console.group('🔐 Signing Out User');
    
    try {
      // Get Firebase auth from window
      const auth = window.firebase?.auth;
      
      if (!auth) {
        console.error('Firebase auth not found on window object');
        console.groupEnd();
        return;
      }
      
      await auth().signOut();
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
    
    console.groupEnd();
  },
  
  /**
   * Show usage instructions
   */
  help() {
    console.group('🔐 Auth Tester Help');
    console.log('Available methods:');
    console.log('authTester.testRegistration(email, password, firstName, lastName, role)');
    console.log('authTester.testLogin(email, password)');
    console.log('authTester.checkAuthState()');
    console.log('authTester.signOut()');
    console.log('authTester.help()');
    console.groupEnd();
  }
};

// Make authTester available globally
window.authTester = authTester;

// Show help message
authTester.help();

console.log('Auth Tester utility loaded! Use window.authTester to access methods.');