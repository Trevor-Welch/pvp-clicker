// src/types/game.ts

interface PlayerState {
  id: "p1" | "p2";
  clicks: number;
  passiveIncome: number;
  items: Record<string, number>; // key is item id, value is quantity owned
}

interface GameState {
  roomId: string;
  p1: PlayerState | null;
  p2: PlayerState | null;
  currentPlayer: "p1" | "p2" | null;
}

export type { PlayerState, GameState };