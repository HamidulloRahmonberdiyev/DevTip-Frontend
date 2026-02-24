import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TechnologyCard from './components/TechnologyCard';
import PracticeSession from './components/PracticeSession';
import Profile from './components/Profile';
import AuthModal from './components/AuthModal';
import StartModal from './components/StartModal';
import { technologies, questions } from './data/questions';
import { useAuth } from './context/AuthContext';

function App() {
  const [activeTech, setActiveTech] = useState('javascript');
  const [practiceMode, setPracticeMode] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
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
      <div className="min-h-screen">
        <Header
          onLogoClick={() => setShowProfile(false)}
          onProfileClick={() => setShowProfile(true)}
          onSignInClick={() => setAuthModal('signin')}
          showProfileLink
          isProfileActive
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
          onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onProfileClick={() => setShowProfile(true)}
          onSignInClick={() => setAuthModal('signin')}
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
        onLogoClick={() => window.location.hash = ''}
        onProfileClick={() => setShowProfile(true)}
        onSignInClick={() => setAuthModal('signin')}
        showProfileLink={!!user}
      />
      <main>
        <Hero onBoshlashClick={() => setShowStartModal(true)} />

        <section id="technologies" className="px-8 py-16 pt-12 max-w-[840px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[0.8125rem] font-semibold text-accent mb-4 uppercase tracking-widest">Texnologiyalar</span>
            <h2 className="text-4xl font-bold mb-4 tracking-tight text-text-primary">O‘rganishni boshlang</h2>
            <p className="text-[1.0625rem] text-text-secondary leading-relaxed max-w-[520px] mx-auto">
              Texnologiyani tanlang va «Boshlash» tugmasini bosing — savollarga javob yozishni boshlang
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
              Dasturchilar uchun intervyu tayyorgarligi. AI yordamida javoblaringizni tekshiring.
            </p>
            <p className="text-[0.8125rem] text-text-muted opacity-70">© 2025 DevTip · Demo versiya</p>
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
