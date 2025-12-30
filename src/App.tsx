import { GameStage } from "./components/GameStage";
import { ConfigPanel } from "./components/ConfigPanel";
import { Leaderboard } from "./components/Leaderboard";
import { useGameLogic } from "./hooks/useGameLogic";
import { Play, ArrowLeft, Rocket } from "lucide-react";

function App() {
  const {
    rangeMax,
    setRangeMax,
    prizes,
    addPrize,
    removePrize,
    updatePrize,
    isSpinning,
    currentResult,
    spin,
    phase,
    startGame,
    backToConfig,
    currentPrize,
    currentPrizeIndex,
    isGameComplete,
    digits,
    stoppedDigits,
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center selection:bg-primary/30">
      {/* Configuration Phase */}
      {phase === "configuring" && (
        <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-400 to-primary mb-4">
              🎰 Jackpot Game
            </h1>
            <p className="text-muted-foreground text-lg">
              Cấu hình giải thưởng trước khi bắt đầu
            </p>
          </div>

          <ConfigPanel
            rangeMax={rangeMax}
            setRangeMax={setRangeMax}
            prizes={prizes}
            addPrize={addPrize}
            removePrize={removePrize}
            updatePrize={updatePrize}
            isSpinning={isSpinning}
          />

          {/* Start Game Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={startGame}
              className="group relative px-10 py-4 bg-primary text-black font-black text-xl uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all overflow-hidden flex items-center gap-3"
            >
              <Rocket className="w-6 h-6" />
              Bắt Đầu Chơi
              <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
            </button>
          </div>
        </main>
      )}

      {/* Playing Phase */}
      {phase === "playing" && (
        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
          {/* Left Side - Game Stage */}
          <div className="flex-1 flex flex-col items-center">
            {/* Back Button */}
            <div className="w-full mb-4">
              <button
                onClick={backToConfig}
                disabled={isSpinning}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại cấu hình
              </button>
            </div>

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
              <div className="flex justify-center mt-4">
                <button
                  onClick={spin}
                  disabled={isSpinning}
                  className="group relative px-12 py-4 bg-primary text-black font-black text-2xl uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isSpinning ? "Đang quay..." : "Quay Số"}
                    {!isSpinning && <Play className="w-6 h-6 fill-black" />}
                  </span>
                  <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                </button>
              </div>
            )}

            {/* Play Again Button */}
            {isGameComplete && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={backToConfig}
                  className="px-8 py-3 bg-muted text-foreground font-bold rounded-full hover:bg-muted/80 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Chơi lại
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Leaderboard */}
          <div className="lg:w-96">
            <Leaderboard
              prizes={prizes}
              currentPrizeIndex={currentPrizeIndex}
            />
          </div>
        </main>
      )}

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-[#020617]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </div>
  );
}

export default App;
