import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXWyqFI6QOMU8tIGIJxDMwk8qpHTHrBcs",
  authDomain: "elearning-platform-1eff6.firebaseapp.com",
  projectId: "elearning-platform-1eff6",
  storageBucket: "elearning-platform-1eff6.firebasestorage.app",
  messagingSenderId: "653345226652",
  appId: "1:653345226652:web:c496cbb69bbc974a851259"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;