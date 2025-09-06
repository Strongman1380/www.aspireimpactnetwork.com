---
description: Repository Information Overview
alwaysApply: true
---

# FosterLinks Information

## Summary
FosterLinks is a secure foster care management system designed for agencies, social workers, and foster parents. The application provides tools for managing youth profiles, medication logs, reports, and more with role-based access control. It's built as a Progressive Web App with offline support and includes a Swift implementation for iOS.

## Structure
- **src/**: Main React application source code with components, contexts, pages, and utilities
- **SwiftImplementation/**: Complete Swift implementation for iOS using Firebase services
- **SwiftExample/**: Simplified Swift example implementation
- **scripts/**: Utility scripts for Firebase setup and testing
- **public/**: Static assets and PWA configuration
- **build/**: Production build output

## Language & Runtime
**Languages**: TypeScript, JavaScript, Swift
**TypeScript Version**: 4.9.5 (target: ES5)
**Node.js Version**: v14 or higher required
**Build System**: Create React App (react-scripts)
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 18.2.0 with React DOM and React Router
- Firebase 10.8.0 (Authentication, Firestore, Storage)
- Material UI 5.15.10 with Emotion styling
- Zustand 5.0.4 for state management
- React Hook Form 7.57.0 with Yup 1.6.1 for validation

**Development Dependencies**:
- Jest and React Testing Library for testing
- TypeScript compiler and type definitions

## Build & Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Firebase Configuration
**Services**: Authentication, Firestore, Storage, Analytics
**Configuration**: Environment variables in .env.local file
**Offline Support**: Enabled with IndexedDB persistence
**Security Rules**: Custom Firestore security rules in firestore.rules

## Testing
**Framework**: Jest with React Testing Library
**Test Location**: src/**/__tests__/*.test.tsx
**Configuration**: Default Create React App test setup
**Run Command**:
```bash
npm test
```

## iOS Implementation
**Language**: Swift
**Firebase SDK**: FirebaseAuth, FirebaseFirestore, FirebaseStorage
**Features**: Authentication, youth profiles, role-based access, Firestore integration
**Setup**: Requires GoogleService-Info.plist configuration file