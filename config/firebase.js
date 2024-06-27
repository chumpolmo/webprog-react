// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt_wFoCHOj2rNQR2jp6iSDuHdfAZ9klF4",
  authDomain: "cca-platforms-2mfa.firebaseapp.com",
  databaseURL: "https://cca-platforms-2mfa-default-rtdb.firebaseio.com",
  projectId: "cca-platforms-2mfa",
  storageBucket: "cca-platforms-2mfa.appspot.com",
  messagingSenderId: "640843289604",
  appId: "1:640843289604:web:0018503ed98caeb9059151",
  measurementId: "G-LNKN1RXNBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Google Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firebase constants
export const db = getDatabase(app);
