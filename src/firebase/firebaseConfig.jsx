// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLUNpCRlGDNQa72UyfLVJgxjWwHTd5qqY",
  authDomain: "prasadhub2.firebaseapp.com",
  projectId: "prasadhub2",
  storageBucket: "prasadhub2.appspot.com",
  messagingSenderId: "769070944215",
  appId: "1:769070944215:web:c13e34c5454d55c2660592",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, auth };
