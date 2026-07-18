import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmsMiA6z6noYBkVCRxcXqH1s5atnfXEVQ",
  authDomain: "video-circle-52af7.firebaseapp.com",
  projectId: "video-circle-52af7",
  storageBucket: "video-circle-52af7.firebasestorage.app",
  messagingSenderId: "433167331683",
  appId: "1:433167331683:web:342dff0c3bf1de8a606356"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { app, db, auth };