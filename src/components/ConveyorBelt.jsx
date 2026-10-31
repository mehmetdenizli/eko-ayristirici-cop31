import React, { useState } from 'react';
import { Target, Zap } from 'lucide-react';
import { BINS } from '../data/wasteItems';

export default function ConveyorBelt({
  queue,
  currentItem,
  onSortItem,
  activeBins,
}) {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="conveyor-station-container" id="conveyor-station">
      {/* Üst Bilgi / Tarama Durumu */}
      <div className="station-header">
        <div className="scanner-status">
          <span className="pulse-indicator" />
          <span className="scanner-title">AKILLI OPTİK AYRIŞTIRMA HATTI</span>
        </div>
        <div className="scanner-hint">
          Sürükle & bırak veya aşağıdaki butonları / klavye tuşlarını [1-5] kullan!
        </div>
      </div>

      {/* Konveyör Bandı Sahnesi */}
      <div className="conveyor-platform">
        {/* Hareketli Bant Dokusu */}
        <div className="belt-track">
          <div className="belt-stripes" />
        </div>

        {/* Lazer Tarama Alanı (Ön Odak Noktası) */}
        <div className="scanner-target-zone" id="scanner-target-zone">
          <div className="laser-beam" />
          <div className="laser-corners">
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />
          </div>
          <span className="laser-tag">
            <Target size={12} /> AKTİF ATIK
          </span>
        </div>

        {/* Nesnelerin Akışı (Kuyruktaki Atıklar) */}
        <div className="items-stream">
          {queue.map((item, index) => {
            const isTarget = index === 0;
            return (
              <div
                key={item.instanceId || `${item.id}-${index}`}
                id={isTarget ? 'current-waste-item' : `queued-item-${index}`}
                className={`waste-card ${isTarget ? 'target-card' : 'queued-card'}`}
                style={{
                  transform: `translateX(${index * 130}px) scale(${isTarget ? 1.08 : 0.88})`,
                  opacity: isTarget ? 1 : Math.max(0.3, 1 - index * 0.22),
                  zIndex: 10 - index,
                }}
                draggable={isTarget}
                onDragStart={(e) => isTarget && handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
              >
                <div className="waste-emoji-container">
                  <span className="waste-emoji">{item.emoji}</span>
                  {item.isTrap && isTarget && (
                    <span className="trap-badge" title="Tuzak nesne! Dikkatli düşün!">
                      ⚠️
                    </span>
                  )}
                </div>

                <div className="waste-info">
                  <div className="waste-name">{item.name}</div>
                  <div className="waste-meta">
                    {isTarget ? (
                      <span className="waste-category-tag">{item.category}</span>
                    ) : (
                      <span className="waste-wait-tag">Sırada</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {queue.length === 0 && (
            <div className="empty-conveyor-msg">
              <Zap size={22} className="spin-icon text-cyan" />
              <span>Yeni atıklar banta besleniyor...</span>
            </div>
          )}
        </div>
      </div>

      {/* Hızlı Atış Butonları (Klavye Kısayolları / Tek Dokunuşla Fırlatma) */}
      <div className="quick-action-strip" id="quick-action-buttons">
        <span className="quick-action-label">Hızlı Ayrıştır:</span>
        <div className="action-buttons-group">
          {Object.entries(BINS)
            .filter(([key, bin]) => activeBins.includes(bin.id))
            .map(([key, bin]) => (
              <button
                key={bin.id}
                id={`btn-throw-${bin.id}`}
                className="btn-quick-throw"
                style={{
                  '--bin-color': bin.color,
                  '--bin-glow': bin.bgGlow,
                }}
                onClick={() => currentItem && onSortItem(currentItem, bin.id)}
                disabled={!currentItem}
                title={`${bin.name} haznesine gönder [Kısayol: ${bin.hotkey}]`}
              >
                <span className="throw-hotkey">[{bin.hotkey}]</span>
                <span className="throw-icon">{bin.icon}</span>
                <span className="throw-name">{bin.name}</span>
              </button>
            ))}
        </div>
      </div>

      <style>{`
        .conveyor-station-container {
          width: 100%;
          max-width: 1100px;
          margin: 0.5rem auto;
          padding: 0 1rem;
          position: relative;
          z-index: 5;
        }
        .station-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.5rem 0.5rem;
        }
        .scanner-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pulse-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: blink 1.2s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.85); }
        }
        .scanner-title {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }
        .scanner-hint {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 500;
        }

        /* Platform & Konveyör */
        .conveyor-platform {
          position: relative;
          height: 165px;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(8, 14, 26, 0.98));
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 14px 34px -10px rgba(0, 0, 0, 0.7), inset 0 2px 6px rgba(255, 255, 255, 0.05);
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .belt-track {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          height: 48px;
          background: #0f172a;
          border-top: 2px solid #334155;
          border-bottom: 2px solid #1e293b;
          overflow: hidden;
        }
        .belt-stripes {
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.03) 14px,
            rgba(0, 0, 0, 0.25) 14px,
            rgba(0, 0, 0, 0.25) 28px
          );
          animation: conveyorMove 1.8s linear infinite;
        }

        /* Hedef Lazer Kutusu */
        .scanner-target-zone {
          position: absolute;
          left: 32px;
          top: 15px;
          bottom: 15px;
          width: 180px;
          border: 1px dashed rgba(16, 185, 129, 0.4);
          border-radius: 14px;
          background: rgba(16, 185, 129, 0.05);
          pointer-events: none;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 6px;
        }
        .laser-beam {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          box-shadow: 0 0 12px #10b981;
          animation: laserScan 2s ease-in-out infinite alternate;
        }
        @keyframes laserScan {
          0% { top: 6px; opacity: 0.6; }
          100% { top: 92%; opacity: 0.9; }
        }
        .laser-tag {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 800;
          color: #34d399;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          align-self: flex-start;
          background: rgba(16, 185, 129, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Lazer Köşeleri */
        .laser-corners .corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: #10b981;
          border-style: solid;
        }
        .corner.top-left { top: -2px; left: -2px; border-width: 2px 0 0 2px; }
        .corner.top-right { top: -2px; right: -2px; border-width: 2px 2px 0 0; }
        .corner.bottom-left { bottom: -2px; left: -2px; border-width: 0 0 2px 2px; }
        .corner.bottom-right { bottom: -2px; right: -2px; border-width: 0 2px 2px 0; }

        /* Atık Kartları */
        .items-stream {
          position: absolute;
          left: 45px;
          display: flex;
          align-items: center;
          height: 100%;
          z-index: 5;
        }
        .waste-card {
          position: absolute;
          top: 24px;
          width: 154px;
          height: 116px;
          background: rgba(30, 41, 59, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 0.65rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          backdrop-filter: blur(8px);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.5);
        }
        .target-card {
          cursor: grab;
          border-color: rgba(16, 185, 129, 0.6);
          box-shadow: 0 0 22px rgba(16, 185, 129, 0.3), 0 10px 25px -4px rgba(0, 0, 0, 0.6);
          animation: floatItem 3s ease-in-out infinite;
        }
        .target-card:active {
          cursor: grabbing;
          transform: scale(1.04);
        }
        .waste-emoji-container {
          position: relative;
        }
        .waste-emoji {
          font-size: 2.2rem;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        }
        .trap-badge {
          position: absolute;
          top: -4px;
          right: -12px;
          font-size: 1rem;
          animation: pulse 1s infinite;
        }
        .waste-info {
          width: 100%;
        }
        .waste-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.82rem;
          color: #ffffff;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .waste-meta {
          margin-top: 0.2rem;
        }
        .waste-category-tag {
          font-size: 0.68rem;
          color: #06b6d4;
          font-weight: 600;
          background: rgba(6, 182, 212, 0.12);
          padding: 1px 6px;
          border-radius: 4px;
        }
        .waste-wait-tag {
          font-size: 0.65rem;
          color: var(--text-dim);
        }

        .empty-conveyor-msg {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          margin-left: 2rem;
        }

        /* Hızlı Ayrıştırma Butonları Şeridi */
        .quick-action-strip {
          margin-top: 0.65rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .quick-action-label {
          font-family: var(--font-display);
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 0.05em;
        }
        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          flex: 1;
        }
        .btn-quick-throw {
          flex: 1;
          min-width: 120px;
          padding: 0.55rem 0.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-quick-throw:hover:not(:disabled) {
          border-color: var(--bin-color);
          box-shadow: 0 0 16px var(--bin-glow);
          transform: translateY(-2px);
          background: rgba(30, 41, 59, 0.95);
        }
        .btn-quick-throw:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-quick-throw:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .throw-hotkey {
          font-size: 0.7rem;
          color: var(--bin-color);
          font-weight: 800;
          background: rgba(255, 255, 255, 0.08);
          padding: 1px 5px;
          border-radius: 4px;
        }
        .throw-icon {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .scanner-target-zone {
            width: 140px;
            left: 15px;
          }
          .items-stream {
            left: 20px;
          }
          .waste-card {
            width: 130px;
            height: 105px;
          }
          .quick-action-strip {
            display: none; /* Mobilde sürükleme veya alt kutular tercih edilir */
          }
        }
      `}</style>
    </div>
  );
}
