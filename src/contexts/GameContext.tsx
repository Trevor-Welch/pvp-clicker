// src/contexts/GameContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useClicks } from '../hooks/useClicks';
import type { GameState } from '../types/game';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  handleClick: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameState, setGameState] = useState<GameState>({
    roomId: "",
    p1: null,
    p2: null,
    currentPlayer: null,
  });

  const { handleClick } = useClicks(gameState.roomId, gameState.currentPlayer);

  // Passive income tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.p1 && !prev.p2) return prev;

        const updated: GameState = { ...prev };

        if (prev.p1) {
          updated.p1 = {
            ...prev.p1,
            clicks: prev.p1.clicks + prev.p1.passiveIncome,
          };
        }
        if (prev.p2) {
          updated.p2 = {
            ...prev.p2,
            clicks: prev.p2.clicks + prev.p2.passiveIncome,
          };
        }

        return updated;
      });
    }, 1000); // 1 second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const value = {
    gameState,
    setGameState,
    handleClick,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};