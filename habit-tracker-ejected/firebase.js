import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = ""

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authbase = getAuth();
const db = getFirestore();

export { authbase, db }
