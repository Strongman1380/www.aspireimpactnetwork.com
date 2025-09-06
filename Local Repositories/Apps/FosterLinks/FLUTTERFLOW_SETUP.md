# FlutterFlow Setup Guide for FosterLinks

This guide will help you connect your FlutterFlow project to the FosterLinks Firebase backend.

## Firebase Configuration

To connect FlutterFlow to Firebase, you will need your Firebase **Project ID**. You should not commit your API keys or other secrets to version control.

1.  Go to your [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (`fosterlinks-95182`).
3.  Your **Project ID** is available in the Project settings (click the gear icon next to "Project Overview").

## Steps to Connect FlutterFlow to Firebase

1. **Create a New FlutterFlow Project**:
   - Go to FlutterFlow.io and sign in.
   - Create a new project or open your existing one.

2. **Connect to Firebase**:
   - In your FlutterFlow project, navigate to **Settings & Integrations** > **Project Setup** > **Firebase**.
   - Paste your Firebase **Project ID** into the provided field.
   - Click **Connect**. FlutterFlow will guide you through the remaining steps to automatically configure your project.
   - You will be prompted to grant FlutterFlow permissions to your Firebase project.
   - Once connected, FlutterFlow will automatically generate the necessary configuration files (`google-services.json` for Android and `GoogleService-Info.plist` for iOS) when you download the code.

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
