/**
 * Firebase 初始化（只做三件事：App、Auth、Firestore）
 *
 * 兩種填法，選一種就好：
 * 1) 在 Google AI Studio 按「Enable Firebase」，平台會自動給你環境變數（VITE_FIREBASE_...）。
 * 2) 自己在 Firebase Console 建立專案，把設定貼進下面的 manualConfig。
 *
 * 如果兩種都沒有設定，網站不會壞掉：會自動切換成「本機示範模式」，
 * 資料暫時存在瀏覽器裡，讓你先看到完整畫面。
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// 👇 沒有環境變數時，可以把 Firebase Console → 專案設定 → 你的應用程式 的設定貼在這裡
const manualConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || manualConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || manualConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || manualConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || manualConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || manualConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || manualConfig.appId,
};

/** 有沒有成功設定 Firebase */
export const isFirebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function ensureApp(): FirebaseApp | null {
  if (!isFirebaseReady) return null;
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error('Firebase 初始化失敗', error);
      return null;
    }
  }
  return app;
}

export function getAuthSafe(): Auth | null {
  const a = ensureApp();
  if (!a) return null;
  if (!authInstance) authInstance = getAuth(a);
  return authInstance;
}

export function getDbSafe(): Firestore | null {
  const a = ensureApp();
  if (!a) return null;
  if (!dbInstance) dbInstance = getFirestore(a);
  return dbInstance;
}
