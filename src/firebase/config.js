// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ← nuevo import

// Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlxP8j97yRFko0Sx0DPEWIZI21b4kWXPM",
  authDomain: "eya2-proyectofinal.firebaseapp.com",
  projectId: "eya2-proyectofinal",
  storageBucket: "eya2-proyectofinal.firebasestorage.app",
  messagingSenderId: "332085057992",
  appId: "1:332085057992:web:dd634752e5ae82ef00c8fd",
  measurementId: "G-SK2YCTMMJL"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Autenticación y Firestore
const auth = getAuth(app);
const db = getFirestore(app); // ← Firestore inicializado

// Exportar servicios
export { auth, db };
