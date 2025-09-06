// src/types/game.ts

export interface Effect {
  id: string;
  type: 'click_multiplier' | 'passive_multiplier' | 'auto_click' | 'other';
  value: number;
  remainingTicks: number;
  name: string;
  duration: number;
  description?: string;
}

export interface PlayerState {
  id: "p1" | "p2";
  clicks: number;
  passiveIncome: number;
  items: Record<string, number>;
  effects: Record<string, Effect>;
}

export interface GameState {
  roomId: string;
  p1: PlayerState | null;
  p2: PlayerState | null;
  currentPlayer: "p1" | "p2" | null;
}

export interface StoreItemData {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'passive' | 'active'; // New field to distinguish item types
  passiveIncomeBonus?: number; // Optional for active items
  effect?: Omit<Effect, 'remainingTicks'>; // Effect template for active items
  targetType: 'self' | 'opponent';
  icon?: string;
}