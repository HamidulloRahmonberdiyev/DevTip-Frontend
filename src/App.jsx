import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TechnologyCard from './components/TechnologyCard';
import PracticeSession from './components/PracticeSession';
import Profile from './components/Profile';
import AuthModal from './components/AuthModal';
import StartModal from './components/StartModal';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { fetchQuestions, mapApiQuestionsToPractice, completeSession } from './services/questionsApi';
import { fetchTechnologies } from './services/technologiesApi';

const PRACTICE_STORAGE_KEY = 'devtip-practice-session';

function savePracticeSession(session) {
  try {
    if (session?.questions?.length) {
      sessionStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(PRACTICE_STORAGE_KEY);
    }
  } catch (_) {}
}

function getPracticeSession() {
  try {
    const raw = sessionStorage.getItem(PRACTICE_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.questions?.length ? data : null;
  } catch (_) {
    return null;
  }
}

function clearPracticeSession() {
  try {
    sessionStorage.removeItem(PRACTICE_STORAGE_KEY);
  } catch (_) {}
}

function App() {
  const [technologies, setTechnologies] = useState([]);
  const [technologiesLoading, setTechnologiesLoading] = useState(true);
  const [technologiesError, setTechnologiesError] = useState(null);
  const [activeTech, setActiveTech] = useState(null);
  const [practiceSession, setPracticeSessionState] = useState(null);
  const [practiceRestored, setPracticeRestored] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [startModalTechId, setStartModalTechId] = useState(null);
  const [pendingStartAfterLogin, setPendingStartAfterLogin] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const setPracticeSession = useCallback((value) => {
    setPracticeSessionState(value);
    if (value == null) {
      clearPracticeSession();
      setPracticeRestored(false);
    }
  }, []);

  useEffect(() => {
    if (practiceSession?.questions?.length) savePracticeSession(practiceSession);
  }, [practiceSession]);

  useEffect(() => {
    if (!technologies.length || !user || practiceSession !== null || practiceRestored) return;
    const saved = getPracticeSession();
    if (saved?.questions?.length) {
      setPracticeSessionState(saved);
      setPracticeRestored(true);
    }
  }, [technologies, user, practiceSession, practiceRestored]);

  useEffect(() => {
    let cancelled = false;
    setTechnologiesLoading(true);
    setTechnologiesError(null);
    fetchTechnologies()
      .then((list) => {
        if (!cancelled) {
          setTechnologies(list);
          if (list.length > 0) setActiveTech(list[0].id);
        }
      })
      .catch((err) => {
        if (!cancelled) setTechnologiesError(err.message || t('practice_error_generic'));
      })
      .finally(() => {
        if (!cancelled) setTechnologiesLoading(false);
      });
    return () => { cancelled = true; };
  }, [t]);

  useEffect(() => {
    if (user) {
      setAuthModal(null);
      if (pendingStartAfterLogin) {
        setPendingStartAfterLogin(false);
        setShowStartModal(true);
      }
    } else {
      setPracticeSession(null);
    }
  }, [user, pendingStartAfterLogin]);

  const handleStartPractice = useCallback(async (techId, level = 'junior', langId = null) => {
    const id = techId ?? technologies[0]?.id;
    if (id == null) return;
    setShowProfile(false);
    setQuestionsError(null);
    setQuestionsLoading(true);

    try {
      const data = await fetchQuestions({
        level,
        lang: langId ?? lang,
        technologyId: id,
        limit: 10,
        offset: 0,
      });
      const mapped = mapApiQuestionsToPractice(data.questions || [], level);
      const tech = technologies.find((t) => t.id === id);
      setPracticeSession({
        techId: id,
        technologyName: tech?.name || '',
        questions: mapped,
        sessionId: data.session_id ?? null,
        level,
        lang: langId ?? lang,
      });
      setShowStartModal(false);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    } catch (err) {
      setQuestionsError(err.message || t('practice_error_generic'));
    } finally {
      setQuestionsLoading(false);
    }
  }, [lang, t, technologies]);

  const handleLoadMoreQuestions = useCallback(async () => {
    if (!practiceSession?.questions?.length || !practiceSession.techId) return;
    const { techId, technologyName, sessionId, level, lang: sessionLang } = practiceSession;
    const offset = practiceSession.questions.length;
    try {
      const data = await fetchQuestions({
        level: level || 'junior',
        lang: sessionLang ?? lang,
        technologyId: techId,
        limit: 10,
        offset,
      });
      const mapped = mapApiQuestionsToPractice(data.questions || [], level || 'junior');
      if (mapped.length === 0) return;
      setPracticeSession((prev) => ({
        ...prev,
        questions: [...prev.questions, ...mapped],
        sessionId: data.session_id ?? prev.sessionId,
      }));
    } catch (_) {
      // load more xatosi — keyingi safar yana urinish mumkin
    }
  }, [lang, practiceSession]);

  const handleComplete = useCallback(async (results) => {
    const sessionId = practiceSession?.sessionId;
    try {
      if (sessionId) await completeSession({ sessionId, results });
    } catch (_) {}
    setPracticeSession(null);
  }, [practiceSession?.sessionId]);

  const handleBoshlashClick = useCallback((techId = null) => {
    if (!user) {
      setStartModalTechId(techId);
      setPendingStartAfterLogin(true);
      setAuthModal('signin');
      return;
    }
    setStartModalTechId(techId);
    setShowStartModal(true);
  }, [user]);

  const handleNavigate = (sectionId) => {
    setPracticeSession(null);
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
          <AuthModal mode={authModal} onClose={() => { setAuthModal(null); setPendingStartAfterLogin(false); }} />
        )}
        {showStartModal && (
          <StartModal
            technologies={technologies}
            initialTechId={startModalTechId}
            onClose={() => setShowStartModal(false)}
            onStart={(techId, level, langId) => handleStartPractice(techId, level, langId)}
            loading={questionsLoading}
            error={questionsError}
          />
        )}
      </div>
    );
  }

  if (practiceSession) {
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
            questions={practiceSession.questions}
            technologyName={practiceSession.technologyName}
            sessionId={practiceSession.sessionId}
            onBack={() => setPracticeSession(null)}
            onLoadMore={handleLoadMoreQuestions}
            onComplete={handleComplete}
          />
        </main>
        {authModal && (
          <AuthModal mode={authModal} onClose={() => { setAuthModal(null); setPendingStartAfterLogin(false); }} />
        )}
        {showStartModal && (
          <StartModal
            technologies={technologies}
            initialTechId={startModalTechId}
            onClose={() => setShowStartModal(false)}
            onStart={(techId, level, langId) => handleStartPractice(techId, level, langId)}
            loading={questionsLoading}
            error={questionsError}
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
        <Hero onBoshlashClick={() => handleBoshlashClick(null)} />

        <section id="technologies" className="px-8 py-16 pt-12 max-w-[840px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[0.8125rem] font-semibold text-accent mb-4 uppercase tracking-widest">{t('section_technologies')}</span>
            <h2 className="text-4xl font-bold mb-4 tracking-tight text-text-primary">{t('section_learnTitle')}</h2>
            <p className="text-[1.0625rem] text-text-secondary leading-relaxed max-w-[520px] mx-auto">
              {t('section_learnDesc')}
            </p>
          </div>
          {technologiesLoading ? (
            <div className="text-center py-12 text-text-secondary">{t('practice_checking')}</div>
          ) : technologiesError ? (
            <div className="text-center py-12 text-[var(--accent-red,#ef4444)]">{technologiesError}</div>
          ) : (
            <div className="flex flex-col gap-6">
              {technologies.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  technology={tech}
                  isActive={activeTech === tech.id}
                  onSelect={setActiveTech}
                  onStart={(techId) => { setActiveTech(techId); handleBoshlashClick(techId); }}
                />
              ))}
            </div>
          )}
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
        <AuthModal mode={authModal} onClose={() => { setAuthModal(null); setPendingStartAfterLogin(false); }} />
      )}
      {showStartModal && (
        <StartModal
          technologies={technologies}
          initialTechId={startModalTechId}
          onClose={() => setShowStartModal(false)}
          onStart={(techId, level, langId) => handleStartPractice(techId, level, langId)}
          loading={questionsLoading}
          error={questionsError}
        />
      )}
    </div>
  );
}

export default App;
