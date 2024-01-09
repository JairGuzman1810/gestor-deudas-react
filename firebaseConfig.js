import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJPA-H80OKQV5ALL3AwUmKnVZkmd_b7JY",
  authDomain: "gestor-deudas.firebaseapp.com",
  projectId: "gestor-deudas",
  storageBucket: "gestor-deudas.appspot.com",
  messagingSenderId: "768484984339",
  appId: "1:768484984339:web:9b6c174ea29131399721e6",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const FIREBASE_DATABASE = getDatabase(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
