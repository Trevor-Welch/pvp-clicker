// src/components/DebugLogger.tsx
import React from "react";

interface DebugLoggerProps {
  gameState: any; // could use your GameState type
}

const DebugLogger: React.FC<DebugLoggerProps> = ({ gameState }) => {
  const handleClick = () => {
    console.log("=== Current Game State ===");
    console.log(gameState);
    console.log("Current Player:", gameState.currentPlayer);
    console.log("==========================");
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
