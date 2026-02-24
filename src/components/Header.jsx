import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LANG_OPTIONS = [
  { id: 'uz', label: 'Uzbek tili' },
  { id: 'en', label: 'Ingliz tili' },
  { id: 'ru', label: 'Rus tili' },
];

export default function Header({
  onLogoClick,
  onProfileClick,
  onSignInClick,
  showProfileLink = false,
  isProfileActive = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const currentLangLabel = LANG_OPTIONS.find((o) => o.id === lang)?.label || 'Uzbek tili';

  return (
    <header className="sticky top-0 z-[100] border-b border-border backdrop-blur-[20px] bg-[color-mix(in_srgb,var(--bg-primary)_85%,transparent)] transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
        <a
          href="#"
          className="group flex items-center gap-2 no-underline font-semibold text-xl text-text-primary transition-colors duration-150 hover:text-accent"
          onClick={(e) => { e.preventDefault(); onLogoClick?.(); }}
        >
          <span className="w-9 h-9 flex items-center justify-center rounded-sm bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] text-white transition-all duration-150 group-hover:bg-accent-dim [&_svg]:w-5 [&_svg]:h-5" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
            </svg>
          </span>
          <span>DevTip</span>
        </a>

        <nav
          className={`
            flex items-center gap-6
            max-md:fixed max-md:top-[57px] max-md:left-0 max-md:right-0 max-md:flex-col max-md:py-8 max-md:px-8
            max-md:bg-[color-mix(in_srgb,var(--bg-primary)_98%,transparent)] max-md:backdrop-blur-[20px] max-md:border-b max-md:border-border
            max-md:transition-all max-md:duration-200 max-md:-translate-y-full max-md:opacity-0 max-md:invisible
            ${menuOpen ? 'max-md:translate-y-0 max-md:opacity-100 max-md:visible' : ''}
          `}
        >
          <a href="#technologies" className="text-text-secondary no-underline text-[0.9375rem] font-medium transition-colors duration-150 hover:text-accent" onClick={closeMenu}>
            Texnologiyalar
          </a>

          <div className="relative" ref={langRef}>
            <button
              type="button"
              className="flex items-center gap-2 py-2 px-4 bg-tertiary border border rounded-md text-text-secondary text-sm font-medium cursor-pointer transition-all duration-150 hover:text-text-primary hover:border-border-accent max-md:w-full max-md:justify-center"
              onClick={() => setLangOpen((o) => !o)}
              aria-expanded={langOpen}
              aria-haspopup="true"
            >
              <span className="inline-flex items-center justify-center shrink-0 text-inherit [&_svg]:block [&_svg]:w-[18px] [&_svg]:h-[18px]" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </span>
              <span className="max-w-[100px] truncate">{currentLangLabel}</span>
              <svg className="shrink-0 opacity-70 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {langOpen && (
              <div className="absolute top-[calc(100%+2px)] right-0 min-w-[160px] p-1 bg-secondary border border rounded-md shadow-lg z-50 animate-[headerLangIn_0.2s_ease-out] max-md:left-0 max-md:right-0 max-md:min-w-0">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`w-full block py-2 px-4 text-left border-none rounded-sm text-sm font-medium cursor-pointer transition-all duration-150
                      ${lang === opt.id ? 'text-accent bg-accent-dim' : 'text-text-secondary bg-transparent hover:bg-tertiary hover:text-text-primary'}
                    `}
                    onClick={() => { setLang(opt.id); setLangOpen(false); closeMenu(); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <button
              className="flex items-center gap-2 py-1 px-4 bg-tertiary border border rounded-full cursor-pointer transition-all duration-150 hover:border-accent max-md:w-full max-md:justify-center"
              onClick={() => { onProfileClick?.(); closeMenu(); }}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] flex items-center justify-center text-xs font-bold text-white">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-sm font-medium text-text-primary">Profil</span>
            </button>
          ) : (
            <button
              className="py-2 px-4 rounded-md text-[0.9375rem] font-semibold cursor-pointer transition-all duration-150 border-none bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] text-white hover:shadow-[0_4px_20px_rgba(6,182,212,0.4)] hover:-translate-y-px max-md:w-full max-md:justify-center"
              onClick={() => { onSignInClick?.(); closeMenu(); }}
            >
              Kirish
            </button>
          )}

          <button
            className="w-10 h-10 flex items-center justify-center bg-tertiary border border rounded-md text-text-secondary cursor-pointer transition-all duration-150 hover:text-accent hover:border-border-accent"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Yorug\' rejim' : 'Qorong\'u rejim'}
            title={theme === 'dark' ? 'Yorug\' rejimga o\'tish' : 'Qorong\'u rejimga o\'tish'}
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
        </nav>

        <button
          className="hidden max-md:flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menyu"
        >
          <span className={`block w-6 h-0.5 rounded-sm bg-text-primary transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-x-1 translate-y-1' : ''}`} />
          <span className={`block w-6 h-0.5 rounded-sm bg-text-primary transition-transform duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 rounded-sm bg-text-primary transition-transform duration-200 ${menuOpen ? '-rotate-45 translate-x-1 -translate-y-1' : ''}`} />
        </button>
      </div>
    </header>
  );
}
