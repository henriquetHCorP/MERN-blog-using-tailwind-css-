// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(import.meta.env.VITE_FIREBASE_API_KEY); 
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-16694.firebaseapp.com",
  projectId: "mern-blog-16694",
  storageBucket: "mern-blog-16694.appspot.com",
  messagingSenderId: "69537562039",
  appId: "1:69537562039:web:3f77f8118c98dab8fa7c32"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);