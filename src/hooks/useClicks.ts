// src/hooks/useClicks.ts
import { useGame } from '../contexts/GameContext';

export const useClicks = () => {
  const { setPendingClicks, getActiveEffects } = useGame();
  
  const clickCookie = (amount: number = 1) => {
    // Calculate click multipliers from active effects
    const clickMultipliers = getActiveEffects('click_multiplier');
    const totalMultiplier = clickMultipliers.reduce((total, effect) => total * effect.value, 1);
    
    const finalAmount = Math.floor(amount * totalMultiplier);
    
    console.log(`Click: base=${amount}, multiplier=${totalMultiplier}, final=${finalAmount}`);
    
    setPendingClicks(prev => prev + finalAmount);
  };

  const getClickMultiplier = () => {
    const clickMultipliers = getActiveEffects('click_multiplier');
    return clickMultipliers.reduce((total, effect) => total * effect.value, 1);
  };

  return {
    clickCookie,
    getClickMultiplier,
  };
};