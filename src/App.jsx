import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TechnologyCard from './components/TechnologyCard';
import PracticeSession from './components/PracticeSession';
import Profile from './components/Profile';
import AuthModal from './components/AuthModal';
import StartModal from './components/StartModal';
import { technologies, questions } from './data/questions';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [activeTech, setActiveTech] = useState('javascript');
  const [practiceMode, setPracticeMode] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user && authModal) setAuthModal(null);
  }, [user]);

  const handleStartPractice = useCallback((techId) => {
    const id = typeof techId === 'string' && questions[techId]?.length ? techId : 'javascript';
    setPracticeMode(id);
    setShowProfile(false);
    setShowStartModal(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, []);

  const handleNavigate = (sectionId) => {
    setPracticeMode(null);
    setShowProfile(false);

    const hash = sectionId ? `#${sectionId}` : '';
    window.location.hash = hash;

    const scrollToTarget = () => {
      if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    setTimeout(scrollToTarget, 0);
  };

  if (showProfile && user) {
    return (
      <div className="min-h-screen">
        <Header
          onLogoClick={() => handleNavigate('')}
          onProfileClick={() => setShowProfile(true)}
          onSignInClick={() => setAuthModal('signin')}
          showProfileLink
          isProfileActive
          onNavigate={handleNavigate}
        />
        <main>
          <Profile />
        </main>
        {authModal && (
          <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
        )}
        {showStartModal && (
          <StartModal
            onClose={() => setShowStartModal(false)}
            onStart={(techId) => {
              handleStartPractice(techId);
              setShowStartModal(false);
            }}
          />
        )}
      </div>
    );
  }

  if (practiceMode) {
    const tech = technologies.find((t) => t.id === practiceMode);
    const techQuestions = questions[practiceMode] || [];
    return (
      <div className="min-h-screen">
        <Header
          onLogoClick={() => handleNavigate('')}
          onProfileClick={() => setShowProfile(true)}
          onSignInClick={() => setAuthModal('signin')}
          showProfileLink={!!user}
          onNavigate={handleNavigate}
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
        {showStartModal && (
          <StartModal
            onClose={() => setShowStartModal(false)}
            onStart={(techId) => {
              handleStartPractice(techId);
              setShowStartModal(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        onLogoClick={() => handleNavigate('')}
        onProfileClick={() => setShowProfile(true)}
        onSignInClick={() => setAuthModal('signin')}
        showProfileLink={!!user}
        onNavigate={handleNavigate}
      />
      <main>
        <Hero onBoshlashClick={() => setShowStartModal(true)} />

        <section id="technologies" className="px-8 py-16 pt-12 max-w-[840px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[0.8125rem] font-semibold text-accent mb-4 uppercase tracking-widest">{t('section_technologies')}</span>
            <h2 className="text-4xl font-bold mb-4 tracking-tight text-text-primary">{t('section_learnTitle')}</h2>
            <p className="text-[1.0625rem] text-text-secondary leading-relaxed max-w-[520px] mx-auto">
              {t('section_learnDesc')}
            </p>
          </div>
          <div className="flex flex-col gap-6">
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
        </section>

        <footer className="py-12 px-8 border-t border-border mt-16">
          <div className="max-w-[840px] mx-auto text-center">
            <span className="block font-semibold text-lg mb-2 text-text-primary">◆ DevTip</span>
            <p className="text-[0.9375rem] text-text-muted mb-4">
              {t('footer_tagline')}
            </p>
            <p className="text-[0.8125rem] text-text-muted opacity-70">{t('footer_copyright')}</p>
          </div>
        </footer>
      </main>
      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
      )}
      {showStartModal && (
        <StartModal
          onClose={() => setShowStartModal(false)}
          onStart={(techId) => {
            handleStartPractice(techId);
            setShowStartModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
