import React from 'react';
import { Volume2, VolumeX, BookOpen, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function Navbar({
  levelData,
  highScore,
  onOpenGuide,
  onRestart,
  isMuted,
  setIsMuted,
}) {
  const handleToggleSound = () => {
    const nextState = sounds.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <header className="navbar-container" id="game-navbar">
      <div className="navbar-left">
        <div className="brand-logo" id="brand-logo">
          <div className="logo-icon-wrapper">
            <span className="logo-emoji">♻️</span>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              EKO-AYRIŞTIRICI <span className="badge-cop31">COP31</span>
            </div>
            <div className="brand-sub">Sıfır Atık Laboratuvarı • Antalya</div>
          </div>
        </div>

        {levelData && (
          <div className="level-badge" id="level-badge">
            <Sparkles size={14} className="text-emerald" />
            <span>{levelData.name}</span>
            <span className="level-pill">Kademe {levelData.level}</span>
          </div>
        )}
      </div>

      <div className="navbar-right">
        <div className="high-score-chip" title="En Yüksek Skor">
          <Trophy size={16} className="text-amber" />
          <span className="high-score-val">{highScore}</span>
        </div>

        <button
          className="btn-nav"
          id="btn-waste-guide"
          onClick={() => {
            sounds.playClick();
            onOpenGuide();
          }}
          title="Atık Sözlüğü & Rehber"
        >
          <BookOpen size={17} />
          <span className="btn-label-desktop">Atık Rehberi</span>
        </button>

        <button
          className="btn-nav-icon"
          id="btn-sound-toggle"
          onClick={handleToggleSound}
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        >
          {isMuted ? <VolumeX size={18} className="text-muted" /> : <Volume2 size={18} className="text-emerald" />}
        </button>

        <button
          className="btn-nav-icon"
          id="btn-restart-game"
          onClick={() => {
            sounds.playClick();
            onRestart();
          }}
          title="Yeniden Başlat"
          aria-label="Yeniden Başlat"
        >
          <RotateCcw size={17} />
        </button>
      </div>

      <style>{`
        .navbar-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 10;
        }
        .navbar-left, .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }
        .logo-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.15));
          border: 1px solid rgba(16, 185, 129, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.3);
        }
        .logo-emoji {
          font-size: 1.6rem;
        }
        .brand-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .badge-cop31 {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
          background: linear-gradient(135deg, #10b981, #0284c7);
          color: white;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .brand-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .level-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-subtle);
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
        }
        .level-pill {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-size: 0.7rem;
          padding: 1px 6px;
          border-radius: 999px;
        }
        .high-score-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 0.4rem 0.75rem;
          border-radius: 999px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          color: #fbbf24;
        }
        .btn-nav {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: var(--text-white);
          padding: 0.45rem 0.9rem;
          border-radius: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-nav:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }
        .btn-nav-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          color: var(--text-white);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-nav-icon:hover {
          background: rgba(255, 255, 255, 0.14);
          transform: scale(1.05);
        }
        .text-emerald { color: #10b981; }
        .text-amber { color: #f59e0b; }
        .text-muted { color: #64748b; }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0.75rem 1rem;
          }
          .level-badge {
            display: none;
          }
          .btn-label-desktop {
            display: none;
          }
          .brand-title {
            font-size: 1rem;
          }
          .brand-sub {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
