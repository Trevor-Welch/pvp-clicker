// src/hooks/useClicks.ts
import { useRef } from 'react';
import { db } from '../firebase';
import { ref, runTransaction } from 'firebase/database';

export const useClicks = (roomId: string, currentPlayer: "p1" | "p2" | null) => {
  const localClicks = useRef(0);

  const handleClick = () => {
    if (!currentPlayer || !roomId) return;

    const playerKey = currentPlayer;
    localClicks.current += 1;

    // Update Firebase
    const playerRef = ref(db, `rooms/${roomId}/${playerKey}`);
    runTransaction(playerRef, (current) => {
      if (!current) return { clicks: 1, passiveIncome: 0 };
      return {
        ...current,
        clicks: current.clicks + 1,
      };
    });
  };

  return {
    handleClick,
    localClicks: localClicks.current,
  };
};