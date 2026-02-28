import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, GoogleAuthProvider, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

const STORAGE_ACCESS = 'devtip_access_token';
const STORAGE_REFRESH = 'devtip_refresh_token';
const STORAGE_USER = 'devtip_user';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

let onLogoutCallback = () => {};

function getTokens() {
  try {
    return {
      access: localStorage.getItem(STORAGE_ACCESS),
      refresh: localStorage.getItem(STORAGE_REFRESH),
    };
  } catch {
    return { access: null, refresh: null };
  }
}

function setTokens(access, refresh) {
  try {
    if (access != null) localStorage.setItem(STORAGE_ACCESS, access);
    if (refresh != null) localStorage.setItem(STORAGE_REFRESH, refresh);
  } catch (_) {}
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u && typeof u === 'object' ? u : null;
  } catch {
    return null;
  }
}

function setStoredUser(u) {
  try {
    if (u == null) localStorage.removeItem(STORAGE_USER);
    else localStorage.setItem(STORAGE_USER, JSON.stringify(u));
  } catch (_) {}
}

function clearTokens() {
  try {
    localStorage.removeItem(STORAGE_ACCESS);
    localStorage.removeItem(STORAGE_REFRESH);
    localStorage.removeItem(STORAGE_USER);
  } catch (_) {}
  onLogoutCallback();
}

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

let refreshPromise = null;

/**
 * Refresh access token. Clears tokens ONLY on 401/403 from refresh endpoint.
 * On network error or 5xx we do NOT clear so session survives temporary failures.
 */
async function doRefresh() {
  const { refresh } = getTokens();
  if (!refresh) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refresh}` },
    });

    if (res.status === 401 || res.status === 403) {
      clearTokens();
      return false;
    }

    if (!res.ok) return false;

    let data;
    try {
      data = await res.json();
    } catch {
      return false;
    }

    if (data && data.access_token) {
      setTokens(data.access_token, data.refresh_token ?? refresh);
      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
}

async function authFetch(path, opts = {}) {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const isAuthRoute = path.includes('/auth/refresh') || path.includes('/auth/logout');

  const doRequest = (token) => {
    const headers = new Headers(opts.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...opts, headers });
  };

  let res = await doRequest(getTokens().access);

  if (res.status === 401 && !isAuthRoute) {
    if (refreshPromise == null) {
      refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      res = await doRequest(getTokens().access);
    }
  }

  return res;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    return stored ? normalizeUser(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const cancelledRef = useRef(false);

  onLogoutCallback = useCallback(() => setUser(null), []);

  useEffect(() => {
    cancelledRef.current = false;

    const init = async () => {
      const { access } = getTokens();

      if (!access) {
        const stored = getStoredUser();
        if (stored) {
          try {
            localStorage.removeItem(STORAGE_USER);
          } catch (_) {}
        }
        if (!cancelledRef.current) setUser(null);
        return;
      }

      const res = await authFetch('/auth/me');

      if (cancelledRef.current) return;

      if (res.ok) {
        try {
          const data = await res.json();
          const next = normalizeUser(data.user);
          if (next) {
            setStoredUser(next);
            setUser(next);
          } else {
            clearTokens();
            setUser(null);
          }
        } catch {
          setUser(getStoredUser() ? normalizeUser(getStoredUser()) : null);
        }
        return;
      }

      if (res.status === 401) {
        const refreshed = await doRefresh();
        if (cancelledRef.current) return;
        if (refreshed) {
          const retry = await authFetch('/auth/me');
          if (cancelledRef.current) return;
          if (retry.ok) {
            try {
              const data = await retry.json();
              const next = normalizeUser(data.user);
              if (next) {
                setStoredUser(next);
                setUser(next);
              } else {
                clearTokens();
                setUser(null);
              }
            } catch {
              setUser(getStoredUser() ? normalizeUser(getStoredUser()) : null);
            }
          } else {
            clearTokens();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        const stored = getStoredUser();
        setUser(stored ? normalizeUser(stored) : null);
      }
    };

    init().finally(() => {
      if (!cancelledRef.current) setLoading(false);
    });

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (cid) provider.setCustomParameters({ client_id: cid });
      const { user: u } = await signInWithPopup(auth, provider);
      const idToken = await u.getIdToken();
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });
      if (res.ok) {
        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);
        const next = data.user != null ? normalizeUser(data.user) : null;
        if (next) {
          setStoredUser(next);
          setUser(next);
        }
      }
    } catch (err) {
      console.error('[Auth]', err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = useCallback(async () => {
    const { access } = getTokens();
    if (access) {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${access}` },
        });
      } catch (_) {}
    }
    clearTokens();
    setUser(null);
    if (auth) await firebaseSignOut(auth);
  }, []);

  const apiCall = useCallback(async (path, opts = {}) => {
    const res = await authFetch(path, opts);
    if (res.status === 401) {
      clearTokens();
      setUser(null);
      if (auth) await firebaseSignOut(auth);
    }
    return res;
  }, []);

  const getAccessToken = () => getTokens().access;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        apiCall,
        getAccessToken,
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

export { BASE_URL, authFetch };
