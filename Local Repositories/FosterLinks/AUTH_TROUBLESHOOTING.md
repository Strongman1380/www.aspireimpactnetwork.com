# Authentication Troubleshooting Guide

This guide provides steps to troubleshoot and fix authentication issues in the Foster Links application.

## Common Issues and Solutions

### 1. User Registration Fails

**Problem**: When trying to register a new user, the account is created in Firebase Authentication but the user document is not created in Firestore.

**Solution**:

1. **Update Firestore Security Rules**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project "fosterlinks-95182"
   - Navigate to Firestore Database in the left sidebar
   - Click on the "Rules" tab
   - Update the rules for the users collection to allow new user creation:

```
match /users/{userId} {
  // Users can read and update their own data
  // Admins can read and write all user data
  // Allow creating a user document during registration
  allow read: if isOwner(userId) || isAdmin();
  
  // For new user creation, we need to be more permissive
  // This allows a newly authenticated user to create their own document
  allow create: if request.auth != null && request.auth.uid == userId;
  
  allow update, delete: if isOwner(userId) || isAdmin();
}
```

2. **Check Browser Console for Errors**:
   - Open your browser's developer tools (F12 or right-click > Inspect)
   - Go to the Console tab
   - Look for any error messages related to Firebase or Firestore

3. **Test Authentication Flow**:
   - Use the authTester utility in the browser console:
   ```javascript
   // Load the script
   const script = document.createElement('script');
   script.src = '/src/utils/authTester.js';
   document.head.appendChild(script);
   
   // Test registration
   authTester.testRegistration('test@example.com', 'password123', 'Test', 'User', 'admin');
   ```

### 2. Login Issues

**Problem**: Unable to log in with existing credentials.

**Solution**:

1. **Verify User Exists in Firebase Auth**:
   - Go to the Firebase Console > Authentication > Users
   - Check if the user email exists

2. **Check if User Document Exists in Firestore**:
   - Go to Firebase Console > Firestore Database
   - Check the "users" collection for a document with the user's UID

3. **Reset Password if Necessary**:
   - In Firebase Console > Authentication > Users
   - Find the user and click the three dots menu
   - Select "Reset Password"

4. **Test Login with authTester**:
   ```javascript
   authTester.testLogin('test@example.com', 'password123');
   ```

### 3. Authorization Issues

**Problem**: User can authenticate but cannot access certain pages.

**Solution**:

1. **Check User Role in Firestore**:
   - Verify that the user document in Firestore has the correct "role" field
   - Valid roles are: "admin", "worker", "foster_parent"

2. **Check Protected Route Configuration**:
   - Review the allowedRoles array in the ProtectedRoute component
   - Make sure the user's role is included in the allowedRoles for the route they're trying to access

3. **Check Auth State**:
   ```javascript
   authTester.checkAuthState();
   ```

## Debugging Tools

### Console Logging

We've added extensive console logging to help debug authentication issues:

- In the Firebase initialization
- In the AuthContext for sign-in and sign-up functions
- In the Register and Login components
- In the ProtectedRoute component

### Auth Tester Utility

Use the authTester utility in the browser console to test authentication flows:

1. Open your browser's developer tools (F12)
2. Copy and paste the entire content of `src/utils/authTester.js` into the console
3. Use the available methods:
   - `authTester.testRegistration(email, password, firstName, lastName, role)`
   - `authTester.testLogin(email, password)`
   - `authTester.checkAuthState()`
   - `authTester.signOut()`

## Contact Support

If you continue to experience issues after trying these solutions, please contact the development team with:

1. Screenshots of any error messages
2. Steps to reproduce the issue
3. Browser and device information