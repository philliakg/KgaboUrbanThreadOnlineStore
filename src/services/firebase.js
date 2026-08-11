// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg1b1-FEZO5Rz6JaGpUGK_UNmdRiyg8j8",
  authDomain: "urbanthreadsstore-2018a.firebaseapp.com",
  projectId: "urbanthreadsstore-2018a",
  storageBucket: "urbanthreadsstore-2018a.firebasestorage.app",
  messagingSenderId: "770070271100",
  appId: "1:770070271100:web:ffe06b9f28640bd6f7a5f9",
  measurementId: "G-S94VKDMHMQ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };