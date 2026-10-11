import { useState, useEffect } from 'react';
import { DragonSkin, PageState, ThemeMode } from './types/game';
import { SKINS } from './data/gameData';
import { IntroScreen } from './components/IntroScreen';
import { GameCanvas } from './components/GameCanvas';
import { soundManager } from './utils/audio';

const STORAGE_KEY_SCORES = 'dragon_flight_scores';
const STORAGE_KEY_SKIN = 'dragon_flight_skin';
const STORAGE_KEY_SOUND = 'dragon_flight_sound';
const STORAGE_KEY_THEME = 'dragon_flight_theme';

export default function App() {
  const [page, setPage] = useState<PageState>('intro');
  const [currentSkin, setCurrentSkin] = useState<DragonSkin>(SKINS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [highScore, setHighScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    try {
      const storedScores = localStorage.getItem(STORAGE_KEY_SCORES);
      if (storedScores) {
        const scores = JSON.parse(storedScores) as { high: number; total: number };
        setHighScore(scores.high || 0);
        setTotalScore(scores.total || 0);
      }
      const storedSkinId = localStorage.getItem(STORAGE_KEY_SKIN);
      if (storedSkinId) {
        const found = SKINS.find((s) => s.id === storedSkinId);
        if (found) setCurrentSkin(found);
      }
      const storedSound = localStorage.getItem(STORAGE_KEY_SOUND);
      if (storedSound !== null) {
        const enabled = storedSound === 'true';
        setSoundEnabled(enabled);
        soundManager.enabled = enabled;
      }
      const storedTheme = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    document.body.style.background = theme === 'dark' ? '#07060b' : '#f8fafc';
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem(STORAGE_KEY_THEME, next); } catch { /* ignore */ }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    try { localStorage.setItem(STORAGE_KEY_SOUND, String(next)); } catch { /* ignore */ }
  };

  const selectSkin = (skin: DragonSkin) => {
    setCurrentSkin(skin);
    try { localStorage.setItem(STORAGE_KEY_SKIN, skin.id); } catch { /* ignore */ }
  };

  const updateHighScore = (score: number) => {
    setHighScore((prev) => {
      const next = Math.max(prev, score);
      setTotalScore((prevTotal) => {
        const newTotal = Math.max(prevTotal, score);
        try {
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify({ high: next, total: newTotal }));
        } catch { /* ignore */ }
        return newTotal;
      });
      return next;
    });
  };

  return (
    <div className="w-full h-full">
      {page === 'intro' && (
        <IntroScreen
          onStartGame={() => setPage('game')}
          selectedSkin={currentSkin}
          onSelectSkin={selectSkin}
          highScore={highScore}
          totalScore={totalScore}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {page === 'game' && (
        <GameCanvas
          skin={currentSkin}
          onBackToIntro={() => setPage('intro')}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          theme={theme}
          onToggleTheme={toggleTheme}
          highScore={highScore}
          onUpdateHighScore={updateHighScore}
        />
      )}
    </div>
  );
}
