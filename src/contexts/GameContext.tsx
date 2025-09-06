// src/contexts/GameContext.tsx
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { ref, runTransaction, onValue } from 'firebase/database';
import type { ReactNode } from 'react';
import type { GameState, Effect } from '../types/game';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  pendingClicks: number;
  setPendingClicks: React.Dispatch<React.SetStateAction<number>>;
  heartbeat: number;
  calculatedTotalClicks: (player: "p1" | "p2") => number;
  addEffect: (effectData: Omit<Effect, 'remainingTicks' >, durationTicks: number) => void;
  addOpponentEffect: (effectData: Omit<Effect, 'remainingTicks'>, durationTicks: number) => void;
  getActiveEffects: (type?: Effect['type']) => Effect[];
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
  
  // Track pending clicks since last sync
  const [pendingClicks, setPendingClicks] = useState(0);
  const lastSyncRef = useRef<number>(Date.now());
  const [heartbeat, setHeartbeat] = useState(0);
  const [isProcessingEffects, setIsProcessingEffects] = useState(false);

  // Add this function to your GameProvider
const addOpponentEffect = (effectData: Omit<Effect, 'remainingTicks'>, durationTicks: number) => {
  if (!gameState.currentPlayer) return;
  
  // Get opponent player
  const opponent = gameState.currentPlayer === 'p1' ? 'p2' : 'p1';
  
  setGameState(prev => {
    const opponentData = prev[opponent];
    if (!opponentData) return prev; // Can't curse if opponent doesn't exist
    
    const effect: Effect = {
      ...effectData,
      remainingTicks: durationTicks,
    };
    
    return {
      ...prev,
      [opponent]: {
        ...opponentData,
        effects: {
          ...opponentData.effects,
          [effect.id]: effect
        }
      }
    };
  });
};


  // Process effects each tick
  const processEffects = () => {
    if (!gameState.currentPlayer || !gameState[gameState.currentPlayer] || isProcessingEffects) return;

    setIsProcessingEffects(true);

    setGameState(prev => {
      const currentPlayer = prev.currentPlayer!;
      const playerData = prev[currentPlayer]!;
      
      console.log("Effects before processing:", playerData.effects);

      const clickMultipliers = Object.values(playerData.effects || {})
      .filter(effect => effect.type === 'click_multiplier')
      .reduce((total, effect) => total * effect.value, 1);

      // Process each effect
      const updatedEffects: Record<string, Effect> = {};
      let autoClickBonus = 0;


      Object.entries(playerData.effects || {}).forEach(([effectId, effect]) => {
        if (effect.remainingTicks > 0) {
          // Apply auto-click effects
          if (effect.type === 'auto_click') {
            const multipliedAutoClicks = Math.floor(effect.value * clickMultipliers);
            autoClickBonus += multipliedAutoClicks/2;
          }
          
          // Keep effect with reduced ticks
          updatedEffects[effectId] = {
            ...effect,
            remainingTicks: effect.remainingTicks - 1
          };
        }
      });

      console.log("Effects after processing:", updatedEffects);

      console.log("Auto-click bonus this tick:", autoClickBonus);
      // Add auto-click bonus to pending clicks
      if (autoClickBonus > 0) {
        setPendingClicks(prev => prev + autoClickBonus);
      }

      setTimeout(() => setIsProcessingEffects(false), 100);

      return {
        ...prev,
        [currentPlayer]: {
          ...playerData,
          effects: updatedEffects
        }
      };
    });
  };


  // Batched update every second - using useCallback to avoid recreating the function
  const syncToFirebase = () => {
    //console.log("Syncing to Firebase...");
    const currentPlayer = gameState.currentPlayer;
    if (!gameState.roomId || !currentPlayer) return;
    
    
    const playerData = gameState[currentPlayer];
    if (!playerData) return;
    
    let basePassiveIncome = playerData.passiveIncome || 0;
    const passiveMultipliers = Object.values(playerData.effects || {})
      .filter(effect => effect.type === 'passive_multiplier')
      .reduce((total, effect) => total * effect.value, 1);
    
    const effectivePassiveIncome = Math.floor(basePassiveIncome * passiveMultipliers);
    const totalIncrement = pendingClicks + effectivePassiveIncome;

    //console.log("Current clicks:", gameState[currentPlayer]?.clicks);
    //console.log("Pending clicks:", pendingClicks);
    
    //console.log("Incrementing clicks by:", totalIncrement, "for", currentPlayer);
    const playerRef = ref(db, `rooms/${gameState.roomId}/${currentPlayer}`);
    
    //console.log("Resetting pending clicks to 0");
    setPendingClicks(0);

    runTransaction(playerRef, (currentValue) => {
      if (typeof currentValue === 'object' && currentValue !== null) {
        const newData = {
          clicks: (currentValue.clicks || 0) + totalIncrement,
          passiveIncome: basePassiveIncome || currentValue.passiveIncome,
          items: playerData.items || currentValue.items  || {},
          effects: playerData.effects || currentValue.effects || {}
        };

        console.log("New data to be set in Firebase:", newData);

        return newData;
      } else {
        // New player
        return {
          clicks: totalIncrement,
          passiveIncome: basePassiveIncome,
          items: playerData.items || {},
          effects: playerData.effects || {}
        };
      }
    }).then(() => {
      lastSyncRef.current = Date.now();
    }).catch((error) => {
      console.error('Failed to sync clicks:', error);
      });
  };

  // Add effect helper function
  const addEffect = (effectData: Omit<Effect, 'remainingTicks' >, durationTicks: number) => {
    if (!gameState.currentPlayer) return;
    
    setGameState(prev => {
      const currentPlayer = prev.currentPlayer!;
      const playerData = prev[currentPlayer]!;
      
      const effect: Effect = {
        ...effectData,
        remainingTicks: durationTicks,
      };
      
      return {
        ...prev,
        [currentPlayer]: {
          ...playerData,
          effects: {
            ...playerData.effects,
            [effect.id]: effect
          }
        }
      };
    });
  };

  // Get active effects helper
  const getActiveEffects = (type?: Effect['type']): Effect[] => {
    if (!gameState.currentPlayer || !gameState[gameState.currentPlayer]) return [];
    
    const effects = Object.values(gameState[gameState.currentPlayer]!.effects || {});
    return type ? effects.filter(effect => effect.type === type) : effects;
  };

  useEffect(() => {
    console.log("Heartbeat detected");
    
    syncToFirebase();
    processEffects();
  }, [heartbeat]);

  // Set up the heartbeat interval
  useEffect(() => {
    if (!gameState.roomId || !gameState.currentPlayer) return;
    
    //console.log("Setting up interval");

    const interval = setInterval(() => {
      setHeartbeat(prev => prev + 1);
    }, 1000);
    
    return () => {
      //console.log("Clearing interval");
      clearInterval(interval);
    };
  }, [gameState.roomId, gameState.currentPlayer]);

  useEffect(() => {
    if (!gameState.roomId) return;
    
    const p1Ref = ref(db, `rooms/${gameState.roomId}/p1`);
    const p2Ref = ref(db, `rooms/${gameState.roomId}/p2`);
    
    const ListenerP1 = onValue(p1Ref, (snapshot) => {
      //console.log("P1 data changed in Firebase");
      const val = snapshot.val();
      if (val !== null) {
        console.log('P1 value from Firebase:', val.clicks);
        setGameState(prev => {

          const shouldPreserveEffects = prev.currentPlayer === "p1";
          
          if (typeof val === 'object') {
            return {
              ...prev,
              p1: {
                id: "p1",
                clicks: val.clicks || 0,
                passiveIncome: val.passiveIncome || 0,
                items: val.items || {},
                effects: shouldPreserveEffects ? (prev.p1?.effects || {}) : (val.effects || {})
              }
            };
          }
          return prev;
        });
      }
    });
    
    const ListenerP2 = onValue(p2Ref, (snapshot) => {
      //console.log("P2 data changed in Firebase");
      const val = snapshot.val();
      if (val !== null) {
        console.log('P2 value from Firebase:', val.clicks);
        setGameState(prev => {

          const shouldPreserveEffects = prev.currentPlayer === "p2";
          
          if (typeof val === 'object') {
            return {
              ...prev,
              p2: {
                id: "p2",
                clicks: val.clicks || 0,
                passiveIncome: val.passiveIncome || 0,
                items: val.items || {},
                effects: shouldPreserveEffects ? (prev.p2?.effects || {}) : (val.effects || {})
              }
            };
          }
          return prev;
        });
      }
    });
    
    return () => {
      ListenerP1();
      ListenerP2();
    };
  }, [gameState.roomId]);

  const calculatedTotalClicks = () => {
    if (gameState.currentPlayer === null) return 0;
    if (!gameState[gameState.currentPlayer]) return 0;
    const playerData = gameState[gameState.currentPlayer];
    if (!playerData) return 0;
    return playerData.clicks + pendingClicks;
  }

  const value = {
    gameState,
    setGameState,
    pendingClicks,
    setPendingClicks,
    heartbeat,
    calculatedTotalClicks,
    addEffect,
    addOpponentEffect,
    getActiveEffects
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