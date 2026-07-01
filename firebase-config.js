
// Firebase Realtime Database is recommended for the real deployment because it stores bookings centrally.
// Bookings will then appear on every device, including the staff dashboard.
// Replace the demo values below with your Firebase web app config.
// Keep this file name as firebase-config.js.

const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

const MARKO_DEMO_MODE = firebaseConfig.apiKey.includes("PASTE_");
