import { useAuth } from '../context/AuthContext';

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

      <style>{`
        .profile {
          max-width: 480px;
          margin: 0 auto;
          padding: var(--space-2xl) var(--space-xl);
        }

        .profile__card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          overflow: hidden;
          position: relative;
          transition: border-color var(--duration-fast) var(--ease-out);
        }

        .profile__card:hover {
          border-color: var(--border-accent);
        }

        .profile__cover {
          height: 100px;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          opacity: 0.9;
        }

        .profile__avatar-wrap {
          position: relative;
          margin-top: -48px;
          padding: 0 var(--space-xl);
        }

        .profile__avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 4px solid var(--bg-secondary);
          object-fit: cover;
        }

        .profile__avatar-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 4px solid var(--bg-secondary);
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
        }

        .profile__info {
          padding: var(--space-xl);
          padding-top: var(--space-md);
        }

        .profile__name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-xs);
          color: var(--text-primary);
        }

        .profile__email {
          font-size: 0.9375rem;
          color: var(--text-muted);
        }

        .profile__stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xl);
          padding: var(--space-xl);
          border-top: 1px solid var(--border-subtle);
        }

        .profile__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile__stat-num {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-cyan);
          font-family: var(--font-mono);
        }

        .profile__stat-label {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .profile__stat-divider {
          width: 1px;
          height: 32px;
          background: var(--border-subtle);
        }

        .profile__signout {
          flex: 1;
          margin: 0 var(--space-xl) var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-xl);
          background: transparent;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-family: inherit;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .profile__signout:hover {
          border-color: rgba(239, 68, 68, 0.5);
          color: #f87171;
        }
      `}</style>
    </div>
  );
}
