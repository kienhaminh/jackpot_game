import { motion, AnimatePresence } from "framer-motion";
import type { Prize } from "../types";
import { Trophy, Star, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

interface GameStageProps {
  currentResult: number | null;
  isSpinning: boolean;
  currentPrize: Prize | null;
  isGameComplete: boolean;
  digits: [number, number, number];
  stoppedDigits: [boolean, boolean, boolean];
}

function SlotDigit({
  value,
  isSpinning,
  isStopped,
}: {
  value: number;
  isSpinning: boolean;
  isStopped: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (isSpinning && !isStopped) {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 10));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [isSpinning, isStopped, value]);

  return (
    <div className="relative w-36 h-52 md:w-48 md:h-64 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
      {/* Inner shadow effect */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_4px_15px_rgba(0,0,0,0.25)]" />

      {/* Digit */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue}
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.08 }}
          className="text-8xl md:text-[10rem] font-black text-gray-700 font-mono relative z-10"
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>

      {/* Highlight effect when stopped */}
      {isStopped && !isSpinning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/10 rounded-xl"
        />
      )}
    </div>
  );
}

export function GameStage({
  currentResult,
  isSpinning,
  currentPrize,
  isGameComplete,
  digits,
  stoppedDigits,
}: GameStageProps) {
  return (
    <div className="relative w-full py-8 flex flex-col items-center justify-center">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Current Prize Being Drawn */}
      {currentPrize && !isGameComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
            Đang quay giải
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-primary">
            {currentPrize.name}
          </h2>
        </motion.div>
      )}

      {/* Game Complete Message */}
      {isGameComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <PartyPopper className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-black text-primary">
              Hoàn Thành!
            </h2>
            <PartyPopper className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Tất cả giải thưởng đã được trao
          </p>
        </motion.div>
      )}

      {/* Slot Machine Display */}
      {!isGameComplete && (
        <div className="relative z-10 p-6 md:p-8 bg-slate-900/90 backdrop-blur-md rounded-3xl border-4 border-primary shadow-[0_0_60px_rgba(245,158,11,0.4)]">
          <div className="flex gap-4 md:gap-6">
            <SlotDigit
              value={digits[0]}
              isSpinning={isSpinning}
              isStopped={stoppedDigits[0]}
            />
            <SlotDigit
              value={digits[1]}
              isSpinning={isSpinning}
              isStopped={stoppedDigits[1]}
            />
            <SlotDigit
              value={digits[2]}
              isSpinning={isSpinning}
              isStopped={stoppedDigits[2]}
            />
          </div>
        </div>
      )}

      {/* Status Text */}
      <div className="h-16 mt-6 flex items-center justify-center">
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-light text-primary/80 tracking-[0.2em] uppercase animate-pulse"
            >
              Đang quay...
            </motion.div>
          )}
          {!isSpinning && currentResult !== null && !isGameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-lg font-bold text-primary"
            >
              <Trophy className="w-5 h-5" />
              <span>Số trúng thưởng: {currentResult}</span>
              <div className="flex gap-1">
                <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                <Star className="w-4 h-4 text-yellow-400 animate-pulse delay-75" />
                <Star className="w-4 h-4 text-yellow-400 animate-pulse delay-150" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
