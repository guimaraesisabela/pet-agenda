// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDo-BkCbXQxp3AxCN2KQSeds_7-WbZsMfk",
  authDomain: "augenda-pet.firebaseapp.com",
  projectId: "augenda-pet",
  storageBucket: "augenda-pet.appspot.com",
  messagingSenderId: "896648056215",
  appId: "1:896648056215:web:ad732a2b3eba625bc4c8d2",
  measurementId: "G-KJENFC6Q34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
