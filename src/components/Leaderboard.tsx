import type { Prize } from "../types";
import { Trophy, Award, Gift, Star, Crown } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardProps {
  prizes: Prize[];
  currentPrizeIndex: number;
}

// Icons for different prize ranks
const prizeIcons = [Gift, Award, Trophy, Crown, Star];

export function Leaderboard({ prizes, currentPrizeIndex }: LeaderboardProps) {
  // Display prizes from largest (bottom of list) to smallest (top)
  // So we reverse for display: biggest prize at top
  const displayPrizes = [...prizes].reverse();
  const totalPrizes = prizes.length;

  return (
    <div className="bg-card/80 backdrop-blur-md w-full p-8 rounded-2xl border border-border shadow-2xl">
      <h2 className="text-2xl font-bold mb-8 text-center text-foreground flex items-center justify-center gap-3">
        <Trophy className="w-8 h-8 text-primary" />
        Bảng Giải Thưởng
      </h2>

      <div className="space-y-3">
        {displayPrizes.map((prize, displayIdx) => {
          const actualIndex = totalPrizes - 1 - displayIdx; // Convert back to original index
          const isCurrentTarget =
            actualIndex === currentPrizeIndex && !prize.isWon;
          const isWon = prize.isWon;
          const Icon = prizeIcons[Math.min(displayIdx, prizeIcons.length - 1)];

          return (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: displayIdx * 0.1 }}
              className={cn(
                "relative p-5 rounded-xl border transition-all duration-300",
                isWon
                  ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : isCurrentTarget
                  ? "bg-primary/10 border-primary/50 animate-pulse"
                  : "bg-background/50 border-border/50"
              )}
            >
              <div className="flex items-center gap-5">
                {/* Rank Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    isWon
                      ? "bg-primary text-black"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Prize Info */}
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-bold text-xl",
                      isWon ? "text-primary" : "text-foreground"
                    )}
                  >
                    {prize.name || "Chưa đặt tên"}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {isWon
                      ? "Đã trao giải"
                      : isCurrentTarget
                      ? "Đang quay..."
                      : "Chờ quay"}
                  </p>
                </div>

                <AnimatePresence>
                  {isWon && prize.winningResult !== undefined && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-primary text-black font-black text-2xl px-5 py-3 rounded-lg shadow-lg"
                    >
                      #{prize.winningResult}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Current Target Indicator */}
              {isCurrentTarget && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-r-full" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
