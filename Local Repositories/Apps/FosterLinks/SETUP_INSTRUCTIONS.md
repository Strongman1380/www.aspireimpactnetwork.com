
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

After starting the application, you can test the Firebase connection and authentication flow directly in your browser's developer console.

For detailed instructions, refer to the **Auth Tester Utility** section in the Authentication Troubleshooting Guide. This guide explains how to use the `authTester.js` utility to test registration, login, and other authentication functions.

## Mobile App Integrations

### FlutterFlow Integration

For detailed instructions on connecting your FlutterFlow project to the same Firebase backend, see the [FlutterFlow Setup Guide](./FLUTTERFLOW_SETUP.md).

### Swift Integration for iOS

For detailed instructions on integrating Firebase with a Swift iOS app, see the [Swift Firebase Setup Guide](./SWIFT_FIREBASE_SETUP.md).

### Key Firebase Configuration

Your Firebase configuration keys should not be stored in version control as this is a security risk. Instead, use environment variables for your web app and secure configuration files for mobile.

1.  Create a file named `.env` in the root of your React project.
2.  Copy your Firebase web config values into it, prefixing each key with `REACT_APP_` (if you are using Create React App). See `.env.example` for the structure.
3.  Add `.env` to your `.gitignore` file to prevent it from being committed.
4.  Access these keys in your React code via `process.env.REACT_APP_API_KEY`, etc.

For your mobile platforms, follow the standard Firebase setup:
*   **iOS (Swift/FlutterFlow):** Use the `GoogleService-Info.plist` file.
*   **Android (FlutterFlow):** Use the `google-services.json` file.

Ensure these platform-specific configuration files are also added to your `.gitignore` file.

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
