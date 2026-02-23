import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TechnologyCard from './components/TechnologyCard';
import PracticeSession from './components/PracticeSession';
import Profile from './components/Profile';
import AuthModal from './components/AuthModal';
import { technologies, questions } from './data/questions';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const [activeTech, setActiveTech] = useState('javascript');
  const [practiceMode, setPracticeMode] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && authModal) setAuthModal(null);
  }, [user]);

  const handleStartPractice = (techId) => {
    setPracticeMode(techId);
    setShowProfile(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showProfile && user) {
    return (
      <div className="app">
        <Header
          onLogoClick={() => setShowProfile(false)}
          onProfileClick={() => setShowProfile(true)}
          onSignInClick={() => setAuthModal('signin')}
          onSignUpClick={() => setAuthModal('signup')}
          showProfileLink
          isProfileActive
        />
        <main>
          <Profile />
        </main>
        {authModal && (
          <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
        )}
      </div>
    );
  }

  if (practiceMode) {
    const tech = technologies.find((t) => t.id === practiceMode);
    const techQuestions = questions[practiceMode] || [];
    return (
      <div className="app">
        <Header
          onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onProfileClick={() => setShowProfile(true)}
          onSignInClick={() => setAuthModal('signin')}
          onSignUpClick={() => setAuthModal('signup')}
          showProfileLink={!!user}
        />
        <main>
          <PracticeSession
            questions={techQuestions}
            technologyName={tech?.name || ''}
            onBack={() => setPracticeMode(null)}
          />
        </main>
        {authModal && (
          <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        onLogoClick={() => window.location.hash = ''}
        onProfileClick={() => setShowProfile(true)}
        onSignInClick={() => setAuthModal('signin')}
        onSignUpClick={() => setAuthModal('signup')}
        showProfileLink={!!user}
      />
      <main>
        <Hero />
        
        <section id="technologies" className="section section--technologies">
          <div className="container">
            <div className="section__header">
              <span className="section__badge">Texnologiyalar</span>
              <h2 className="section__title">O‘rganishni boshlang</h2>
              <p className="section__subtitle">
                Texnologiyani tanlang va «Boshlash» tugmasini bosing — savollarga javob yozishni boshlang
              </p>
            </div>
            <div className="tech-grid">
              {technologies.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  technology={tech}
                  isActive={activeTech === tech.id}
                  onSelect={setActiveTech}
                  onStart={handleStartPractice}
                />
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            <div className="footer__inner">
              <span className="footer__logo">◆ DevTip</span>
              <p className="footer__text">
                Dasturchilar uchun intervyu tayyorgarligi. AI yordamida javoblaringizni tekshiring.
              </p>
              <p className="footer__copy">© 2025 DevTip · Demo versiya</p>
            </div>
          </div>
        </footer>
      </main>
      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
      )}

      <style>{`
        .app {
          min-height: 100vh;
        }

        .section {
          padding: var(--space-3xl) var(--space-xl);
        }

        .container {
          max-width: 840px;
          margin: 0 auto;
        }

        .section__header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .section__badge {
          display: inline-block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--accent-cyan);
          margin-bottom: var(--space-md);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .section__title {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: var(--space-md);
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .section__subtitle {
          font-size: 1.0625rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 520px;
          margin: 0 auto;
        }

        .tech-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .section--technologies {
          padding-top: var(--space-2xl);
        }

        .footer {
          padding: var(--space-2xl) var(--space-xl);
          border-top: 1px solid var(--border-subtle);
          margin-top: var(--space-3xl);
        }

        .footer__inner {
          max-width: 840px;
          margin: 0 auto;
          text-align: center;
        }

        .footer__logo {
          font-weight: 600;
          font-size: 1.125rem;
          display: block;
          margin-bottom: var(--space-sm);
          color: var(--text-primary);
        }

        .footer__text {
          font-size: 0.9375rem;
          color: var(--text-muted);
          margin-bottom: var(--space-md);
        }

        .footer__copy {
          font-size: 0.8125rem;
          color: var(--text-muted);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

export default App;
