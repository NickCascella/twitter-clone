// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import firebase from "firebase/compat/app";
import firebase from "firebase/compat";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRl8wBHFB3OeICjOn0InyUDVTslIbeWM4",
  authDomain: "twitter-clone-848fe.firebaseapp.com",
  projectId: "twitter-clone-848fe",
  storageBucket: "twitter-clone-848fe.appspot.com",
  messagingSenderId: "273510697682",
  appId: "1:273510697682:web:9b71fc6497ccb86f617b0b",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export default firebase;
export { getFirestore, storage };
