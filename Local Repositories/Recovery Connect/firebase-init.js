// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcp4pvdVEs5jG7yT7532BGzK0kf_aRQ1Q",
  authDomain: "lift-and-renewal-33bbb.firebaseapp.com",
  projectId: "lift-and-renewal-33bbb",
  storageBucket: "lift-and-renewal-33bbb.firebasestorage.app",
  messagingSenderId: "945546956580",
  appId: "1:945546956580:web:25c1c89b1778201f31edb1",
  measurementId: "G-4QK3K2Z4SP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };