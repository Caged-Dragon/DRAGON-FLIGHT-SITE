import { useState, useRef, useEffect } from 'react';
import { Play, Flame, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { DragonSkin, ThemeMode } from '../types/game';
import { SKINS, REALMS } from '../data/gameData';
import { drawDragon } from '../utils/dragonRenderer';
import { soundManager } from '../utils/audio';

interface IntroScreenProps {
  onStartGame: () => void;
  selectedSkin: DragonSkin;
  onSelectSkin: (skin: DragonSkin) => void;
  highScore: number;
  totalScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function IntroScreen({
  onStartGame,
  selectedSkin,
  onSelectSkin,
  highScore,
  totalScore,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
}: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flapTest, setFlapTest] = useState(0);
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let flameVal = 0;

    function render(time: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flameVal = Math.max(0, flameVal - 0.04);
      const hoverY = canvas.height / 2 + Math.sin(time / 280) * 8;
      drawDragon(ctx, canvas.width / 2, hoverY, 0, flameVal, selectedSkin, false, time);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [selectedSkin, flapTest]);

  const handleTestFlap = () => {
    setFlapTest((p) => p + 1);
    soundManager.play('flap');
  };

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden flex flex-col transition-colors duration-300 ${
        isLight ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50 text-slate-900' : 'bg-gradient-to-br from-[#0a0512] via-[#0f0a18] to-[#07060b] text-orange-50'
      }`}
    >
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 w-full flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <span className="font-black tracking-widest text-[10px] sm:text-xs uppercase text-orange-500 block">Arcade</span>
            <span className={`font-black text-base sm:text-lg tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              DRAGON FLIGHT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all ${isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-white/5 border-white/10 text-orange-200 hover:bg-white/10'}`}
          >
            {isLight ? <Moon className="h-4 w-4 text-indigo-600" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all ${isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-white/5 border-white/10 text-orange-200 hover:bg-white/10'}`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-red-500" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        {/* Left - Hero */}
        <div className="flex-1 min-w-0 text-center lg:text-left space-y-3 sm:space-y-4">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[0.95] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            MASTER THE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
              CELESTIAL SKIES
            </span>
          </h1>

          <p className={`text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed ${isLight ? 'text-slate-600' : 'text-orange-100/75'}`}>
            Fly through 5 elemental realms that shift randomly. Survive as long as you can!
          </p>

          <div className={`flex items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-bold ${isLight ? 'text-slate-500' : 'text-orange-300/70'}`}>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-amber-500">{highScore}</span>
              <span>Best</span>
            </div>
            <div className={`w-px h-5 ${isLight ? 'bg-slate-300' : 'bg-white/20'}`} />
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-emerald-500">{totalScore}</span>
              <span>Total</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            <button
              onClick={onStartGame}
              className="group flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 font-black text-base sm:text-lg text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-white" />
              <span>START FLYING</span>
            </button>
          </div>
        </div>

        {/* Right - Dragon Preview */}
        <div className="w-full max-w-sm lg:w-[380px] flex-shrink-0">
          <div className={`border rounded-2xl sm:rounded-3xl p-4 sm:p-5 backdrop-blur-md relative overflow-hidden transition-colors ${
            isLight ? 'bg-white/90 border-slate-200 shadow-2xl' : 'bg-stone-900/70 border-white/15 shadow-2xl'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className={`text-sm sm:text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedSkin.name}</h3>
                <p className={`text-[10px] sm:text-xs font-medium ${isLight ? 'text-orange-600' : 'text-orange-300/80'}`}>{selectedSkin.title}</p>
              </div>
              <button
                onClick={handleTestFlap}
                className="px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-500 text-xs font-bold transition hover:bg-orange-500/30 flex items-center gap-1"
              >
                <Flame className="h-3 w-3" /> Flap
              </button>
            </div>

            <div
              onClick={handleTestFlap}
              className={`w-full aspect-video rounded-xl border flex items-center justify-center cursor-pointer group relative overflow-hidden ${
                isLight ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-b from-black/60 to-black/90 border-white/10'
              }`}
            >
              <canvas ref={canvasRef} width={240} height={140} className="pointer-events-none" />
              <span className="absolute bottom-2 text-[10px] font-semibold text-white/40 group-hover:text-white/70 transition">
                Click to test flap!
              </span>
            </div>

            {/* Skins */}
            <div className="mt-3">
              <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase block mb-2 ${isLight ? 'text-slate-500' : 'text-orange-200/60'}`}>
                Wyvern Skin
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SKINS.map((skin) => {
                  const isUnlocked = skin.unlockedByDefault || totalScore >= skin.requiredScore;
                  const isSelected = selectedSkin.id === skin.id;
                  return (
                    <button
                      key={skin.id}
                      disabled={!isUnlocked}
                      onClick={() => isUnlocked && onSelectSkin(skin)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/15 shadow-md'
                          : isUnlocked
                          ? isLight ? 'border-slate-200 bg-slate-50 hover:bg-slate-100' : 'border-white/10 bg-white/5 hover:bg-white/10'
                          : 'border-white/5 bg-black/40 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-white/20"
                        style={{ backgroundColor: skin.primaryColor }}
                      />
                      <span className={`text-[8px] font-bold truncate w-full text-center ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        {isUnlocked ? skin.name.split(' ')[0] : '🔒'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Realm Preview */}
      <footer className={`relative z-10 flex-shrink-0 px-4 sm:px-6 lg:px-8 py-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto">
          {REALMS.map((realm) => (
            <div
              key={realm.id}
              className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-xs ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-stone-900/60 border-white/10'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: realm.accentColor }} />
              <span className={`font-bold whitespace-nowrap ${isLight ? 'text-slate-800' : 'text-white'}`}>{realm.name}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
