import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, GoogleAuthProvider, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

// Local: VITE_API_URL bo'sh → relative /api (Vite proxy orqali backend). Production: VITE_API_URL to'ldiring.
const raw = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '/api';
const BASE_URL = (raw === '' ? '/api' : raw).replace(/\/$/, '');

const authFetch = (path, opts = {}) =>
  fetch(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, { credentials: 'include', ...opts });

// Laravel API name/avatar → Profile uchun displayName/photoURL
const normalizeUser = (u) => {
  if (!u) return null;
  const name = u.name ?? ([u.first_name, u.last_name].filter(Boolean).join(' ').trim() || null);
  return {
    ...u,
    displayName: (u.displayName ?? name ?? u.email) ?? '',
    photoURL: u.photoURL ?? u.avatar ?? u.photo_url ?? u.profile_photo_url ?? '',
    email: u.email ?? '',
  };
};

// Bir vaqtning o'zida bitta /auth/me (Strict Mode / rate limit 429 dan qochish)
let mePromise = null;
const fetchMe = () => {
  if (!mePromise) {
    mePromise = authFetch('/auth/me')
      .then(async (res) => (res.ok ? normalizeUser((await res.json()).user) : null))
      .catch(() => null)
      .finally(() => {
        mePromise = null;
      });
  }
  return mePromise;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    fetchMe().then((u) => {
      if (!cancelledRef.current) setUser(u);
    }).finally(() => {
      if (!cancelledRef.current) setLoading(false);
    });
    return () => { cancelledRef.current = true; };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (cid) provider.setCustomParameters({ client_id: cid });
      const { user: u } = await signInWithPopup(auth, provider);
      const token = await u.getIdToken();
      const res = await authFetch('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: token }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user != null) setUser(normalizeUser(data.user));
      }
    } catch (err) {
      console.error('[Auth]', err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = useCallback(async () => {
    await authFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    if (auth) await firebaseSignOut(auth);
  }, []);

  // Boshqa route'larda 401 bo'lsa — shu funksiyani chaqiring yoki apiCall ishlating.
  const apiCall = useCallback(async (path, opts = {}) => {
    const res = await authFetch(path, opts);
    if (res.status === 401) {
      setUser(null);
      if (auth) await firebaseSignOut(auth);
    }
    return res;
  }, []);

  const getIdToken = () => (auth?.currentUser?.getIdToken() ?? null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        apiCall,
        getIdToken,
        isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Boshqa fayllarda API so'rovda credentials + 401 da logout kerak bo'lsa: useAuth().apiCall(path, opts)
export { BASE_URL, authFetch };
