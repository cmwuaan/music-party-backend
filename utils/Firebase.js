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
const firebaseApp = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

// Delete file from Firebase Storage
const deletefile = async (filePath, fileType, id) => {
  const path = `${filePath}/${id}.${fileType}`;

  // Create a reference to the file to delete
  const objectRef = ref(firebaseStorage, path);
  return await deleteObject(objectRef);
};

module.exports = { firebaseApp, firebaseStorage, deletefile };
