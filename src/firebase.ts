// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRy-9BfKfVIT4UD4X2M9g4uQyVTAfXcq0",
  authDomain: "pvp-clicker.firebaseapp.com",
  databaseURL: "https://pvp-clicker-default-rtdb.firebaseio.com",
  projectId: "pvp-clicker",
  storageBucket: "pvp-clicker.firebasestorage.app",
  messagingSenderId: "863032910976",
  appId: "1:863032910976:web:3dbf9ba23d01529bbdb265",
  measurementId: "G-ZV91GERCBM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (only if supported, avoids SSR/Node errors)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

// Realtime Database
export const db = getDatabase(app);

export { app, analytics };
