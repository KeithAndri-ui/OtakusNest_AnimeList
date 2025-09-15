// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZq90dx-UM_oShJLtMvFBiGauK2m42ocs",
  authDomain: "otakusnest-4bf14.firebaseapp.com",
  projectId: "otakusnest-4bf14",
  storageBucket: "otakusnest-4bf14.firebasestorage.app",
  messagingSenderId: "213512391031",
  appId: "1:213512391031:web:4ab4b4cc08ad7e02fe7972"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
const db = getFirestore(app);

export { auth, db };