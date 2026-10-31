import React from 'react';

export default function CityBackdrop({ ecoHealth = 100, level = 1 }) {
  // ecoHealth 0-100 arasında. Sağlık düştükçe duman artar, yükseldikçe gökyüzü açılır.
  const smogAlpha = Math.max(0, Math.min(0.75, (100 - ecoHealth) / 100 * 0.75));
  const seaGlow = Math.min(1, ecoHealth / 100);

  return (
    <div className="city-backdrop-wrapper" aria-hidden="true">
      <svg
        className="city-svg"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gökyüzü gradyanı */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#081020" />
            <stop offset="50%" stopColor="#0e1f3d" />
            <stop offset="100%" stopColor="#13364b" />
          </linearGradient>

          {/* Toros Dağları gradyanı */}
          <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Akdeniz Denizi gradyanı */}
          <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#083344" />
          </linearGradient>

          {/* Güneş / Temiz Enerji Halesi */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Gökyüzü */}
        <rect width="1200" height="400" fill="url(#skyGrad)" />

        {/* Güneş / Temiz Enerji Parıltısı (Antalya Güneşi) */}
        <circle cx="950" cy="90" r="140" fill="url(#sunGlow)" />
        <circle cx="950" cy="90" r="32" fill="#fbbf24" opacity={0.8 + (seaGlow * 0.2)} />

        {/* Arka Toros Dağları */}
        <polygon
          points="0,280 120,170 280,240 450,150 620,260 800,160 980,250 1120,180 1200,220 1200,400 0,400"
          fill="url(#mountainGrad1)"
          opacity="0.8"
        />

        {/* Ön Dağ Sırası */}
        <polygon
          points="0,310 180,220 340,290 520,210 700,300 890,220 1060,280 1200,240 1200,400 0,400"
          fill="url(#mountainGrad2)"
        />

        {/* Rüzgar Türbinleri (Tepelerde Dönen Pervaneler) */}
        <g transform="translate(180, 220)" className="turbine-group">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3" fill="#e2e8f0" />
          <g className="turbine-blades">
            <line x1="0" y1="0" x2="0" y2="-22" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="0" x2="19" y2="11" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="0" x2="-19" y2="11" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        <g transform="translate(520, 210)" className="turbine-group">
          <line x1="0" y1="0" x2="0" y2="45" stroke="#94a3b8" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3.5" fill="#e2e8f0" />
          <g className="turbine-blades turbine-fast">
            <line x1="0" y1="0" x2="0" y2="-24" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="0" x2="21" y2="12" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="0" x2="-21" y2="12" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        <g transform="translate(890, 220)" className="turbine-group">
          <line x1="0" y1="0" x2="0" y2="38" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#e2e8f0" />
          <g className="turbine-blades">
            <line x1="0" y1="0" x2="0" y2="-20" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="0" x2="17" y2="10" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="0" x2="-17" y2="10" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        {/* Antalya Şehir Silueti & Modern Eko-Binalar */}
        <g fill="#0b1320" opacity="0.95">
          {/* Binalar */}
          <rect x="260" y="270" width="35" height="70" rx="2" />
          <rect x="305" y="250" width="45" height="90" rx="3" />
          {/* Çatı Güneş Panelleri (Mavi pırıltı) */}
          <rect x="308" y="246" width="39" height="4" fill="#06b6d4" opacity="0.8" />
          
          <rect x="360" y="280" width="28" height="60" rx="2" />
          <rect x="640" y="260" width="50" height="80" rx="3" />
          <rect x="644" y="256" width="42" height="4" fill="#06b6d4" opacity="0.8" />

          {/* Tarihi Saat Kulesi / Kaleiçi Temsili */}
          <polygon points="730,290 740,250 750,290" fill="#0b1320" />
          <rect x="735" y="290" width="10" height="50" />

          <rect x="780" y="265" width="40" height="75" rx="3" />
          <rect x="830" y="275" width="32" height="65" rx="2" />
        </g>

        {/* Akdeniz Kıyısı & Deniz Katmanı */}
        <path
          d="M 0,335 Q 300,325 600,335 T 1200,335 L 1200,400 L 0,400 Z"
          fill="url(#seaGrad)"
          opacity={0.7 + (seaGlow * 0.3)}
        />

        {/* Sahil Şeridindeki Turunç / Palmiye Ağaçları */}
        <g fill="#10b981" opacity={0.4 + (ecoHealth / 200)}>
          <circle cx="240" cy="330" r="9" />
          <circle cx="252" cy="328" r="8" />
          <circle cx="410" cy="333" r="10" />
          <circle cx="424" cy="331" r="7" />
          <circle cx="715" cy="332" r="9" />
          <circle cx="875" cy="334" r="11" />
        </g>

        {/* Dinamik Duman / Sis Katmanı (Hata yaptıkça koyulaşır, doğru yaptıkça yok olur) */}
        <rect
          width="1200"
          height="400"
          fill="#334155"
          opacity={smogAlpha}
          style={{ transition: 'opacity 0.6s ease' }}
        />
      </svg>

      <style>{`
        .city-backdrop-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 320px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
        }
        .city-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        @keyframes spinBlades {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .turbine-blades {
          animation: spinBlades 4.5s linear infinite;
          transform-origin: 0 0;
        }
        .turbine-fast {
          animation: spinBlades 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
