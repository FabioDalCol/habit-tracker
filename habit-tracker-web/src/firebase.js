import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import "firebase/compat/firestore"


const firebaseConfig = ""

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();