export default function TechnologyCard({ technology, isActive, onSelect, onStart }) {
  return (
    <div
      className={`tech-card ${isActive ? 'tech-card--active' : ''}`}
    >
      <button
        className="tech-card__select"
        onClick={() => onSelect(technology.id)}
      >
        <div 
          className="tech-card__icon" 
          style={{ '--tech-color': technology.color }}
        >
          {technology.icon}
        </div>
        <div className="tech-card__content">
          <h3 className="tech-card__name">{technology.name}</h3>
          <p className="tech-card__desc">{technology.description}</p>
          <span className="tech-card__count">{technology.count} savol</span>
        </div>
        <svg className="tech-card__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
      <button
        className="tech-card__start"
        onClick={() => onStart(technology.id)}
      >
        Boshlash
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <style>{`
        .tech-card {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-lg) var(--space-xl);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          transition: all var(--duration-normal) var(--ease-out);
          box-shadow: var(--shadow-sm);
        }

        .tech-card:hover {
          border-color: var(--border-accent);
          background: var(--bg-card-hover);
          box-shadow: var(--shadow-md);
        }

        .tech-card--active {
          border-color: var(--accent-cyan);
          background: var(--accent-cyan-dim);
          box-shadow: 0 0 0 1px var(--accent-cyan);
        }

        .tech-card__select {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          padding: 0;
        }

        .tech-card__icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--tech-color) 18%, transparent);
          color: var(--tech-color);
          font-weight: 700;
          font-size: 1.25rem;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .tech-card__content {
          flex: 1;
          min-width: 0;
        }

        .tech-card__name {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: var(--space-xs);
          color: var(--text-primary);
        }

        .tech-card__desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: var(--space-sm);
        }

        .tech-card__count {
          font-size: 0.8125rem;
          color: var(--accent-cyan);
          font-weight: 500;
        }

        .tech-card__arrow {
          flex-shrink: 0;
          color: var(--text-muted);
          transition: transform var(--duration-fast) var(--ease-out);
        }

        .tech-card:hover .tech-card__arrow {
          color: var(--accent-cyan);
          transform: translateX(4px);
        }

        .tech-card__start {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-xl);
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          border: none;
          border-radius: var(--radius-md);
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
        }

        .tech-card__start:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.35);
        }

        .tech-card__start:focus-visible {
          outline: 2px solid var(--accent-cyan);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .tech-card {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-md);
          }

          .tech-card__start {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
