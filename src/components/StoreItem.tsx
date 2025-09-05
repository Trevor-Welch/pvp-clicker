// src/components/StoreItem.tsx
import React from "react";
import { useGame } from "../contexts/GameContext";
import { useToast } from "../contexts/ToastContext";
import { useStore } from "../hooks/useStore";

interface StoreItemData {
  id: string;
  name: string;
  description: string;
  cost: number;
  passiveIncomeBonus: number;
  icon?: string;
}

interface StoreItemProps {
  item: StoreItemData;
  playerClicks: number;
  canAfford: boolean;
  ownedCount: number;
}

const StoreItem: React.FC<StoreItemProps> = ({
  item,
  playerClicks,
  canAfford,
  ownedCount,
}) => {
  const { gameState } = useGame();
  const { showToast } = useToast();
  const { purchaseItem } = useStore(gameState.roomId, gameState.currentPlayer);

  const handlePurchase = async () => {
    if (!canAfford || !gameState.currentPlayer) return;

    try {
      await purchaseItem(item);
      showToast(
        `Purchased ${item.name}! +${item.passiveIncomeBonus} passive income`,
        gameState.currentPlayer
      );
    } catch (err) {
      console.error("Purchase failed:", err);
      showToast(`Failed to purchase ${item.name}`, gameState.currentPlayer);
    }
  };

  return (
    <div
      className={`store-item ${canAfford ? "affordable" : "unaffordable"}`}
      onClick={handlePurchase}
      style={{
        cursor: canAfford ? "pointer" : "not-allowed",
        userSelect: "none",
      }}
    >
      <div className="store-item-content">
        <div className="store-item-header">
          {item.icon && <span className="store-item-icon">{item.icon}</span>}
          <h4 className="store-item-name">{item.name}</h4>
          {ownedCount > 0 && (
            <span className="store-item-owned">Owned: {ownedCount}</span>
          )}
          <span className="store-item-cost">{item.cost} clicks</span>
        </div>
        <p className="store-item-description">{item.description}</p>
      </div>
    </div>
  );
};

export default StoreItem;
