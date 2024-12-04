// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGMmwVa5J2owIUFGv5g_NVeZuBy3plKgM",
  authDomain: "sat-shop31.firebaseapp.com",
  projectId: "sat-shop31",
  storageBucket: "sat-shop31.firebasestorage.app",
  messagingSenderId: "895987162991",
  appId: "1:895987162991:web:8f41d34cb0fcaeae71129a",
  measurementId: "G-1G3G6MCBC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, analytics, auth, db, storage, functions };
