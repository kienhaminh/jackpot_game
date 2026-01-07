import { GameStage } from "./components/GameStage";
import { Leaderboard } from "./components/Leaderboard";
import { SettingsModal } from "./components/SettingsModal";
import { useGameLogic } from "./hooks/useGameLogic";
import { useBranding } from "./hooks/useBranding";
import { Play, Settings, Maximize2, Minimize2 } from "lucide-react";
import { useState, useCallback } from "react";

function App() {
  const {
    rangeMax,
    setRangeMax,
    prizes,
    addPrize,
    removePrize,
    updatePrize,
    importPrizesFromCSV,
    isSpinning,
    currentResult,
    spin,
    resetGame,
    currentPrize,
    currentPrizeIndex,
    isGameComplete,
    digits,
    stoppedDigits,
  } = useGameLogic();

  const {
    logoUrl,
    primaryColor,
    showLogoBorder,
    uploadLogo,
    removeLogo,
    setThemeColor,
    toggleLogoBorder,
  } = useBranding();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="min-h-screen h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 overflow-hidden">
      {/* Top Left Button Group */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-card/80 backdrop-blur-md hover:bg-card border border-border rounded-xl shadow-lg transition-all hover:scale-105"
          title="Cài đặt"
        >
          <Settings className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-card/80 backdrop-blur-md hover:bg-card border border-border rounded-xl shadow-lg transition-all hover:scale-105"
          title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-6 h-6 text-foreground" />
          ) : (
            <Maximize2 className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8">
        {/* Center - Game Stage */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl">
          {/* Logo Display - Bigger and with soft border */}
          {logoUrl && (
            <div className="mb-8 flex justify-center">
              <div
                className={`overflow-hidden rounded-2xl transition-all ${
                  showLogoBorder
                    ? "bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    : ""
                }`}
              >
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-28 md:h-36 lg:h-44 max-w-[400px] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          )}

          <GameStage
            currentResult={currentResult}
            isSpinning={isSpinning}
            currentPrize={currentPrize}
            isGameComplete={isGameComplete}
            digits={digits}
            stoppedDigits={stoppedDigits}
          />

          {/* Spin Button */}
          {!isGameComplete && (
            <div className="flex justify-center mt-8">
              <button
                onClick={spin}
                disabled={isSpinning}
                className="group relative px-16 py-5 text-black font-black text-3xl uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 40px ${primaryColor}80`,
                }}
              >
                <span className="relative z-10 flex items-center gap-4">
                  {isSpinning ? "Đang quay..." : "Quay Số"}
                  {!isSpinning && <Play className="w-8 h-8 fill-black" />}
                </span>
                <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
              </button>
            </div>
          )}

          {/* Play Again Button */}
          {isGameComplete && (
            <div className="flex justify-center mt-8">
              <button
                onClick={resetGame}
                className="px-10 py-4 bg-primary text-black font-bold text-xl rounded-full hover:scale-105 transition-all flex items-center gap-3"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 30px ${primaryColor}80`,
                }}
              >
                Chơi lại
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Leaderboard */}
        <div className="lg:w-[450px] w-full max-w-[450px]">
          <Leaderboard prizes={prizes} currentPrizeIndex={currentPrizeIndex} />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        rangeMax={rangeMax}
        setRangeMax={setRangeMax}
        prizes={prizes}
        addPrize={addPrize}
        removePrize={removePrize}
        updatePrize={updatePrize}
        onImportCSV={importPrizesFromCSV}
        isSpinning={isSpinning}
        logoUrl={logoUrl}
        primaryColor={primaryColor}
        showLogoBorder={showLogoBorder}
        onUploadLogo={uploadLogo}
        onRemoveLogo={removeLogo}
        onSetThemeColor={setThemeColor}
        onToggleLogoBorder={toggleLogoBorder}
        onResetGame={resetGame}
      />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-[#020617]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </div>
  );
}

export default App;
