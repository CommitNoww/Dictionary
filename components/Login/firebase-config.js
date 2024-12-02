import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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

// Initialize Firebase Auth and Analytics
export const auth = getAuth(app); // 내보내기 추가
export const analytics = getAnalytics(app);
