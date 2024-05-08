// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chathive-64d69.firebaseapp.com",
  projectId: "chathive-64d69",
  storageBucket: "chathive-64d69.appspot.com",
  messagingSenderId: "1033627581474",
  appId: "1:1033627581474:web:d12f8fef901f60d536de7b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
