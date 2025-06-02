# FosterLinks

FosterLinks is a secure foster care management system designed for agencies, social workers, and foster parents. The application provides tools for managing youth profiles, medication logs, reports, and more.

## Features

- **User Role-Based Access**: Different interfaces and permissions for administrators, social workers, and foster parents
- **Youth Profile Management**: Create, view, and manage youth profiles
- **Medication Tracking**: Log and monitor medication administration
- **Reporting System**: Generate and view reports
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Continue working even when offline
- **Progressive Web App**: Install on devices for app-like experience
- **Customizable Themes**: Personalize the application appearance

## Technology Stack

- **Frontend**: React, TypeScript, Material UI
- **State Management**: Zustand
- **Form Validation**: React Hook Form with Yup
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Testing**: Jest, React Testing Library
- **PWA Support**: Service Worker, Web App Manifest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fosterlinks.git
   cd fosterlinks
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase configuration to `src/firebase/firebase.ts`

4. Start the development server:
   ```
   npm start
   ```

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React contexts (Auth, Theme, UI)
├── firebase/         # Firebase configuration and utilities
├── pages/            # Application pages
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   ├── settings/     # Settings pages
│   └── youth/        # Youth profile pages
├── store/            # Zustand state management
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## Key Enhancements

1. **Dynamic Theme Implementation**: User-customizable themes with light/dark mode support
2. **Error Handling and Loading States**: Consistent approach with a UIContext
3. **Form Validation**: Robust form validation with React Hook Form and Yup
4. **State Management**: Global state management with Zustand
5. **Offline Support**: Firebase offline persistence for working without internet
6. **PWA Features**: Service worker for offline access and installable app
7. **Enhanced Security**: Improved Firestore security rules with data validation
8. **Comprehensive Testing**: Jest and React Testing Library tests
9. **Accessibility Improvements**: ARIA labels and keyboard navigation
10. **Performance Optimization**: Code splitting and optimized Firebase queries

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Create React App](https://github.com/facebook/create-react-app)
- [Material UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand](https://github.com/pmndrs/zustand)