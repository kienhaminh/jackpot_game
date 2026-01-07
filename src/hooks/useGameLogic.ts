import { useState, useCallback, useRef } from "react";
import type { Prize, GamePhase } from "../types";
import confetti from "canvas-confetti";

export function useGameLogic() {
  const [rangeMax, setRangeMax] = useState<number>(999);
  const [prizes, setPrizes] = useState<Prize[]>([
    { id: "1", name: "Giải Khuyến Khích", type: "random", isWon: false },
    { id: "2", name: "Giải Ba", type: "random", isWon: false },
    { id: "3", name: "Giải Nhì", type: "random", isWon: false },
    { id: "4", name: "Giải Nhất", type: "random", isWon: false },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [phase, setPhase] = useState<GamePhase>("configuring");
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState<number>(0);

  // 3-digit display state
  const [digits, setDigits] = useState<[number, number, number]>([0, 0, 0]);
  const [stoppedDigits, setStoppedDigits] = useState<
    [boolean, boolean, boolean]
  >([false, false, false]);

  const spinTimeoutRef = useRef<number | null>(null);

  const addPrize = () => {
    setPrizes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", type: "random", isWon: false },
    ]);
  };

  const removePrize = (id: string) => {
    setPrizes((prev) => prev.filter((p) => p.id !== id));
  };

  const importPrizesFromCSV = (csvContent: string) => {
    const lines = csvContent.trim().split("\n");
    const newPrizes: Prize[] = [];

    // Skip header if exists (check if first line looks like header)
    const startIndex = lines[0]?.toLowerCase().includes("name") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV: name,type,number (type and number are optional)
      const parts = line.split(",").map((p) => p.trim());
      const name = parts[0];
      const type = parts[1]?.toLowerCase() === "fixed" ? "fixed" : "random";
      const fixedNumber =
        type === "fixed" && parts[2] ? parseInt(parts[2], 10) : undefined;

      if (name) {
        newPrizes.push({
          id: crypto.randomUUID(),
          name,
          type,
          fixedNumber,
          isWon: false,
        });
      }
    }

    if (newPrizes.length > 0) {
      setPrizes(newPrizes);
    }
  };

  const updatePrize = (id: string, updates: Partial<Prize>) => {
    setPrizes((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (
          updates.fixedNumber !== undefined &&
          updates.fixedNumber > rangeMax
        ) {
          return p;
        }
        return { ...p, ...updates };
      })
    );
  };

  const startGame = useCallback(() => {
    const validPrizes = prizes.filter((p) => p.name.trim() !== "");
    if (validPrizes.length === 0) {
      alert("Vui lòng thêm ít nhất một giải thưởng!");
      return;
    }
    setPrizes((prev) =>
      prev.map((p) => ({ ...p, isWon: false, winningResult: undefined }))
    );
    setCurrentPrizeIndex(0);
    setCurrentResult(null);
    setDigits([0, 0, 0]);
    setStoppedDigits([false, false, false]);
    setPhase("playing");
  }, [prizes]);

  const backToConfig = useCallback(() => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    setPhase("configuring");
    setPrizes((prev) =>
      prev.map((p) => ({ ...p, isWon: false, winningResult: undefined }))
    );
    setCurrentPrizeIndex(0);
    setCurrentResult(null);
    setDigits([0, 0, 0]);
    setStoppedDigits([false, false, false]);
  }, []);

  const resetGame = useCallback(() => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    setPrizes((prev) =>
      prev.map((p) => ({ ...p, isWon: false, winningResult: undefined }))
    );
    setCurrentPrizeIndex(0);
    setCurrentResult(null);
    setDigits([0, 0, 0]);
    setStoppedDigits([false, false, false]);
    setIsSpinning(false);
  }, []);

  // Convert number to 3 digits (padded with zeros)
  const numberToDigits = (num: number): [number, number, number] => {
    const padded = String(num).padStart(3, "0");
    return [
      parseInt(padded[0], 10),
      parseInt(padded[1], 10),
      parseInt(padded[2], 10),
    ];
  };

  const spin = useCallback(() => {
    if (isSpinning) return;
    if (currentPrizeIndex >= prizes.length) return;

    setIsSpinning(true);
    setCurrentResult(null);
    setStoppedDigits([false, false, false]);

    const currentPrize = prizes[currentPrizeIndex];
    let result: number;

    if (currentPrize.type === "fixed" && currentPrize.fixedNumber) {
      result = Math.min(currentPrize.fixedNumber, rangeMax);
    } else {
      const usedNumbers = new Set(
        prizes
          .filter((p) => p.winningResult !== undefined)
          .map((p) => p.winningResult!)
      );
      let newResult: number;
      let attempts = 0;
      do {
        newResult = Math.floor(Math.random() * rangeMax) + 1;
        attempts++;
      } while (usedNumbers.has(newResult) && attempts < 1000);
      result = newResult;
    }

    const finalDigits = numberToDigits(result);

    // Stop digits one by one with delays
    // First digit stops after 2s, second after 3.5s, third after 5s
    const stopTimes = [2000, 3500, 5000];

    stopTimes.forEach((time, index) => {
      spinTimeoutRef.current = window.setTimeout(() => {
        setDigits((prev) => {
          const newDigits = [...prev] as [number, number, number];
          newDigits[index] = finalDigits[index];
          return newDigits;
        });
        setStoppedDigits((prev) => {
          const newStopped = [...prev] as [boolean, boolean, boolean];
          newStopped[index] = true;
          return newStopped;
        });

        // When last digit stops
        if (index === 2) {
          setIsSpinning(false);
          setCurrentResult(result);

          setPrizes((prev) =>
            prev.map((p, idx) =>
              idx === currentPrizeIndex
                ? { ...p, isWon: true, winningResult: result }
                : p
            )
          );

          setCurrentPrizeIndex((prev) => prev + 1);

          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#F59E0B", "#FDE68A", "#FFF"],
          });
        }
      }, time);
    });
  }, [isSpinning, rangeMax, prizes, currentPrizeIndex]);

  const currentPrize = prizes[currentPrizeIndex] || null;
  const isGameComplete = currentPrizeIndex >= prizes.length;

  return {
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
    phase,
    startGame,
    backToConfig,
    resetGame,
    currentPrize,
    currentPrizeIndex,
    isGameComplete,
    digits,
    stoppedDigits,
  };
}
