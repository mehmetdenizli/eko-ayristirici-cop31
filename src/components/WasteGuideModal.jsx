import React, { useState } from 'react';
import { X, Search, BookOpen, AlertTriangle } from 'lucide-react';
import { WASTE_ITEMS, BINS } from '../data/wasteItems';

export default function WasteGuideModal({ isOpen, onClose }) {
  const [filterBin, setFilterBin] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = WASTE_ITEMS.filter((item) => {
    const matchesFilter =
      filterBin === 'all'
        ? true
        : filterBin === 'traps'
        ? item.isTrap
        : item.bin === filterBin;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fact.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="modal-backdrop" id="guide-modal-backdrop">
      <div className="guide-modal-card glass-panel" id="guide-modal-card">
        {/* Başlık */}
        <div className="guide-header">
          <div className="guide-title-wrap">
            <BookOpen size={22} className="text-emerald" />
            <div>
              <div className="guide-title">Sıfır Atık Sözlüğü & Rehberi</div>
              <div className="guide-subtitle">
                COP31 Antalya standartlarına göre doğru atık ayrıştırma kuralları
              </div>
            </div>
          </div>
          <button className="edu-close-btn" onClick={onClose} aria-label="Kapat">
            <X size={18} />
          </button>
        </div>

        {/* Arama & Filtre Çubuğu */}
        <div className="guide-controls">
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              id="guide-search-input"
              placeholder="Atık veya malzeme ara (örn: pizza, pil, cam)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            <button
              className={`chip ${filterBin === 'all' ? 'active' : ''}`}
              onClick={() => setFilterBin('all')}
            >
              Tümü ({WASTE_ITEMS.length})
            </button>
            <button
              className={`chip chip-trap ${filterBin === 'traps' ? 'active' : ''}`}
              onClick={() => setFilterBin('traps')}
            >
              <AlertTriangle size={12} /> Tuzak Nesneler
            </button>
            {Object.values(BINS).map((b) => (
              <button
                key={b.id}
                className={`chip ${filterBin === b.id ? 'active' : ''}`}
                style={{ '--chip-color': b.color }}
                onClick={() => setFilterBin(b.id)}
              >
                <span>{b.icon}</span> {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Atık Kartları Listesi */}
        <div className="guide-items-list" id="guide-items-list">
          {filteredItems.map((item) => {
            const binInfo = BINS[item.bin.toUpperCase()] || {
              name: item.bin,
              color: '#10b981',
              icon: '♻️',
            };

            return (
              <div
                key={item.id}
                className={`guide-item-card ${item.isTrap ? 'trap-border' : ''}`}
              >
                <div className="item-card-left">
                  <span className="item-emoji">{item.emoji}</span>
                  <div>
                    <div className="item-title">
                      {item.name}
                      {item.isTrap && (
                        <span className="trap-pill">
                          <AlertTriangle size={11} /> Tuzak
                        </span>
                      )}
                    </div>
                    <div className="item-target-bin" style={{ color: binInfo.color }}>
                      Doğru Hazne: <strong>{binInfo.icon} {binInfo.name}</strong>
                    </div>
                  </div>
                </div>

                <div className="item-fact-bubble">
                  {item.trapWarning || item.fact}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="no-items-msg">
              Aradığınız kritere uygun atık bulunamadı.
            </div>
          )}
        </div>
      </div>

      <style>{`
        .guide-modal-card {
          width: 100%;
          max-width: 780px;
          max-height: 85vh;
          background: rgba(15, 23, 42, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9);
          animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .guide-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
        }
        .guide-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .guide-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          color: #ffffff;
        }
        .guide-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .guide-controls {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 0.55rem 0.85rem;
        }
        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
          font-family: var(--font-body);
        }
        .search-box input::placeholder {
          color: var(--text-dim);
        }
        .filter-chips {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .chip {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--text-muted);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.2s ease;
        }
        .chip:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }
        .chip.active {
          background: var(--chip-color, #10b981);
          color: #ffffff;
          border-color: var(--chip-color, #10b981);
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
        }
        .chip-trap.active {
          background: #f59e0b;
          border-color: #f59e0b;
        }
        .guide-items-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-right: 4px;
        }
        .guide-items-list::-webkit-scrollbar {
          width: 6px;
        }
        .guide-items-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 6px;
        }
        .guide-item-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          transition: background 0.2s ease;
        }
        .guide-item-card:hover {
          background: rgba(30, 41, 59, 0.9);
        }
        .trap-border {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.05);
        }
        .item-card-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .item-emoji {
          font-size: 2rem;
          line-height: 1;
        }
        .item-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .trap-pill {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 6px;
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }
        .item-target-bin {
          font-size: 0.78rem;
          margin-top: 0.15rem;
        }
        .item-fact-bubble {
          flex: 1;
          max-width: 380px;
          font-size: 0.75rem;
          color: #94a3b8;
          background: rgba(0, 0, 0, 0.25);
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          line-height: 1.35;
        }
        .no-items-msg {
          text-align: center;
          color: var(--text-dim);
          padding: 2rem;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .guide-item-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .item-fact-bubble {
            max-width: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
