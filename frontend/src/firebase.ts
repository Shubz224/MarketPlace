
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDV16lCbMSntBqzZAK8RztDzxzfo4_Poro",
  authDomain: "ecommerce-d9bc0.firebaseapp.com",
  projectId: "ecommerce-d9bc0",
  storageBucket: "ecommerce-d9bc0.firebasestorage.app",
  messagingSenderId: "982774866698",
  appId: "1:982774866698:web:7a80db8254c847ade750f3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
