// src/components/DebugLogger.tsx
import React from "react";
import { useToast } from "../contexts/ToastContext";
import { useGame } from "../contexts/GameContext";

const DebugLogger: React.FC = () => {
  const { showToast, pushToast } = useToast();
  const { gameState } = useGame();

  const handleClick = () => {
    console.group("=== Current Game State ===");

    console.log("Room ID:", gameState.roomId);
    console.log("Current Player:", gameState.currentPlayer);

    const logPlayer = (label: string, player: any) => {
      if (!player) {
        console.log(`${label}: null`);
        return;
      }
      console.group(`${label}`);
      console.log("Clicks:", player.clicks);
      console.log("Passive Income:", player.passiveIncome);
      console.log("Items (local only):", player.items);
      console.groupEnd();
    };

    logPlayer("Player 1", gameState.p1);
    logPlayer("Player 2", gameState.p2);

    console.groupEnd();

    // Use pushToast if we're in a room (shared with both players)
    // Use showToast if we're not in a room (local only)
    if (gameState.roomId) {
      pushToast(`Debug: ${gameState.currentPlayer} logged game state`, "all");
    } else {
      showToast("Game state logged to console!", "all");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        margin: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#f0ad4e",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
      }}
    >
      Log Game State
    </button>
  );
};

export default DebugLogger;
