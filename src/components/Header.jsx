import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Header({
  onLogoClick,
  onProfileClick,
  onSignInClick,
  onSignUpClick,
  showProfileLink = false,
  isProfileActive = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#" className="header__logo" onClick={(e) => { e.preventDefault(); onLogoClick?.(); }}>
          <span className="header__logo-icon">◆</span>
          <span className="header__logo-text">DevTip</span>
        </a>
        
        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <a href="#technologies" className="header__link" onClick={closeMenu}>Texnologiyalar</a>
          
          {user ? (
            <button
              className="header__profile-btn"
              onClick={() => { onProfileClick?.(); closeMenu(); }}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="header__avatar" />
              ) : (
                <span className="header__avatar-placeholder">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              )}
              <span className="header__profile-text">Profil</span>
            </button>
          ) : (
            <>
              <button
                className="header__auth-btn header__auth-btn--outline"
                onClick={() => { onSignInClick?.(); closeMenu(); }}
              >
                Kirish
              </button>
              <button
                className="header__auth-btn header__auth-btn--primary"
                onClick={() => { onSignUpClick?.(); closeMenu(); }}
              >
                Ro‘yxatdan o‘tish
              </button>
            </>
          )}

          <button
            className="header__theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘u rejim'}
            title={theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘u rejimga o‘tish'}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <span className="header__badge">Demo</span>
        </nav>

        <button 
          className="header__menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menyu"
        >
          <span className={menuOpen ? 'header__menu-btn--open' : ''}></span>
          <span className={menuOpen ? 'header__menu-btn--open' : ''}></span>
          <span className={menuOpen ? 'header__menu-btn--open' : ''}></span>
        </button>
      </div>

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: color-mix(in srgb, var(--bg-primary) 85%, transparent);
          border-bottom: 1px solid var(--border-subtle);
          transition: background var(--duration-normal) var(--ease-out);
        }

        .header__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-md) var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header__logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1.25rem;
          transition: color var(--duration-fast) var(--ease-out);
        }

        .header__logo:hover {
          color: var(--accent-cyan);
        }

        .header__logo-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          color: white;
        }

        .header__nav {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
        }

        .header__link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: color var(--duration-fast) var(--ease-out);
        }

        .header__link:hover {
          color: var(--accent-cyan);
        }

        .header__auth-btn {
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .header__auth-btn--outline {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }

        .header__auth-btn--outline:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }

        .header__auth-btn--primary {
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          border: none;
          color: white;
        }

        .header__auth-btn--primary:hover {
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
          transform: translateY(-1px);
        }

        .header__profile-btn {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-xs) var(--space-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .header__profile-btn:hover {
          border-color: var(--accent-cyan);
        }

        .header__avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }

        .header__avatar-placeholder {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
        }

        .header__profile-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .header__theme-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .header__theme-btn:hover {
          color: var(--accent-cyan);
          border-color: var(--border-accent);
        }

        .header__badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: var(--space-xs) var(--space-sm);
          background: var(--accent-cyan-dim);
          color: var(--accent-cyan);
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .header__menu-btn {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-sm);
        }

        .header__menu-btn span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: transform var(--duration-normal) var(--ease-out);
        }

        .header__menu-btn--open:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .header__menu-btn--open:nth-child(2) {
          opacity: 0;
        }
        .header__menu-btn--open:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        @media (max-width: 768px) {
          .header__nav {
            position: fixed;
            top: 57px;
            left: 0;
            right: 0;
            flex-direction: column;
            padding: var(--space-xl);
            background: color-mix(in srgb, var(--bg-primary) 98%, transparent);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-subtle);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all var(--duration-normal) var(--ease-out);
          }

          .header__nav--open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .header__auth-btn {
            width: 100%;
            justify-content: center;
          }

          .header__profile-btn {
            width: 100%;
            justify-content: center;
          }

          .header__menu-btn {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
