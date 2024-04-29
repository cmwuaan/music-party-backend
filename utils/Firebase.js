const { initializeApp } = require('firebase/app');
const { getStorage, ref, deleteObject } = require('firebase/storage');
require('dotenv').config();

const apiKey = process.env.FIREBASE_API_KEY;
const projectId = process.env.FIREBASE_PROJECT_ID;
const messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.FIREBASE_APP_ID;
const measurementId = process.env.FIREBASE_MEASUREMENT_ID;

// Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseStorage = getStorage(app);

module.exports = { app, firebaseStorage, ref };
