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

  // Testing credentials
  // apiKey: "AIzaSyANBC7V28TG7hJ8epjWWCs7N_XlTUUiNNo",
  // authDomain: "production-tracking-syst-88fba.firebaseapp.com",
  // projectId: "production-tracking-syst-88fba",
  // storageBucket: "production-tracking-syst-88fba.appspot.com",
  // messagingSenderId: "780323806677",
  // appId: "1:780323806677:web:511ec997126361c3d3315c",
  // measurementId: "G-FH0H3KE7VG",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
