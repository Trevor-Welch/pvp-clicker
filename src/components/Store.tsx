// src/components/Store.tsx
import React from 'react';
import StoreItem from './StoreItem';
import { useGame } from '../contexts/GameContext';
import "../styles/Store.css"

interface StoreItemData {
  id: string;
  name: string;
  description: string;
  cost: number;
  passiveIncomeBonus: number;
  icon?: string;
}

const STORE_ITEMS: StoreItemData[] = [
  {
    id: 'extra_mouse',
    name: 'Extra Mouse',
    description: 'Adds +1 passive income per second',
    cost: 20,
    passiveIncomeBonus: 1,
    icon: '🖱️'
  },
  // Add more items here as you expand the store
];

const Store: React.FC = () => {
  const { gameState } = useGame();
  const currentPlayerData = gameState.currentPlayer ? gameState[gameState.currentPlayer] : null;
  
  if (!currentPlayerData) {
    return (
      <div className="store-container">
        <h3>Store</h3>
        <p className="store-message">Join a game to access the store</p>
      </div>
    );
  }

  return (
    <div className="store-container">
      <h3>Store</h3>
      <div className="store-items">
        {STORE_ITEMS.map(item => {
          const ownedCount = currentPlayerData.items?.[item.id] || 0;
          return (
            <StoreItem
              key={item.id}
              item={item}
              playerClicks={currentPlayerData.clicks}
              canAfford={currentPlayerData.clicks >= item.cost}
              ownedCount={ownedCount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Store;