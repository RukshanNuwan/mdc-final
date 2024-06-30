import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCC7Q0-3Eb1W37-5GOPSQxpVMa2VM5wvGo",
  authDomain: "production-final.firebaseapp.com",
  projectId: "production-final",
  storageBucket: "production-final.appspot.com",
  messagingSenderId: "203820819897",
  appId: "1:203820819897:web:0eb31a43caa9c6fe814268",
  measurementId: "G-J5DR9EB699",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
