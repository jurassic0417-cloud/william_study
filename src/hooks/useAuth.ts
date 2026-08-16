/** Google 登入：只有 /admin 會用到 */
import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { getAuthSafe, isFirebaseReady } from '../firebase';
import { ADMIN_EMAIL } from '../config';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: '' });

  useEffect(() => {
    const auth = getAuthSafe();
    if (!auth) {
      setState({ user: null, loading: false, error: '' });
      return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => setState({ user, loading: false, error: '' }),
      (error) => {
        console.error(error);
        setState({ user: null, loading: false, error: '登入狀態讀取失敗，請重新整理頁面。' });
      },
    );
    return unsubscribe;
  }, []);

  async function login() {
    const auth = getAuthSafe();
    if (!auth) {
      setState((s) => ({ ...s, error: '尚未設定 Firebase，無法使用 Google 登入。' }));
      return;
    }
    setState((s) => ({ ...s, error: '' }));
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const code = (error as { code?: string }).code ?? '';
      // 有些環境（例如嵌入的預覽視窗）會擋掉彈出視窗，改用轉址登入
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          console.error(redirectError);
        }
      }
      console.error(error);
      setState((s) => ({ ...s, error: describeAuthError(code) }));
    }
  }

  async function logout() {
    const auth = getAuthSafe();
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  const isAdmin =
    Boolean(state.user?.email) &&
    state.user!.email!.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return { ...state, isAdmin, login, logout, firebaseReady: isFirebaseReady };
}

function describeAuthError(code: string): string {
  switch (code) {
    case 'auth/popup-closed-by-user':
      return '登入視窗被關閉了，請再按一次登入。';
    case 'auth/unauthorized-domain':
      return '這個網址還沒被加入 Firebase 的授權網域，請到 Firebase Console → Authentication → Settings 加入。';
    case 'auth/network-request-failed':
      return '網路連線有問題，請確認網路後再試一次。';
    case 'auth/configuration-not-found':
      return 'Firebase Authentication 還沒啟用 Google 登入，請到 Firebase Console 開啟。';
    default:
      return '登入失敗，請稍後再試一次。';
  }
}
