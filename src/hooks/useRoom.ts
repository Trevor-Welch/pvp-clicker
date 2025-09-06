// src/hooks/useRoom.ts
import { useCallback } from "react";
import { db } from "../firebase";
import { ref, runTransaction, onValue, onDisconnect } from "firebase/database";
import type { GameState } from "../types/game";

interface UseRoomProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const useRoom = ({ gameState, setGameState }: UseRoomProps) => {
  
  /** CREATE ROOM -> always p1 */
  const createRoom = useCallback((roomId: string) => {
    setGameState({
      roomId,
      p1: { id: "p1", clicks: 0, passiveIncome: 0, items: {}, effects: {} },
      p2: { id: "p2", clicks: 0, passiveIncome: 0, items: {}, effects: {} },
      currentPlayer: "p1",
    });
    const roomRef = ref(db, `rooms/${roomId}`);
    runTransaction(roomRef, () => ({ 
      p1: { clicks: 0, passiveIncome: 0, items: {}, effects: {} },
      p2: { clicks: 0, passiveIncome: 0, items: {}, effects: {} },
    }));
    subscribeToRoom(roomId);
  }, [setGameState]);
  
  /** JOIN ROOM -> always p2 */
  const joinRoom = useCallback((roomId: string) => {
    const roomRef = ref(db, `rooms/${roomId}`);
    // Get initial values once
    onValue(roomRef, (snapshot) => {
      const value = snapshot.val() ?? {};
      setGameState({
        roomId,
        currentPlayer: "p2",
        p1: {
          id: "p1",
          clicks: value.p1?.clicks ?? 0,
          passiveIncome: value.p1?.passiveIncome ?? 0,
          items: {},
          effects: {}
        },
        p2: {
          id: "p2",
          clicks: value.p2?.clicks ?? 0,
          passiveIncome: value.p2?.passiveIncome ?? 0,
          items: {},
          effects: {}
        },
      });
    }, { onlyOnce: true });
    subscribeToRoom(roomId);
  }, [setGameState]);

  const subscribeToRoom = useCallback((roomId: string) => {
    const p1Ref = ref(db, `rooms/${roomId}/p1`);
    const p2Ref = ref(db, `rooms/${roomId}/p2`);

    onValue(p1Ref, (snapshot) => {
      const val = snapshot.val();
      if (val === null) {
        setGameState(prev => ({ ...prev, p1: null }));
      } else {
        setGameState(prev =>
          prev.p1 ? { ...prev, p1: { ...prev.p1, ...val } } : prev
        );
      }
    });

    onValue(p2Ref, (snapshot) => {
      const val = snapshot.val();
      if (val === null) {
        setGameState(prev => ({ ...prev, p2: null }));
      } else {
        setGameState(prev =>
          prev.p2 ? { ...prev, p2: { ...prev.p2, ...val } } : prev
        );
      }
    });

    // Setup automatic removal on disconnect for the current player
    if (gameState.currentPlayer) {
      onDisconnect(ref(db, `rooms/${roomId}/${gameState.currentPlayer}`)).remove();
    }
  }, [setGameState, gameState.currentPlayer]);
  
  return { createRoom, joinRoom };
};