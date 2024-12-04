// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb77szyEgj6sHihWqdLn3FM3WkPa-8Xlw",
  authDomain: "sat-shop-v4.firebaseapp.com",
  projectId: "sat-shop-v4",
  storageBucket: "sat-shop-v4.firebasestorage.app",
  messagingSenderId: "653266955168",
  appId: "1:653266955168:web:2d94d87c5afa61ffb4d2c5",
  measurementId: "G-92QSMTL5QL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, analytics, auth, db, storage, functions };
