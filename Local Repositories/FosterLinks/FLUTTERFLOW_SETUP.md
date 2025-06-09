# FlutterFlow Setup Guide for FosterLinks

This guide will help you connect your FlutterFlow project to the FosterLinks Firebase backend.

## Firebase Configuration

Use the following Firebase configuration in your FlutterFlow project:

```
apiKey: "AIzaSyCXda8i20YAmJsokhw_bHUpVnN-Codls6k"
authDomain: "fosterlinks-95182.firebaseapp.com"
projectId: "fosterlinks-95182"
storageBucket: "fosterlinks-95182.appspot.com"
messagingSenderId: "420676452183"
appId: "1:420676452183:web:9cb9765cfc0393b086c812"
measurementId: "G-1ZP1YT98RD"
```

## Steps to Connect FlutterFlow to Firebase

1. **Create a New FlutterFlow Project**:
   - Go to FlutterFlow.io and sign in
   - Create a new project or open your existing project

2. **Connect to Firebase**:
   - In your FlutterFlow project, go to "Settings" > "Integrations"
   - Select "Firebase"
   - Choose "Connect to existing Firebase project"
   - Enter the Firebase configuration details listed above

3. **Set Up Authentication**:
   - In the Firebase integration settings, enable the authentication methods you need
   - The React app is using Firebase Authentication, so make sure to enable the same methods

4. **Configure Firestore**:
   - In the Firebase integration settings, enable Firestore
   - FlutterFlow will automatically connect to your existing Firestore database

5. **Set Up Storage** (if needed):
   - If your app uses Firebase Storage, enable it in the integration settings

## Database Structure

The FosterLinks project uses the following Firestore collections:

- `users`: Contains user profile information
- `youth`: Contains information about youth in the system
- `medications`: Contains medication logs
- (Add other collections as needed)

## Testing the Connection

After setting up the Firebase integration in FlutterFlow:

1. Create a simple screen that displays data from one of your Firestore collections
2. Test authentication by creating a login screen
3. Verify that data is being properly synchronized between your React app and FlutterFlow app

## Important Notes

- Both your React web app and FlutterFlow mobile app will share the same Firebase backend
- Any changes to the database structure should be coordinated between both apps
- Make sure to set up proper security rules in Firebase to protect your data

## Troubleshooting

If you encounter issues connecting FlutterFlow to Firebase:

1. Verify that all Firebase configuration values are correctly entered
2. Check that Firebase Authentication is properly set up in the Firebase console
3. Ensure that your Firebase project has the necessary APIs enabled
4. Check the Firebase console for any error messages or warnings

For more detailed instructions, refer to the [FlutterFlow Firebase Integration Documentation](https://docs.flutterflow.io/data-and-backend/firebase).