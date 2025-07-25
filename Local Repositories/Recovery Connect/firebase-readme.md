# Firebase Database Integration Guide

This document explains how to use the Firebase Realtime Database integration with the Recovery Connect platform.

## Database Structure

The Recovery Connect platform uses Firebase Realtime Database to store and retrieve various resources needed for the recovery community. The database is structured as follows:

```
lift-and-renewal-33bbb-default-rtdb
├── treatment/
│   ├── [id]/
│   │   ├── name
│   │   ├── description
│   │   ├── location
│   │   ├── phone
│   │   ├── website
│   │   ├── type (inpatient, outpatient, etc)
│   │   └── services []
│   │
├── resources/
│   ├── [id]/
│   │   ├── title
│   │   ├── description
│   │   ├── url
│   │   ├── category
│   │   └── tags []
│   │
├── stories/
│   ├── [id]/
│   │   ├── title
│   │   ├── author
│   │   ├── excerpt
│   │   ├── content
│   │   ├── dateSubmitted
│   │   └── published (boolean)
│   │
└── crisis/
    ├── [id]/
        ├── name
        ├── description
        ├── phone
        └── textLine (optional)
```

## Integration Files

1. **config.js**: Contains Firebase configuration and database endpoint definitions
2. **assets/js/firebase-data.js**: Utility functions for database operations
3. **firebase-example.html**: Example implementation showing database integration

## Usage

### 1. Initialize Firebase

First, ensure Firebase is correctly initialized:

```javascript
// Initialize Firebase with configuration from config.js
window.recoverConnect.initializeFirebase();
```

### 2. Fetching Data

To retrieve data from any endpoint:

```javascript
// Load treatment resources
const treatmentData = await window.recoverConnect.fetchData('treatment');

// Load recovery stories
const storiesData = await window.recoverConnect.fetchData('stories');

// Load crisis resources
const crisisData = await window.recoverConnect.fetchData('crisis');
```

### 3. Displaying Data

Helper functions are provided to load and display data for each section:

```javascript
// Display treatment resources
window.recoverConnect.loadTreatmentResources();

// Display recovery stories
window.recoverConnect.loadRecoveryStories();

// Display crisis resources
window.recoverConnect.loadCrisisResources();
```

### 4. Submitting Data

For endpoints that support POST operations:

```javascript
const storyData = {
  title: "My Recovery Journey",
  author: "Anonymous",
  excerpt: "A brief summary of my story...",
  content: "The full content of my recovery story...",
  dateSubmitted: new Date().toISOString(),
  published: false
};

const success = await window.recoverConnect.submitUserStory(storyData);
```

## Security Considerations

1. **Read/Write Permissions**: 
   - The database is configured to allow public read access to treatment, resource, stories, and crisis endpoints
   - Write access is restricted to authenticated users for stories submissions
   - Admin operations require authentication

2. **Data Validation**: 
   - All user-submitted data should be validated on the client-side before submission
   - Server-side validation rules are implemented in Firebase

3. **Sensitive Information**:
   - No personally identifiable information should be stored without explicit user consent
   - Story submissions can be anonymous and should be reviewed before being published

## Example Implementation

A complete example is provided in `firebase-example.html` which demonstrates:

1. Connecting to the Firebase database
2. Loading and displaying data from multiple endpoints
3. Submitting user stories to the database
4. Basic error handling and loading states

## Troubleshooting

If you experience issues with the Firebase integration:

1. **Check Connection Status**:
   - Verify Firebase is properly initialized
   - Confirm the database URL is correct

2. **Console Errors**:
   - Check browser console for specific error messages
   - Validate permissions and authentication status

3. **Empty Data**:
   - If endpoints return null or empty objects, verify data exists in the database
   - Check path specifications in the database URL

4. **Loading Issues**:
   - Ensure DOM elements exist before attempting to populate them
   - Verify async/await functions are properly structured

## Adding Custom Endpoints

To add a new endpoint to the database:

1. Update `config.js` to include the new endpoint:
```javascript
dbConnections.newEndpoint = {
  endpoint: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com/newEndpoint.json",
  methods: ["GET", "POST"] // Specify allowed methods
}
```

2. Create corresponding utility functions in `firebase-data.js`
3. Implement the UI components to display or interact with the new data

## Offline Support

Firebase Realtime Database supports offline capabilities. To enable:

1. Set persistence on database connection:
```javascript
firebase.database().setPersistence(firebase.database.PERSISTENCE_LOCAL)
```

2. Handle offline/online state changes:
```javascript
firebase.database().ref('.info/connected').on('value', (snapshot) => {
  const isConnected = snapshot.val();
  // Update UI based on connection status
});
```

## Security Rules

For production use, implement custom security rules in the Firebase Console:

```
{
  "rules": {
    "treatment": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    },
    "resources": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    },
    "stories": {
      ".read": true,
      ".write": "auth != null"
    },
    "crisis": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
    }
  }
}
```