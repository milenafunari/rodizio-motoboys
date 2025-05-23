import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCAfeeGe0I7ld15gPulIOH65vwOP5uExIQ",
  authDomain: "motoboys-8e22f.firebaseapp.com",
  databaseURL: "https://motoboys-8e22f-default-rtdb.firebaseio.com",
  projectId: "motoboys-8e22f",
  storageBucket: "motoboys-8e22f.appspot.com",
  messagingSenderId: "536849612319",
  appId: "1:536849612319:web:e9dfd0c4fd6693edc65f2a"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
