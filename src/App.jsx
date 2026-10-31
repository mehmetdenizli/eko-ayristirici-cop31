import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import CityBackdrop from './components/CityBackdrop';
import HUD from './components/HUD';
import ConveyorBelt from './components/ConveyorBelt';
import BinsArea from './components/BinsArea';
import EducationalToast from './components/EducationalToast';
import ResultModal from './components/ResultModal';
import WasteGuideModal from './components/WasteGuideModal';
import { WASTE_ITEMS, GAME_LEVELS, BINS } from './data/wasteItems';
import { sounds } from './utils/audio';
import { Play, Sparkles, ShieldCheck, Flame, BookOpen } from 'lucide-react';

export default function App() {
  // Oyun Genel Durumları
  const [gameState, setGameState] = useState('welcome'); // 'welcome' | 'playing' | 'ended'
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ecoHealth, setEcoHealth] = useState(100);
  const [totalSorted, setTotalSorted] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalCo2Saved, setTotalCo2Saved] = useState(0);
  const [totalWaterSaved, setTotalWaterSaved] = useState(0);
  const [totalTreesSaved, setTotalTreesSaved] = useState(0);
  const [binStats, setBinStats] = useState({});
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Efekt & Modal Durumları
  const [shakeScreen, setShakeScreen] = useState(false);
  const [mistakeData, setMistakeData] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState('win'); // 'win' | 'gameover'
  const [guideOpen, setGuideOpen] = useState(false);

  // Konveyör Kuyruğu
  const [queue, setQueue] = useState([]);
  const instanceCounter = useRef(0);

  const levelData = GAME_LEVELS[currentLevelIdx] || GAME_LEVELS[0];

  // Yüksek skoru localStorage'dan çekme
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('ecosort_high_score');
      if (savedScore) setHighScore(parseInt(savedScore, 10));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Rastgele atık üretici
  const generateRandomItem = useCallback(() => {
    instanceCounter.current += 1;
    // Mevcut kademeye uygun nesneleri filtrele
    const eligible = WASTE_ITEMS.filter(
      (item) =>
        levelData.activeBins.includes(item.bin) &&
        item.minLevel <= levelData.level
    );
    const pool = eligible.length > 0 ? eligible : WASTE_ITEMS;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    return {
      ...selected,
      instanceId: `${selected.id}-${instanceCounter.current}-${Date.now()}`,
    };
  }, [levelData]);

  // Kuyruğu doldurma
  const replenishQueue = useCallback((currentQueue) => {
    const needed = 5 - currentQueue.length;
    if (needed <= 0) return currentQueue;
    const newItems = [];
    for (let i = 0; i < needed; i++) {
      newItems.push(generateRandomItem());
    }
    return [...currentQueue, ...newItems];
  }, [generateRandomItem]);

  // Oyunu Başlat / Kademe Sıfırla
  const startGame = (levelIdx = 0) => {
    sounds.init();
    sounds.playClick();
    setCurrentLevelIdx(levelIdx);
    setScore(0);
    setStreak(0);
    setEcoHealth(100);
    setTotalSorted(0);
    setTotalCorrect(0);
    setTotalCo2Saved(0);
    setTotalWaterSaved(0);
    setTotalTreesSaved(0);
    setBinStats({});
    setMistakeData(null);
    setResultModalOpen(false);

    // İlk 5 atığı kuyruğa al
    const initialItems = [];
    for (let i = 0; i < 5; i++) {
      instanceCounter.current += 1;
      const eligible = WASTE_ITEMS.filter(
        (it) =>
          GAME_LEVELS[levelIdx].activeBins.includes(it.bin) &&
          it.minLevel <= GAME_LEVELS[levelIdx].level
      );
      const sel = eligible[Math.floor(Math.random() * eligible.length)];
      initialItems.push({
        ...sel,
        instanceId: `${sel.id}-${instanceCounter.current}-${Date.now() + i}`,
      });
    }

    setQueue(initialItems);
    setGameState('playing');
  };

  // Sonraki Kademeye Geçiş
  const handleNextLevel = () => {
    if (currentLevelIdx + 1 < GAME_LEVELS.length) {
      startGame(currentLevelIdx + 1);
    } else {
      startGame(0);
    }
  };

  // Atığı Hazneye Ayırma Mantığı (Core Mechanic)
  const handleSortItem = (item, selectedBinId) => {
    if (gameState !== 'playing' || !item) return;

    const isCorrect = item.bin === selectedBinId;
    setTotalSorted((prev) => prev + 1);

    // Kuyruktan çıkar ve yeni atık besle
    setQueue((prevQueue) => {
      const remaining = prevQueue.slice(1);
      return replenishQueue(remaining);
    });

    if (isCorrect) {
      // Başarılı ayrıştırma
      const newStreak = streak + 1;
      setStreak(newStreak);
      setTotalCorrect((prev) => prev + 1);

      // Çarpan hesabı
      const mult = newStreak >= 12 ? 5 : newStreak >= 8 ? 4 : newStreak >= 5 ? 3 : newStreak >= 2 ? 2 : 1;
      const basePoints = item.isTrap ? 100 : 50;
      const earnedPoints = basePoints * mult;

      const nextScore = score + earnedPoints;
      setScore(nextScore);

      // Yüksek skor güncelle
      if (nextScore > highScore) {
        setHighScore(nextScore);
        try {
          localStorage.setItem('ecosort_high_score', nextScore.toString());
        } catch (e) {
          console.warn(e);
        }
      }

      // Çevre sağlığı iyileştirme
      setEcoHealth((prev) => Math.min(100, prev + 4));

      // COP31 İklim Etkisi Kaydı
      setTotalCo2Saved((prev) => prev + (item.co2Saved || 0.1));
      setTotalWaterSaved((prev) => prev + (item.waterSaved || 1));
      setTotalTreesSaved((prev) => prev + (item.treeSaved || 0.002));

      // Hazne istatistiği
      setBinStats((prev) => ({
        ...prev,
        [selectedBinId]: (prev[selectedBinId] || 0) + 1,
      }));

      sounds.playSuccess(mult);

      // Hedefe ulaşıldı mı? (Kademe Zaferi)
      if (nextScore >= levelData.targetScore) {
        setResultStatus('win');
        setResultModalOpen(true);
        setGameState('ended');
      }
    } else {
      // Hatalı ayrıştırma
      setStreak(0);
      sounds.playError();

      // Ekran titremesi
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 400);

      // Çevre sağlığı düşüşü
      const nextHealth = Math.max(0, ecoHealth - 15);
      setEcoHealth(nextHealth);

      // Eğitici Hata Kartını Aç
      const selectedBin = Object.values(BINS).find((b) => b.id === selectedBinId);
      const correctBin = Object.values(BINS).find((b) => b.id === item.bin);

      setMistakeData({
        item,
        selectedBinName: selectedBin ? selectedBin.name : selectedBinId,
        correctBinName: correctBin ? correctBin.name : item.bin,
        isTrap: !!item.isTrap,
      });

      // Şehir kirlilik felaketi (Game Over)
      if (nextHealth <= 0) {
        setResultStatus('gameover');
        setResultModalOpen(true);
        setGameState('ended');
      }
    }
  };

  // Klavye kısayolları dinleyicisi [1, 2, 3, 4, 5]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || queue.length === 0) return;

      const current = queue[0];
      const key = e.key;

      const matchedBin = Object.values(BINS).find(
        (b) => b.hotkey === key && levelData.activeBins.includes(b.id)
      );

      if (matchedBin) {
        e.preventDefault();
        handleSortItem(current, matchedBin.id);
      } else if (key === 'Escape') {
        setMistakeData(null);
        setGuideOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, queue, levelData, handleSortItem]);

  const accuracy = totalSorted > 0 ? Math.round((totalCorrect / totalSorted) * 100) : 100;

  return (
    <div className={`app-container ${shakeScreen ? 'shake-active' : ''}`} id="app-root">
      {/* Şehir Arka Planı (Antalya Silueti & Değişen Duman/Güneş) */}
      <CityBackdrop ecoHealth={ecoHealth} level={levelData.level} />

      {/* Üst Navigasyon */}
      <Navbar
        levelData={levelData}
        highScore={highScore}
        onOpenGuide={() => setGuideOpen(true)}
        onRestart={() => startGame(currentLevelIdx)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Giriş Ekranı (Welcome Screen) */}
      {gameState === 'welcome' && (
        <main className="welcome-screen-container" id="welcome-screen">
          <div className="welcome-card glass-panel">
            <div className="welcome-badge">
              <Sparkles size={16} className="text-emerald" />
              <span>COP31 TÜRKİYE • ANTALYA HACKATHON</span>
            </div>

            <h1 className="welcome-title">
              Eko-Ayrıştırıcı <span className="gradient-text">Sıfır Atık</span> Laboratuvarı
            </h1>

            <p className="welcome-desc">
              Antalya'nın akıllı döngüsel geri dönüşüm merkezine hoş geldin!
              Banttan akan atıkları doğru haznelerle eşleştir, tuzak malzemelere kanma,
              şehri hava ve çevre kirliliğinden kurtararak 2050 COP31 hedefine ulaştır.
            </p>

            <div className="features-preview-grid">
              <div className="feature-box">
                <div className="feature-icon">🧴</div>
                <div className="feature-title">5 Akıllı Hazne</div>
                <div className="feature-sub">Plastik, Kağıt, Cam, Kompost, E-Atık</div>
              </div>

              <div className="feature-box">
                <div className="feature-icon">⚠️</div>
                <div className="feature-title">Eğitici Tuzak Nesneler</div>
                <div className="feature-sub">Yağlı pizza kutuları ve termal fişler!</div>
              </div>

              <div className="feature-box">
                <div className="feature-icon">⚡</div>
                <div className="feature-title">Hızlı Kısayollar</div>
                <div className="feature-sub">[1-5] klavye tuşları veya sürükle-bırak</div>
              </div>
            </div>

            {/* Kademe Seçimi */}
            <div className="level-select-row">
              <span className="select-label">Başlangıç Kademesi:</span>
              <div className="level-buttons">
                {GAME_LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl.level}
                    className={`btn-level-select ${currentLevelIdx === idx ? 'active' : ''}`}
                    onClick={() => setCurrentLevelIdx(idx)}
                  >
                    <span>Kademe {lvl.level}</span>
                    <small>{lvl.name}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="welcome-actions">
              <button
                className="btn btn-primary btn-large"
                id="btn-start-game"
                onClick={() => startGame(currentLevelIdx)}
              >
                <Play size={20} />
                <span>Göreve Başla (Oyunu Oyna)</span>
              </button>

              <button
                className="btn btn-secondary"
                id="btn-open-guide-welcome"
                onClick={() => setGuideOpen(true)}
              >
                <BookOpen size={18} />
                <span>Atık Sözlüğünü İncele</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Aktif Oyun Alanı */}
      {gameState !== 'welcome' && (
        <main className="gameplay-wrapper" id="gameplay-wrapper">
          {/* HUD (Skor, Kombo, Çevre Denge Barı, COP31 Metrikleri) */}
          <HUD
            score={score}
            streak={streak}
            ecoHealth={ecoHealth}
            levelData={levelData}
            totalCo2Saved={totalCo2Saved}
            totalWaterSaved={totalWaterSaved}
            totalTreesSaved={totalTreesSaved}
          />

          {/* Konveyör Bandı & Aktif Atık */}
          <ConveyorBelt
            queue={queue}
            currentItem={queue[0] || null}
            onSortItem={handleSortItem}
            activeBins={levelData.activeBins}
          />

          {/* Geri Dönüşüm Hazneleri */}
          <BinsArea
            activeBins={levelData.activeBins}
            binStats={binStats}
            onDropItem={handleSortItem}
            currentItem={queue[0] || null}
          />
        </main>
      )}

      {/* Hata ve Eğitici Bilgi Pop-up'ı */}
      <EducationalToast
        mistakeData={mistakeData}
        onClose={() => setMistakeData(null)}
      />

      {/* Bölüm Sonu / Sertifika Modalı */}
      <ResultModal
        isOpen={resultModalOpen}
        status={resultStatus}
        score={score}
        levelData={levelData}
        totalSorted={totalSorted}
        accuracy={accuracy}
        co2Saved={totalCo2Saved}
        waterSaved={totalWaterSaved}
        treesSaved={totalTreesSaved}
        onNextLevel={handleNextLevel}
        onRestart={() => startGame(currentLevelIdx)}
        hasNextLevel={currentLevelIdx + 1 < GAME_LEVELS.length}
      />

      {/* Atık Rehberi & Ansiklopedi Modalı */}
      <WasteGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

      <style>{`
        .welcome-screen-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          z-index: 5;
        }
        .welcome-card {
          width: 100%;
          max-width: 680px;
          padding: 2.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.8);
          animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(16, 185, 129, 0.14);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 4px 12px;
          border-radius: 999px;
        }
        .welcome-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }
        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .welcome-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 540px;
        }
        .features-preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
          width: 100%;
          margin-top: 0.5rem;
        }
        .feature-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 0.85rem 0.65rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        .feature-icon {
          font-size: 1.6rem;
        }
        .feature-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          color: #ffffff;
        }
        .feature-sub {
          font-size: 0.68rem;
          color: var(--text-dim);
          line-height: 1.25;
        }

        .level-select-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }
        .select-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .level-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-level-select {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: var(--text-white);
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .btn-level-select small {
          font-size: 0.68rem;
          font-weight: 500;
          color: var(--text-dim);
        }
        .btn-level-select:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
        }
        .btn-level-select.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: #10b981;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.3);
        }
        .btn-level-select.active small {
          color: #34d399;
        }

        .welcome-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          margin-top: 0.5rem;
        }
        .welcome-actions .btn {
          flex: 1;
        }
        .btn-large {
          padding: 0.85rem 1.5rem;
          font-size: 1.05rem;
        }

        .gameplay-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .welcome-title {
            font-size: 1.85rem;
          }
          .features-preview-grid {
            grid-template-columns: 1fr;
          }
          .welcome-actions {
            flex-direction: column;
          }
          .level-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
