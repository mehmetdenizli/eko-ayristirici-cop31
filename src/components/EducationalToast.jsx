import React, { useEffect } from 'react';
import { AlertTriangle, Lightbulb, X, ArrowRight } from 'lucide-react';

export default function EducationalToast({ mistakeData, onClose }) {
  useEffect(() => {
    if (!mistakeData) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [mistakeData, onClose]);

  if (!mistakeData) return null;

  const { item, selectedBinName, correctBinName, isTrap } = mistakeData;

  return (
    <div className="edu-toast-overlay" id="edu-toast-overlay">
      <div className="edu-toast-card glass-panel" id="educational-feedback-card">
        <button className="edu-close-btn" onClick={onClose} aria-label="Kapat">
          <X size={16} />
        </button>

        <div className="edu-toast-header">
          <div className="edu-icon-alert">
            {isTrap ? <AlertTriangle size={20} className="text-amber" /> : <Lightbulb size={20} className="text-cyan" />}
          </div>
          <div>
            <div className="edu-toast-title">
              {isTrap ? '⚠️ TUZAK NESNEYE DİKKAT!' : 'Hatalı Ayrıştırma'}
            </div>
            <div className="edu-toast-subtitle">
              {item.name} ({item.emoji})
            </div>
          </div>
        </div>

        <div className="edu-correction-row">
          <div className="edu-tag tag-wrong">
            Seçilen: <strong>{selectedBinName}</strong> ❌
          </div>
          <ArrowRight size={14} className="text-dim" />
          <div className="edu-tag tag-correct">
            Doğrusu: <strong>{correctBinName}</strong> ✅
          </div>
        </div>

        <div className="edu-fact-box">
          <p className="edu-fact-text">
            {item.trapWarning || item.fact}
          </p>
        </div>

        <div className="edu-toast-footer">
          <span className="penalty-tag">-15 Şehir Sağlığı • Seri Sıfırlandı</span>
          <button className="btn-understand" onClick={onClose}>
            Anladım, Devam Et
          </button>
        </div>
      </div>

      <style>{`
        .edu-toast-overlay {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 440px;
          width: calc(100% - 2rem);
        }
        .edu-toast-card {
          position: relative;
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(245, 158, 11, 0.4);
          box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(245, 158, 11, 0.15);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .edu-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .edu-close-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.15);
        }
        .edu-toast-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .edu-icon-alert {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .edu-toast-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.95rem;
          color: #fbbf24;
        }
        .edu-toast-subtitle {
          font-size: 0.82rem;
          color: var(--text-white);
          font-weight: 600;
        }
        .edu-correction-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .edu-tag {
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 500;
        }
        .tag-wrong {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .tag-correct {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .edu-fact-box {
          background: rgba(0, 0, 0, 0.35);
          border-left: 3px solid #06b6d4;
          padding: 0.65rem 0.85rem;
          border-radius: 4px 8px 8px 4px;
        }
        .edu-fact-text {
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.4;
        }
        .edu-toast-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.25rem;
        }
        .penalty-tag {
          font-size: 0.7rem;
          color: #f87171;
          font-weight: 600;
        }
        .btn-understand {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-understand:hover {
          background: #10b981;
          border-color: #10b981;
        }

        @media (max-width: 768px) {
          .edu-toast-overlay {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}
