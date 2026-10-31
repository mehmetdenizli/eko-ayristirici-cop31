import React from 'react';
import { Flame, ShieldAlert, Heart, TrendingUp, Droplet, Trees, CloudOff } from 'lucide-react';

export default function HUD({
  score,
  streak,
  ecoHealth,
  levelData,
  totalCo2Saved,
  totalWaterSaved,
  totalTreesSaved,
}) {
  const targetScore = levelData ? levelData.targetScore : 500;
  const progressPercent = Math.min(100, Math.round((score / targetScore) * 100));

  // Kombo çarpanı hesabı (1x, 2x, 3x, 4x, 5x)
  const multiplier = streak >= 12 ? 5 : streak >= 8 ? 4 : streak >= 5 ? 3 : streak >= 2 ? 2 : 1;

  return (
    <div className="hud-container" id="game-hud">
      {/* Üst Sıra: Skor, Kombo, Çevre Sağlığı */}
      <div className="hud-cards-grid">
        {/* Puan Kartı */}
        <div className="hud-card glass-panel" id="hud-score-card">
          <div className="hud-card-header">
            <span className="hud-label">TOPLAM PUAN</span>
            <TrendingUp size={15} className="text-emerald" />
          </div>
          <div className="hud-score-value">
            {score.toLocaleString('tr-TR')}
            <span className="hud-score-pts">pts</span>
          </div>
          <div className="hud-progress-wrapper">
            <div className="hud-progress-bar">
              <div
                className="hud-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="hud-progress-text">
              Hedef: {targetScore} (%{progressPercent})
            </div>
          </div>
        </div>

        {/* Eko-Seri / Kombo Kartı */}
        <div
          className={`hud-card glass-panel ${multiplier > 1 ? 'combo-active' : ''}`}
          id="hud-combo-card"
        >
          <div className="hud-card-header">
            <span className="hud-label">EKO-SERİ</span>
            <Flame
              size={17}
              className={multiplier > 1 ? 'text-flame flame-pulse' : 'text-muted'}
            />
          </div>
          <div className="hud-combo-body">
            <div className="hud-multiplier-val">
              {multiplier > 1 ? `x${multiplier}` : '1x'}
            </div>
            <div className="hud-streak-count">
              {streak > 0 ? `${streak} ardışık doğru` : 'Seri başlat!'}
            </div>
          </div>
          {multiplier > 1 && (
            <div className="hud-combo-badge">
              {multiplier === 5
                ? '🌟 SIFIR ATIK ŞAMPİYONU'
                : multiplier >= 3
                ? '⚡ TEMİZ ENERJİ AURASI'
                : '🔥 GÜZEL SERİ!'}
            </div>
          )}
        </div>

        {/* Şehir & Çevre Sağlığı Kartı */}
        <div
          className={`hud-card glass-panel ${ecoHealth <= 25 ? 'health-critical' : ''}`}
          id="hud-health-card"
        >
          <div className="hud-card-header">
            <span className="hud-label">ŞEHİR EKO-DENGE</span>
            {ecoHealth <= 25 ? (
              <ShieldAlert size={16} className="text-danger pulse-warning" />
            ) : (
              <Heart size={16} className="text-emerald" />
            )}
          </div>
          <div className="hud-health-value">
            %{Math.round(ecoHealth)}
          </div>
          <div className="hud-health-bar-wrapper">
            <div
              className={`hud-health-fill ${
                ecoHealth > 60 ? 'bg-health-good' : ecoHealth > 30 ? 'bg-health-warn' : 'bg-health-bad'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, ecoHealth))}%` }}
            />
          </div>
          <div className="hud-health-sub">
            {ecoHealth <= 25
              ? '⚠️ Kirlilik Eşiği Tehlikede!'
              : ecoHealth >= 80
              ? '🌿 Tertemiz Antalya Havası'
              : 'Dengeyi Koru'}
          </div>
        </div>
      </div>

      {/* Alt Şerit: Anlık Ölçülen COP31 İklim Etkisi */}
      <div className="impact-strip glass-panel" id="hud-impact-strip">
        <div className="impact-item">
          <CloudOff size={15} className="text-cyan" />
          <span className="impact-text">
            Önlenen $CO_2$: <strong>{totalCo2Saved.toFixed(2)} kg</strong>
          </span>
        </div>
        <div className="impact-divider" />
        <div className="impact-item">
          <Droplet size={15} className="text-blue" />
          <span className="impact-text">
            Tasarruf Su: <strong>{totalWaterSaved.toFixed(1)} L</strong>
          </span>
        </div>
        <div className="impact-divider" />
        <div className="impact-item">
          <Trees size={15} className="text-emerald" />
          <span className="impact-text">
            Korunan Ağaç: <strong>{(totalTreesSaved).toFixed(3)}</strong>
          </span>
        </div>
      </div>

      <style>{`
        .hud-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          position: relative;
          z-index: 5;
        }
        .hud-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .hud-card {
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 14px;
          min-height: 110px;
          transition: all 0.25s ease;
        }
        .hud-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hud-label {
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .hud-score-value {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          display: flex;
          align-items: baseline;
          gap: 0.3rem;
        }
        .hud-score-pts {
          font-size: 0.85rem;
          color: var(--eco-emerald);
          font-weight: 600;
        }
        .hud-progress-wrapper {
          margin-top: 0.4rem;
        }
        .hud-progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .hud-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #06b6d4);
          border-radius: 999px;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hud-progress-text {
          font-size: 0.7rem;
          color: var(--text-dim);
          margin-top: 0.25rem;
          font-weight: 500;
        }

        /* Kombo Kartı */
        .hud-multiplier-val {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 900;
          color: #f59e0b;
          line-height: 1.1;
        }
        .hud-streak-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .combo-active {
          border-color: rgba(245, 158, 11, 0.5);
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
        }
        .hud-combo-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.15);
          padding: 2px 6px;
          border-radius: 6px;
          margin-top: 0.25rem;
          width: fit-content;
        }

        /* Çevre Sağlığı Kartı */
        .hud-health-value {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 800;
          line-height: 1.1;
          color: #ffffff;
        }
        .hud-health-bar-wrapper {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
          margin: 0.35rem 0;
        }
        .hud-health-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.35s ease, background-color 0.35s ease;
        }
        .bg-health-good {
          background: linear-gradient(90deg, #10b981, #34d399);
        }
        .bg-health-warn {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }
        .bg-health-bad {
          background: linear-gradient(90deg, #ef4444, #f87171);
        }
        .hud-health-sub {
          font-size: 0.7rem;
          color: var(--text-dim);
          font-weight: 500;
        }
        .health-critical {
          border-color: rgba(239, 68, 68, 0.6);
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.35);
        }
        .pulse-warning {
          animation: pulse 1s infinite;
        }

        /* Alt Şerit */
        .impact-strip {
          padding: 0.6rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.65);
        }
        .impact-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .impact-text {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .impact-text strong {
          color: var(--text-white);
        }
        .impact-divider {
          width: 1px;
          height: 16px;
          background: var(--border-subtle);
        }

        .text-emerald { color: #10b981; }
        .text-flame { color: #f59e0b; }
        .text-cyan { color: #06b6d4; }
        .text-blue { color: #3b82f6; }
        .text-danger { color: #ef4444; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }

        @media (max-width: 768px) {
          .hud-cards-grid {
            grid-template-columns: 1fr 1fr;
          }
          #hud-health-card {
            grid-column: span 2;
          }
          .impact-strip {
            flex-direction: column;
            gap: 0.4rem;
            align-items: flex-start;
          }
          .impact-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
