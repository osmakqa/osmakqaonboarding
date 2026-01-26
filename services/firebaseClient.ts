import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_W65snUERJ8oJRHaRzZg2qAq-Zuf_o0c",
  authDomain: "qa-training-ff350.firebaseapp.com",
  projectId: "qa-training-ff350",
  storageBucket: "qa-training-ff350.firebasestorage.app",
  messagingSenderId: "784540473207",
  appId: "1:784540473207:web:2fe160397db032d720f372",
  measurementId: "G-CG8VCXDVQS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);