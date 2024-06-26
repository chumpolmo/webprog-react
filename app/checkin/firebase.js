// firebase.js
import { firebase } from 'firebase/app';
import 'firebase/database';

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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}
  
const database = firebase.database();
  
export { database };