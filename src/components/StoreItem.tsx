// src/components/StoreItem.tsx
import React from "react";
import { useToast } from "../contexts/ToastContext";
import { useStore } from "../hooks/useStore";
import { useGame } from "../contexts/GameContext";
import type { StoreItemData } from "../types";

interface StoreItemProps {
  item: StoreItemData;
  canAfford: boolean;
  ownedCount: number;
  currentPlayer: "p1" | "p2";
}

const StoreItem: React.FC<StoreItemProps> = ({
  item,
  canAfford,
  ownedCount,
  currentPlayer,
}) => {
  const { showToast } = useToast();
  const { purchaseItem } = useStore();
  const { getActiveEffects } = useGame();

  const isEffectActive = item.type === 'active' && item.effect ? 
    getActiveEffects().some(effect => effect.id === item.effect!.id) : false;

  const handlePurchase = async () => {
    if (!canAfford || isEffectActive) return;

    try {
      await purchaseItem(item);
      if (item.type === 'passive') {
        showToast(
          `Purchased ${item.name}! +${item.passiveIncomeBonus}/sec`,
          currentPlayer
        );
      } else if (item.type === 'active') {
        const effectDescription = item.effect?.description || 'Effect activated';
        showToast(
          `Used ${item.name}! ${effectDescription}`,
          currentPlayer
        );
      }
    } catch (err) {
      console.error("Purchase failed:", err);
      showToast(`Failed to purchase ${item.name}`, currentPlayer);
    }
  };

  /*
  const getItemTypeDisplay = () => {
    if (item.type === 'passive') {
      return `+${item.passiveIncomeBonus}/sec`;
    } else if (item.type === 'active' && item.effect) {
      switch (item.effect.type) {
        case 'click_multiplier':
          return `${item.effect.value}x clicks`;
        case 'passive_multiplier':
          return `${item.effect.value}x passive`;
        case 'auto_click':
          return `${item.effect.value}/sec auto`;
        default:
          return 'Special effect';
      }
    }
    return '';
  };
  */

  const getItemStatus = () => {
    if (item.type === 'passive' && ownedCount > 0) {
      return `Owned: ${ownedCount}`;
    } else if (item.type === 'active') {
      if (isEffectActive) {
        const activeEffect = getActiveEffects().find(effect => effect.id === item.effect!.id);
        return `Active: ${activeEffect?.remainingTicks}s`;
      } else {
        return `Used: ${ownedCount}`;
      }
    }
    return '';
  };

  const isDisabled = !canAfford || isEffectActive;

   return (
    <div
      className={`store-item ${canAfford && !isEffectActive ? "affordable" : "unaffordable"} ${item.type === 'active' ? 'active-item' : 'passive-item'} ${isEffectActive ? 'effect-active' : ''}`}
      onClick={handlePurchase}
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <div className="store-item-content">
        <div className="store-item-header">
          {item.icon && <span className="store-item-icon">{item.icon}</span>}
          <div className="store-item-info">
            <h4 className="store-item-name">
              {item.name}
              {item.type === 'active' && <span className="item-type-badge">⚡</span>}
            </h4>
            <div className="store-item-stats">
              {getItemStatus() && (
                <span className="store-item-status">{getItemStatus()}</span>
              )}
            </div>
          </div>
          <span className="store-item-cost">{item.cost} clicks</span>
        </div>
        <p className="store-item-description">
          {item.description}
          {isEffectActive && <span className="active-indicator"> (ACTIVE)</span>}
        </p>
      </div>
    </div>
  );
};

export default StoreItem;