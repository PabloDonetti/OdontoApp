import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebas
const firebaseConfig = {
  apiKey: "AIzaSyCF0F6QUNivjBRpDZDJ0wlmSRf1KtQGEHg",
  authDomain: "odontobuezzo-1108b.firebaseapp.com",
  projectId: "odontobuezzo-1108b",
  storageBucket: "odontobuezzo-1108b.firebasestorage.app",
  messagingSenderId: "601388394559",
  appId: "1:601388394559:web:132dbfd3d3a3de4828308a",
  measurementId: "G-3M1CF7BRTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
