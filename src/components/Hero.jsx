import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const HERO_CODE = `// DevTip - Interview Ready
const skills = ['JS', 'Python', 'PHP'];
const level = 'Professional';

skills.forEach(skill => 
  prepare(skill, level)
);`;

function Typewriter({ text, delay = 0, speed = 40, className = '', showCursor = true }) {
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started || !text) return;
    let i = 0;
    const t = setInterval(() => {
      if (i <= text.length) {
        setDisplay(text.slice(0, i));
        if (i === text.length) setDone(true);
        i++;
      } else {
        clearInterval(t);
      }
    }, speed);
    return () => clearInterval(t);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {display}
      {showCursor && !done && (
        <span className="inline-block ml-0.5 font-light text-accent animate-[heroBlink_1s_ease-in-out_infinite]" aria-hidden>|</span>
      )}
    </span>
  );
}

function getCodeCharDelay(char, nextChar) {
  if (char === '\n') return 280 + Math.random() * 120;
  if (char === ';') return 220 + Math.random() * 80;
  if (char === '{' || char === '(') return 150 + Math.random() * 60;
  if (char === ')' || char === '}') return 120 + Math.random() * 50;
  if (char === ' ' || char === ',') return 60 + Math.random() * 40;
  if (char === '=' || char === '>' || char === '<') return 100 + Math.random() * 40;
  return 35 + Math.random() * 45;
}

const CODE_PAUSE_AFTER = 2200;
const CODE_RESTART_DELAY = 800;

function CodeTypewriter({ code, delay = 0 }) {
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!code) return;
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [code, delay]);

  useEffect(() => {
    if (!started || !code) return;
    let i = 0;
    let timeoutId = null;

    function typeNext() {
      if (i <= code.length) {
        setDisplay(code.slice(0, i));
        if (i === code.length) {
          timeoutId = setTimeout(loopAgain, CODE_PAUSE_AFTER);
          return;
        }
        const char = code[i];
        const nextChar = code[i + 1];
        const ms = getCodeCharDelay(char, nextChar);
        i++;
        timeoutId = setTimeout(typeNext, ms);
      }
    }

    function loopAgain() {
      setDisplay('');
      i = 0;
      timeoutId = setTimeout(typeNext, CODE_RESTART_DELAY);
    }

    typeNext();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [started, code]);

  return (
    <>
      {display}
      <span className="inline-block ml-0.5 font-normal text-accent animate-[heroBlink_0.85s_ease-in-out_infinite]" aria-hidden>|</span>
    </>
  );
}

export default function Hero({ onBoshlashClick }) {
  const { t } = useLanguage();
  return (
    <section className="max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[88vh] max-md:text-center max-md:pt-12 max-md:min-h-0">
      <div>
        <div className="inline-flex items-center gap-2 text-sm text-text-secondary mb-6 py-2 px-4 bg-card border border-border rounded-full backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-[heroPulse_2s_ease-in-out_infinite]" />
          <Typewriter text={t('hero_badge')} delay={200} speed={42} />
        </div>
        <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-tight mb-6 tracking-tight text-text-primary">
          <Typewriter text={t('hero_title1')} delay={400} speed={38} showCursor={false} />
          <span className="bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] bg-clip-text text-transparent">
            <Typewriter text={t('hero_title2')} delay={750} speed={32} showCursor={false} />
          </span>
          <br />
          <Typewriter text={t('hero_title3')} delay={1150} speed={28} />
        </h1>
        <p className="text-lg text-text-secondary max-w-[440px] mb-8 leading-relaxed max-md:mx-auto">
          <Typewriter
            text={t('hero_desc')}
            delay={1950}
            speed={14}
          />
        </p>
        <div className="flex items-center gap-8 mb-8 py-6 max-md:justify-center">
          <div className="flex flex-col gap-1">
            <span className="text-[1.75rem] font-bold text-accent font-mono">20</span>
            <span className="text-[0.8125rem] text-text-muted">{t('hero_stat_tech')}</span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex flex-col gap-1">
            <span className="text-[1.75rem] font-bold text-accent font-mono">10000+</span>
            <span className="text-[0.8125rem] text-text-muted">{t('hero_stat_questions')}</span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex flex-col gap-1">
            <span className="text-[1.75rem] font-bold text-accent font-mono">50+</span>
            <span className="text-[0.8125rem] text-text-muted">{t('hero_stat_users')}</span>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 py-4 px-8 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] text-white font-semibold text-base border-none rounded-md cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-glow relative z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof onBoshlashClick === 'function') onBoshlashClick();
          }}
          aria-label={t('hero_cta')}
        >
          {t('hero_cta')}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <div className="flex justify-center max-md:order-first">
        <div className="bg-tertiary border border-border rounded-lg overflow-hidden shadow-lg max-w-[400px] min-w-[320px] transition-shadow duration-200 hover:shadow-glow">
          <div className="p-4 flex gap-2 bg-secondary border-b border-border">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-[var(--accent-cyan)]" />
          </div>
          <pre className="p-8 font-mono text-sm leading-[1.7] text-text-secondary m-0 overflow-x-auto min-h-[11rem] block box-border">
            <CodeTypewriter code={HERO_CODE} delay={800} />
          </pre>
        </div>
      </div>
    </section>
  );
}
