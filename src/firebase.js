// firebase.js
import { initializeApp } from "firebase/app";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD4aGv68mxLB0Ja4svwiE8xayp4uBXbgwk",
  authDomain: "react-blog-app-6fd5d.firebaseapp.com",
  projectId: "react-blog-app-6fd5d",
  storageBucket: "react-blog-app-6fd5d.appspot.com",
  messagingSenderId: "465199603260",
  appId: "1:465199603260:web:e5b38976edc06da3f72d39",
  measurementId: "G-34E304XGB4",
  databaseURL: "https://react-blog-app-6fd5d-default-rtdb.firebaseio.com",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig); // Initialize the app

// Export the app as a named export
export { app }; // Use named export
