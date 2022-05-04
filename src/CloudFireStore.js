// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
initializeApp({
  apiKey: "AIzaSyDvOfLuNCpE6ExfMsvY14gTxHI1YmEyfEo",
  authDomain: "todo-e1130.firebaseapp.com",
  projectId: "todo-e1130",
});

const db = getFirestore();
export default db;
