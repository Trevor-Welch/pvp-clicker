// src/hooks/useStore.ts
import { useGame } from '../contexts/GameContext';


interface StoreItemData {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'passive' | 'active';
  passiveIncomeBonus?: number;
  effect?: {
    id: string;
    type: 'click_multiplier' | 'passive_multiplier' | 'auto_click' | 'other';
    value: number;
    name: string;
    description?: string;
    duration: number; // in seconds
  };
  targetType: string;
  icon?: string;
}

export const useStore = () => {
  const { gameState, setGameState, pendingClicks, setPendingClicks, calculatedTotalClicks, addEffect, addOpponentEffect } = useGame();

  const purchaseItem = async (item: StoreItemData) => {
    if (!gameState) {
      throw new Error('No game state available');
    }
    const playerData = gameState.currentPlayer ? gameState[gameState.currentPlayer] : null;
    if (!playerData) {
      throw new Error('No player data available');
    }

    console.log('Attempting to purchase item:', item);
    console.log('Current player clicks:', playerData.clicks);
    console.log('Pending clicks:', pendingClicks);
    console.log('Total available clicks:', calculatedTotalClicks ? calculatedTotalClicks(gameState.currentPlayer!) : playerData.clicks + pendingClicks);

    const currentClicks = calculatedTotalClicks ? calculatedTotalClicks(gameState.currentPlayer!) : playerData.clicks + pendingClicks;
    if (currentClicks < item.cost) {
      throw new Error('Insufficient clicks to purchase item');
    }

    setPendingClicks(prev => prev - item.cost);

      if (item.type === 'passive') {
        // Handle passive items (permanent upgrades)
        setGameState(prevState => {
          const currentPlayer = prevState.currentPlayer!;
          const currentPlayerData = prevState[currentPlayer]!;
          
          return {
            ...prevState,
            [currentPlayer]: {
              ...currentPlayerData,
              items: {
                ...currentPlayerData.items,
                [item.id]: (currentPlayerData.items[item.id] || 0) + 1
              },
              passiveIncome: (currentPlayerData.passiveIncome || 0) + (item.passiveIncomeBonus || 0)
            }
          };
        });
      } else if (item.type === 'active' && item.effect) {
        // Determine target
        if (item.targetType === 'opponent') {
          // Apply effect to opponent
          addOpponentEffect(item.effect, item.effect.duration);
        } else {
          // Apply effect to self (default behavior)
          addEffect(item.effect, item.effect.duration);
        }
        
        // Still track the item purchase for statistics/achievements
        setGameState(prevState => {
          const currentPlayer = prevState.currentPlayer!;
          const currentPlayerData = prevState[currentPlayer]!;
          
          return {
            ...prevState,
            [currentPlayer]: {
              ...currentPlayerData,
              items: {
                ...currentPlayerData.items,
                [item.id]: (currentPlayerData.items[item.id] || 0) + 1
              }
            }
          };
        });
      }
    };

  return { 
    purchaseItem
  };
};