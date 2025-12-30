export type PrizeType = "random" | "fixed";

export interface Prize {
  id: string;
  name: string;
  type: PrizeType;
  fixedNumber?: number;
  isWon: boolean;
  winningResult?: number; // The result that won this prize
}

export type GamePhase = "configuring" | "playing";

export interface GameState {
  rangeMax: number;
  prizes: Prize[];
  isSpinning: boolean;
  currentResult: number | null;
  currentPrizeIndex: number; // Which prize we're currently spinning for (from last to first = small to large)
  phase: GamePhase;
}
