import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAkF_mrMGYNjSWnZ9C-JAy2JVHP7HV01TM",
  authDomain: "miniblog-50b68.firebaseapp.com",
  projectId: "miniblog-50b68",
  storageBucket: "miniblog-50b68.appspot.com",
  messagingSenderId: "75217671153",
  appId: "1:75217671153:web:2d257a133127af9d772a50"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
