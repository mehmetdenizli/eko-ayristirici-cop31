import React, { useState } from 'react';
import { BINS } from '../data/wasteItems';
import { CheckCircle2, ArrowDownToLine } from 'lucide-react';

export default function BinsArea({
  activeBins,
  binStats,
  onDropItem,
  currentItem,
}) {
  const [dragOverBin, setDragOverBin] = useState(null);
  const [pulseBinId, setPulseBinId] = useState(null);

  const handleDragOver = (e, binId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverBin !== binId) {
      setDragOverBin(binId);
    }
  };

  const handleDragLeave = () => {
    setDragOverBin(null);
  };

  const handleDrop = (e, binId) => {
    e.preventDefault();
    setDragOverBin(null);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const item = JSON.parse(dataStr);
        triggerBinPulse(binId);
        onDropItem(item, binId);
      }
    } catch (err) {
      console.warn('Drop parse error', err);
    }
  };

  // Doğrudan kutuya tıklama (Dokunmatik ekran veya fareyle tek tıkla gönderme)
  const handleBinClick = (binId) => {
    if (currentItem) {
      triggerBinPulse(binId);
      onDropItem(currentItem, binId);
    }
  };

  const triggerBinPulse = (binId) => {
    setPulseBinId(binId);
    setTimeout(() => setPulseBinId(null), 400);
  };

  return (
    <div className="bins-area-container" id="recycling-bins-area">
      <div className="bins-grid">
        {Object.entries(BINS)
          .filter(([key, bin]) => activeBins.includes(bin.id))
          .map(([key, bin]) => {
            const count = binStats[bin.id] || 0;
            const isHovered = dragOverBin === bin.id;
            const isPulsing = pulseBinId === bin.id;

            return (
              <div
                key={bin.id}
                id={`bin-${bin.id}`}
                className={`bin-card glass-panel ${isHovered ? 'bin-dragover' : ''} ${
                  isPulsing ? 'bin-success-pulse' : ''
                }`}
                style={{
                  '--bin-theme': bin.color,
                  '--bin-glow': bin.bgGlow,
                  '--bin-border': bin.border,
                }}
                onDragOver={(e) => handleDragOver(e, bin.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, bin.id)}
                onClick={() => handleBinClick(bin.id)}
              >
                {/* Üst Atma Kapağı / Sensör */}
                <div className="bin-drop-slot">
                  <div className="slot-indicator">
                    <ArrowDownToLine size={13} className="slot-arrow" />
                    <span>BIRAK</span>
                  </div>
                </div>

                {/* Ana Gövde */}
                <div className="bin-body">
                  <div className="bin-icon-wrapper">
                    <span className="bin-icon">{bin.icon}</span>
                  </div>

                  <div className="bin-title-group">
                    <div className="bin-name">{bin.name}</div>
                    <div className="bin-desc">{bin.description}</div>
                  </div>

                  {/* Kısayol Tuşu & İstatistik Rozeti */}
                  <div className="bin-footer">
                    <div className="bin-hotkey-badge" title={`Klavye tuşu: ${bin.hotkey}`}>
                      {bin.hotkey}
                    </div>
                    <div className="bin-count-badge">
                      <CheckCircle2 size={13} />
                      <span>{count} adet</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <style>{`
        .bins-area-container {
          width: 100%;
          max-width: 1100px;
          margin: 0.5rem auto 1rem;
          padding: 0 1rem;
          position: relative;
          z-index: 5;
        }
        .bins-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }
        .bin-card {
          position: relative;
          background: linear-gradient(180deg, rgba(20, 29, 47, 0.85), rgba(10, 16, 29, 0.95));
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .bin-card:hover {
          transform: translateY(-4px);
          border-color: var(--bin-theme);
          box-shadow: 0 10px 25px -5px var(--bin-glow);
        }
        .bin-card:active {
          transform: translateY(-1px);
        }

        /* Sürükleme Efekti */
        .bin-dragover {
          border-color: var(--bin-theme) !important;
          background: rgba(30, 41, 59, 0.95) !important;
          transform: scale(1.04) translateY(-6px) !important;
          box-shadow: 0 0 30px var(--bin-theme) !important;
        }

        /* Başarılı Atış Dalgası */
        .bin-success-pulse {
          animation: binPulseAnim 0.4s ease-out;
        }
        @keyframes binPulseAnim {
          0% { transform: scale(1); filter: brightness(1.6); }
          50% { transform: scale(1.06); filter: brightness(2); }
          100% { transform: scale(1); filter: brightness(1); }
        }

        /* Üst Kapak Slotu */
        .bin-drop-slot {
          width: 100%;
          height: 24px;
          background: rgba(0, 0, 0, 0.45);
          border-radius: 8px;
          border: 1px dashed var(--bin-theme);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slot-indicator {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--bin-theme);
          letter-spacing: 0.05em;
        }
        .bin-dragover .slot-arrow {
          animation: slotBounce 0.5s infinite alternate;
        }
        @keyframes slotBounce {
          from { transform: translateY(0); }
          to { transform: translateY(3px); }
        }

        /* Ana Gövde */
        .bin-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.45rem;
        }
        .bin-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05);
        }
        .bin-icon {
          font-size: 2rem;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));
        }
        .bin-title-group {
          width: 100%;
        }
        .bin-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--bin-theme);
          letter-spacing: -0.01em;
        }
        .bin-desc {
          font-size: 0.7rem;
          color: var(--text-dim);
          line-height: 1.25;
          margin-top: 0.2rem;
          min-height: 2.2em;
        }

        /* Alt Kısayol & Sayaç */
        .bin-footer {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .bin-hotkey-badge {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.75rem;
          color: var(--text-white);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bin-count-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .bins-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bin-desc {
            display: none;
          }
          .bin-card {
            padding: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}
