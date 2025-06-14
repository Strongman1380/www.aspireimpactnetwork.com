
# FosterLinks Setup Instructions

This document provides instructions for setting up and running the FosterLinks project, including the React web application and connecting it to mobile apps built with FlutterFlow and Swift.

## React Web Application

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The application will be available at http://localhost:3000

### Testing Firebase Connection

You can test the Firebase connection using the provided script:

```
node firebase-test.js <email> <password>
```

Replace `<email>` and `<password>` with valid Firebase authentication credentials.

## Mobile App Integrations

### FlutterFlow Integration

For detailed instructions on connecting your FlutterFlow project to the same Firebase backend, see the [FlutterFlow Setup Guide](./FLUTTERFLOW_SETUP.md).

### Swift Integration for iOS

For detailed instructions on integrating Firebase with a Swift iOS app, see the [Swift Firebase Setup Guide](./SWIFT_FIREBASE_SETUP.md).

### Key Firebase Configuration

Use this configuration for all platforms (React, FlutterFlow, and Swift):

```
apiKey: "AIzaSyCXda8i20YAmJsokhw_bHUpVnN-Codls6k"
authDomain: "fosterlinks-95182.firebaseapp.com"
projectId: "fosterlinks-95182"
storageBucket: "fosterlinks-95182.appspot.com"
messagingSenderId: "420676452183"
appId: "1:420676452183:web:9cb9765cfc0393b086c812"
measurementId: "G-1ZP1YT98RD"
```

## Development Workflow

When working on multiple platforms (React web app, FlutterFlow, and Swift iOS app):

1. Make sure all applications are connected to the same Firebase project
2. Test changes to the database structure across all applications
3. Coordinate authentication methods between all applications
4. Use the same data models and field names for consistency
5. Implement similar error handling and offline capabilities across platforms

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors in the React app
2. Verify Firebase configuration in both applications
3. Ensure you have the correct permissions in Firebase
4. Test Firebase connection using the provided test script

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Firebase Documentation](https://firebase.google.com/docs)
- [FlutterFlow Documentation](https://docs.flutterflow.io/)
- [Swift Documentation](https://developer.apple.com/documentation/swift)
- [Firebase iOS SDK Documentation](https://firebase.google.com/docs/ios/setup)
