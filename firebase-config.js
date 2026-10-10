/* ==========================================================================
   CampusLink - Firebase Configuration & Hybrid Store
   Supports both live Firebase credentials and client-side Mock Store
   ========================================================================== */

// Default configuration placeholder or local config from localStorage
const STORAGE_CONFIG_KEY = "campuslink_firebase_config";

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemoKeyNotConfiguredCampusLink01",
  authDomain: "campuslink-app.firebaseapp.com",
  projectId: "campuslink-app",
  storageBucket: "campuslink-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

export function getActiveFirebaseConfig() {
  const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not parse saved Firebase config, reverting to default", e);
    }
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveCustomFirebaseConfig(config) {
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
}

export function isUsingLiveFirebase() {
  const cfg = getActiveFirebaseConfig();
  return Boolean(cfg.apiKey && !cfg.apiKey.includes("DemoKeyNotConfigured") && window.firebase);
}

let firebaseApp = null;
let firebaseAuth = null;
let firebaseFirestore = null;
let firebaseStorage = null;

export function initFirebase() {
  const config = getActiveFirebaseConfig();
  if (isUsingLiveFirebase() && window.firebase) {
    try {
      if (!window.firebase.apps.length) {
        firebaseApp = window.firebase.initializeApp(config);
      } else {
        firebaseApp = window.firebase.app();
      }
      firebaseAuth = window.firebase.auth();
      firebaseFirestore = window.firebase.firestore();
      firebaseStorage = window.firebase.storage();
      console.log("🔥 Connected to Live Firebase project:", config.projectId);
    } catch (err) {
      console.warn("⚠️ Live Firebase initialization failed, falling back to local simulation:", err);
      firebaseApp = null;
    }
  } else {
    console.log("⚡ CampusLink running in High-Performance Local Simulation Mode (Offline/Demo Ready)");
  }

  return {
    app: firebaseApp,
    auth: firebaseAuth,
    firestore: firebaseFirestore,
    storage: firebaseStorage
  };
}

export const FirebaseClients = {
  get app() { return firebaseApp; },
  get auth() { return firebaseAuth; },
  get firestore() { return firebaseFirestore; },
  get storage() { return firebaseStorage; }
};
