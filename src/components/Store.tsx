// src/components/Store.tsx
import React from 'react';
import StoreItem from './StoreItem';
import { useGame } from '../contexts/GameContext';
import { STORE_ITEMS } from '../data/storeItems';
import "../styles/Store.css"

const Store: React.FC = () => {
  const { gameState, pendingClicks } = useGame();
  const currentPlayerData = gameState.currentPlayer ? gameState[gameState.currentPlayer] : null;

  const canAfford = (cost: number) => {
    if (!currentPlayerData) return false;
    return currentPlayerData.clicks + pendingClicks >= cost;
  }
  
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
              canAfford={canAfford(item.cost)}
              ownedCount={ownedCount}
              currentPlayer={gameState.currentPlayer!}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Store;