// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLA0mP9nCbA40vpJBc0Fzhc4E40sq7sbU",
  authDomain: "mapories-aae8b.firebaseapp.com",
  projectId: "mapories-aae8b",
  storageBucket: "mapories-aae8b.firebasestorage.app",
  messagingSenderId: "106738362457",
  appId: "1:106738362457:web:57f387022022beeeb3a948",
  measurementId: "G-CT7QVM8NKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize auth

export { app, db, storage, auth };