import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDf1yprYLp9_Hy2a_Ys9429_MjUdK2sdiU",
  authDomain: "analog-context-514705-i4.firebaseapp.com",
  projectId: "analog-context-514705-i4",
  storageBucket: "analog-context-514705-i4.firebasestorage.app",
  messagingSenderId: "1092910034933",
  appId: "1:1092910034933:web:cb26fa1dd927cc72dbbabc",
  measurementId: "G-XB00WQDWSS"
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

