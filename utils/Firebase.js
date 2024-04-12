// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage, ref, deleteObject } = require("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ03ICFsub1gcl_gxTTtKUbxxFtVXc__o",
  authDomain: "music-party-76c43.firebaseapp.com",
  projectId: "music-party-76c43",
  storageBucket: "music-party-76c43.appspot.com",
  messagingSenderId: "766359997366",
  appId: "1:766359997366:web:e2590bf85c2f04744ccf17",
  measurementId: "G-SHT8QX5C3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const firebaseStorage = getStorage(app);

module.exports = { app, firebaseStorage, ref };