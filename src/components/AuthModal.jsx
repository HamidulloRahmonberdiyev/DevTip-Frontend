import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

export default function AuthModal({ mode = 'signin', onClose }) {
  const { signInWithGoogle, loading, isFirebaseConfigured } = useAuth();

  const isSignIn = mode === 'signin';

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="Yopish">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="auth-modal__content">
          <div className="auth-modal__icon">
            <span>◆</span>
          </div>
          <h2 className="auth-modal__title">
            {isSignIn ? 'Tizimga kirish' : 'Ro‘yxatdan o‘tish'}
          </h2>
          <p className="auth-modal__desc">
            {isSignIn
              ? 'DevTip bilan savollarga javob yozing va AI orqali baholash oling'
              : 'Hisob yarating va intervyu tayyorgarligini boshlang'}
          </p>

          {isFirebaseConfigured ? (
            <button
              className="auth-modal__google"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              {loading ? (
                <span className="auth-modal__spinner" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Google orqali {isSignIn ? 'kiring' : 'ro‘yxatdan o‘ting'}
            </button>
          ) : (
            <div className="auth-modal__notice">
              <p>Firebase sozlanmagan. .env faylida VITE_FIREBASE_* o‘zgaruvchilarini qo‘shing.</p>
            </div>
          )}

          <p className="auth-modal__footer">
            Google hisobingiz bilan bir bosishda {isSignIn ? 'kiring' : 'hisob yarating'}.
          </p>
        </div>
      </div>
    </div>
  );
}
