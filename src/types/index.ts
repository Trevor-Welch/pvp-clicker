// src/types/game.ts
export interface PlayerState {
  id: "p1" | "p2";
  clicks: number;
  passiveIncome: number;
}

export interface GameState {
  roomId: string;
  p1: PlayerState | null;
  p2: PlayerState | null;
  currentPlayer: "p1" | "p2" | null;
}

// src/types/index.ts
export * from './game';