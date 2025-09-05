// src/controllers/GameController.tsx
import { useState, useRef } from "react";
import { db } from "../firebase";
import { ref, runTransaction, onValue, onDisconnect } from "firebase/database";
import RoomSelector from "../components/RoomSelector";
import CookieCounter from "../components/CookieCounter";
import DebugLogger from "../components/DebugLogger";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

interface PlayerState {
  id: "p1" | "p2";
  clicks: number;
  passiveIncome: number;
}

interface GameState {
  roomId: string;
  p1: PlayerState | null;
  p2: PlayerState | null;
  currentPlayer: "p1" | "p2" | null;
}

const GameController: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    roomId: "",
    p1: null,
    p2: null,
    currentPlayer: null,
  });

  const localClicks = useRef(0);
  const { toast, showToast, hideToast } = useToast();

  /** Subscribe to both players for real-time updates */
  const subscribeToRoom = (roomId: string) => {
    const p1Ref = ref(db, `rooms/${roomId}/p1`);
    const p2Ref = ref(db, `rooms/${roomId}/p2`);
    const toastsRef = ref(db, `rooms/${roomId}/toasts`);

    onValue(p1Ref, (snapshot) => {
        const val = snapshot.val();
        if (val === null) {
        showToast("Player 1 disconnected!", "all");
        setGameState(prev => ({ ...prev, p1: null }));
        } else {
        setGameState(prev => prev.p1 ? { ...prev, p1: { ...prev.p1, clicks: val } } : prev);
        }
    });

    onValue(p2Ref, (snapshot) => {
        const val = snapshot.val();
        if (val === null) {
        showToast("Player 2 disconnected!", "all");
        setGameState(prev => ({ ...prev, p2: null }));
        } else {
        setGameState(prev => prev.p2 ? { ...prev, p2: { ...prev.p2, clicks: val } } : prev);
        }
    });

    // Listen for toast updates
    onValue(toastsRef, (snapshot) => {
        const toasts = snapshot.val() ?? [];
        const lastToast = toasts[toasts.length - 1];
        if (lastToast) {
        showToast(lastToast.message, lastToast.target as any);
        }
    });

    // Setup automatic removal on disconnect for the current player
    if (gameState.currentPlayer) {
        onDisconnect(ref(db, `rooms/${roomId}/${gameState.currentPlayer}`)).remove();
    }
  };

  /** CREATE ROOM -> always p1 */
  const handleCreateRoom = (roomId: string) => {
    setGameState({
      roomId,
      p1: { id: "p1", clicks: 0, passiveIncome: 0 },
      p2: { id: "p2", clicks: 0, passiveIncome: 0 },
      currentPlayer: "p1",
    });

    const roomRef = ref(db, `rooms/${roomId}`);
    runTransaction(roomRef, () => ({ p1: 0, p2: 0 }));

    subscribeToRoom(roomId);
  };

  /** JOIN ROOM -> always p2 */
  const handleJoinRoom = (roomId: string) => {
    const roomRef = ref(db, `rooms/${roomId}`);

    // Get initial values once
    onValue(roomRef, (snapshot) => {
      const value = snapshot.val() ?? {};
      setGameState({
        roomId,
        currentPlayer: "p2",
        p1: { id: "p1", clicks: value.p1 ?? 0, passiveIncome: 0 },
        p2: { id: "p2", clicks: value.p2 ?? 0, passiveIncome: 0 },
      });
    }, { onlyOnce: true });

    subscribeToRoom(roomId);

    // Push a toast to Firebase so all players see it
    const toastsRef = ref(db, `rooms/${roomId}/toasts`);
    runTransaction(toastsRef, (current) => {
        const arr = current ?? [];
        arr.push({ message: "Player 2 joined!", target: "all", timestamp: Date.now() });
        return arr;
    });
  };

  /** HANDLE LOCAL CLICK */
  const handleClick = () => {
    if (!gameState.currentPlayer || !gameState.roomId) return;

    const playerKey = gameState.currentPlayer;
    localClicks.current += 1;

    // Update local state
    setGameState(prev => {
      const player = prev[playerKey];
      if (!player) return prev;
      return { ...prev, [playerKey]: { ...player, clicks: player.clicks + 1 } };
    });

    // Update Firebase
    const playerRef = ref(db, `rooms/${gameState.roomId}/${playerKey}`);
    runTransaction(playerRef, (current) => (current ?? 0) + 1);
  };

  // Render
  if (!gameState.roomId) {
    return <RoomSelector
      onCreateRoom={handleCreateRoom}
      onJoinRoom={handleJoinRoom}
    />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Room ID: {gameState.roomId}</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {gameState.p1 && (
          <CookieCounter
            clicks={gameState.p1.clicks}
            onClick={gameState.currentPlayer === "p1" ? handleClick : () => {}}
            playerId="p1"
            isActivePlayer={gameState.currentPlayer === "p1"}
          />
        )}
        {gameState.p2 && (
          <CookieCounter
            clicks={gameState.p2.clicks}
            onClick={gameState.currentPlayer === "p2" ? handleClick : () => {}}
            playerId="p2"
            isActivePlayer={gameState.currentPlayer === "p2"}
          />
        )}
      </div>
      <DebugLogger gameState={gameState} />

      <Toast
        message={toast.message}
        visible={toast.visible && (toast.target === "all" || toast.target === gameState.currentPlayer)}
        onHide={hideToast}
      />
    </div>
  );
};

export default GameController;
