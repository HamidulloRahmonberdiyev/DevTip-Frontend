export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot"></span>
          Dasturchilar uchun
        </div>
        <h1 className="hero__title">
          Intervyu
          <span className="hero__title-accent"> savollari</span>
          <br />
          va professional javoblar
        </h1>
        <p className="hero__desc">
          JavaScript, React, CSS va Algoritmlar bo‘yicha 18+ savol. 
          AI yordamida javoblaringizni tekshiring va bilimingizni oshiring.
        </p>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">4</span>
            <span className="hero__stat-label">Texnologiya</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-num">18+</span>
            <span className="hero__stat-label">Savol</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-num">3</span>
            <span className="hero__stat-label">Daraja</span>
          </div>
        </div>
        <a href="#technologies" className="hero__cta">
          Boshlash
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
      <div className="hero__visual">
        <div className="hero__code-block">
          <div className="hero__code-header">
            <span></span><span></span><span></span>
          </div>
          <pre className="hero__code">
{`// DevTip - Interview Ready
const skills = ['JS', 'React', 'CSS'];
const level = 'Professional';

skills.forEach(skill => 
  prepare(skill, level)
);`}
          </pre>
        </div>
      </div>

      <style>{`
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-3xl) var(--space-xl);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3xl);
          align-items: center;
          min-height: 88vh;
        }

        .hero__badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-lg);
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          backdrop-filter: blur(8px);
        }

        .hero__badge-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-cyan);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .hero__title {
          font-size: clamp(2.5rem, 5vw, 3.75rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: var(--space-lg);
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .hero__title-accent {
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero__desc {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 440px;
          margin-bottom: var(--space-xl);
          line-height: 1.7;
        }

        .hero__stats {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
          padding: var(--space-lg) 0;
        }

        .hero__stat {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .hero__stat-num {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent-cyan);
          font-family: var(--font-mono);
        }

        .hero__stat-label {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .hero__stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-subtle);
        }

        .hero__cta {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-xl);
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          border-radius: var(--radius-md);
          transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
        }

        .hero__cta:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
        }

        .hero__visual {
          display: flex;
          justify-content: center;
        }

        .hero__code-block {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          max-width: 400px;
          transition: box-shadow var(--duration-normal) var(--ease-out);
        }

        .hero__code-block:hover {
          box-shadow: var(--shadow-glow);
        }

        .hero__code-header {
          padding: var(--space-md);
          display: flex;
          gap: 8px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-subtle);
        }

        .hero__code-header span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .hero__code-header span:nth-child(1) { background: #ef4444; }
        .hero__code-header span:nth-child(2) { background: #eab308; }
        .hero__code-header span:nth-child(3) { background: var(--accent-cyan); }

        .hero__code {
          padding: var(--space-xl);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
          overflow-x: auto;
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: var(--space-2xl);
            min-height: auto;
          }

          .hero__desc { margin-left: auto; margin-right: auto; }
          .hero__stats { justify-content: center; }
          .hero__visual { order: -1; }
        }
      `}</style>
    </section>
  );
}
