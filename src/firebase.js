// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyaBF8RthPHBdLrsgjvfMRx3Ol2x025vo",
  authDomain: "first-chat-app-e8d5e.firebaseapp.com",
  projectId: "first-chat-app-e8d5e",
  storageBucket: "first-chat-app-e8d5e.appspot.com",
  messagingSenderId: "370642314524",
  appId: "1:370642314524:web:1dbc602ac718fa4940c6d9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
