// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase Authentication 추가
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3DizZy_nTcNGZcKqF3dpnfCPfgXmu5nE",
  authDomain: "dictionary-86008.firebaseapp.com",
  projectId: "dictionary-86008",
  storageBucket: "dictionary-86008.firebasestorage.app",
  messagingSenderId: "737719248601",
  appId: "1:737719248601:web:d8d79297dbb738df0bc0c8",
  measurementId: "G-8GSP9L7WYK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Analytics
export const auth = getAuth(app); // Authentication 객체 생성 및 내보내기
export const analytics = getAnalytics(app);