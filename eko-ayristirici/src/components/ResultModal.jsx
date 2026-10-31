import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Trees, Droplet, CloudOff, RotateCcw, Share2, Check, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function ResultModal({
  isOpen,
  status, // 'win' | 'gameover'
  score,
  levelData,
  totalSorted,
  accuracy,
  co2Saved,
  waterSaved,
  treesSaved,
  onNextLevel,
  onRestart,
  hasNextLevel,
}) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen && status === 'win') {
      sounds.playLevelUp();
      // Konfeti patlaması
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B', '#3B82F6'],
      });
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const handleShare = () => {
    const shareText = `♻️ COP31 Eko-Ayrıştırıcı Oyununda ${score} puan aldım!
🌱 Önlenen CO2: ${co2Saved.toFixed(2)} kg
💧 Kurtarılan Su: ${waterSaved.toFixed(1)} Litre
🌳 Korunan Ağaç: ${treesSaved.toFixed(3)}
Doğayı korumak için sen de ayrıştır! #COP31Antalya #SıfırAtık #GameUp`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isWin = status === 'win';

  return (
    <div className="modal-backdrop" id="result-modal-backdrop">
      <div className="result-modal-card glass-panel" id="result-modal-card">
        {/* Sertifika / Sonuç Başlığı */}
        <div className="result-header">
          <div className="award-badge-wrapper">
            <Award size={36} className={isWin ? 'text-emerald' : 'text-danger'} />
          </div>
          <div className="result-title">
            {isWin ? 'BÖLÜM BAŞARIYLA TAMAMLANDI!' : 'ŞEHİR KİRLİLİK ALARMI VERDİ'}
          </div>
          <div className="result-subtitle">
            {isWin
              ? `Tebrikler! ${levelData.name} sıfır atık hedefine ulaştı.`
              : 'Atıklar doğru ayrıştırılamadığı için şehir eko-dengesi bozuldu.'}
          </div>
        </div>

        {/* Dijital COP31 Sertifika Kartı */}
        <div className="certificate-box">
          <div className="cert-watermark">COP31 ANTALYA</div>
          <div className="cert-header">
            <span className="cert-tag">🌿 RESMİ EKO-KARNE</span>
            <span className="cert-level">{levelData.name}</span>
          </div>

          <div className="cert-main-score">
            <div className="cert-score-num">{score}</div>
            <div className="cert-score-label">TOPLAM EKO-PUAN</div>
          </div>

          {/* Çevresel Tasarruf Verileri Grid */}
          <div className="cert-impact-grid">
            <div className="cert-stat-item">
              <CloudOff size={18} className="text-cyan" />
              <div className="stat-value">{co2Saved.toFixed(2)} kg</div>
              <div className="stat-label">Önlenen $CO_2$</div>
            </div>

            <div className="cert-stat-item">
              <Droplet size={18} className="text-blue" />
              <div className="stat-value">{waterSaved.toFixed(1)} L</div>
              <div className="stat-label">Kurtarılan Su</div>
            </div>

            <div className="cert-stat-item">
              <Trees size={18} className="text-emerald" />
              <div className="stat-value">{treesSaved.toFixed(3)}</div>
              <div className="stat-label">Korunan Ağaç</div>
            </div>

            <div className="cert-stat-item">
              <div className="stat-value text-amber">%{accuracy}</div>
              <div className="stat-label">Doğruluk Oranı</div>
            </div>
          </div>

          <div className="cert-footer-text">
            "Sıfır Atık geleceğe bırakacağımız en büyük mirastır."
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="result-actions">
          <button
            className="btn btn-secondary"
            id="btn-share-result"
            onClick={handleShare}
          >
            {copied ? <Check size={16} className="text-emerald" /> : <Share2 size={16} />}
            <span>{copied ? 'Kopyalandı!' : 'Karneyi Kopyala'}</span>
          </button>

          <button
            className="btn btn-secondary"
            id="btn-retry-level"
            onClick={onRestart}
          >
            <RotateCcw size={16} />
            <span>Tekrar Dene</span>
          </button>

          {isWin && hasNextLevel && (
            <button
              className="btn btn-primary"
              id="btn-next-level"
              onClick={onNextLevel}
            >
              <span>Sonraki Kademe</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 8, 16, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
        }
        .result-modal-card {
          width: 100%;
          max-width: 520px;
          background: rgba(15, 23, 42, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9);
          animation: modalPop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .result-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .award-badge-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .result-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          color: #ffffff;
        }
        .result-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        /* Dijital Sertifika */
        .certificate-box {
          position: relative;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 14px;
          padding: 1.25rem;
          overflow: hidden;
        }
        .cert-watermark {
          position: absolute;
          right: -20px;
          bottom: -15px;
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.02);
          pointer-events: none;
          letter-spacing: 0.1em;
        }
        .cert-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.5rem;
        }
        .cert-tag {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.75rem;
          color: #34d399;
          letter-spacing: 0.05em;
        }
        .cert-level {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 600;
        }
        .cert-main-score {
          text-align: center;
          padding: 0.75rem 0;
        }
        .cert-score-num {
          font-family: var(--font-display);
          font-size: 2.75rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .cert-score-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          margin-top: 0.2rem;
        }

        /* Grid */
        .cert-impact-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .cert-stat-item {
          background: rgba(0, 0, 0, 0.35);
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .stat-value {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.05rem;
          color: #ffffff;
          margin-top: 0.25rem;
        }
        .stat-label {
          font-size: 0.68rem;
          color: var(--text-dim);
          margin-top: 0.1rem;
        }
        .cert-footer-text {
          text-align: center;
          font-size: 0.72rem;
          color: var(--text-dim);
          font-style: italic;
          margin-top: 0.85rem;
        }

        .result-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .result-actions .btn {
          flex: 1;
        }

        .text-emerald { color: #10b981; }
        .text-danger { color: #ef4444; }
        .text-cyan { color: #06b6d4; }
        .text-blue { color: #3b82f6; }
        .text-amber { color: #f59e0b; }
      `}</style>
    </div>
  );
}
