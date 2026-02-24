import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

export default function Profile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const displayName = user.displayName || 'Foydalanuvchi';
  const email = user.email || '';
  const photoURL = user.photoURL || '';

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__cover" />
        <div className="profile__avatar-wrap">
          {photoURL ? (
            <img src={photoURL} alt="" className="profile__avatar" />
          ) : (
            <div className="profile__avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{displayName}</h1>
          {email && <p className="profile__email">{email}</p>}
        </div>

        <div className="profile__stats">
          <div className="profile__stat">
            <span className="profile__stat-num">0</span>
            <span className="profile__stat-label">Javoblar</span>
          </div>
          <div className="profile__stat-divider" />
          <div className="profile__stat">
            <span className="profile__stat-num">0</span>
            <span className="profile__stat-label">Texnologiyalar</span>
          </div>
        </div>

        <button className="profile__signout" onClick={signOut}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Chiqish
        </button>
      </div>
    </div>
  );
}
