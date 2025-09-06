// src/components/DebugLogger.tsx
import React, { useState, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import SyncTimer from "./SyncTimer";

const DebugLogger: React.FC = () => {
  const { gameState, pendingClicks, calculatedTotalClicks } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [currentState, setCurrentState] = useState(gameState);

  // Update the local state whenever the gameState changes
  useEffect(() => {
    if (isOpen) {
      setCurrentState(gameState);
    }
  }, [gameState, isOpen]);

  return (
    <>
      {/* Open panel button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            margin: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#f0ad4e",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <SyncTimer size={24} strokeWidth={2} />
          Debug
        </button>
      )}
      
      {/* Slide-out panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-350px",
          width: "350px",
          height: "100%",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          padding: "1rem",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
          transition: "right 0.3s ease-in-out",
          zIndex: 2000,
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "0.9rem",
        }}
      >
        {/* Close button inside panel */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0 }}>Debug Panel</h2>
          <SyncTimer size={32} strokeWidth={3} />
        </div>
        
        <p><strong>Room ID:</strong> {currentState.roomId}</p>
                  
        
        {["p1", "p2"].map((playerKey) => {
          const player = currentState[playerKey as "p1" | "p2"];
          return (
            <div key={playerKey} style={{ marginBottom: "1rem" }}>
              <h3>{playerKey.toUpperCase()}</h3>
              {player ? (
                <>
                  <p><strong>Clicks:</strong> {player.clicks}</p>
                  
                  
                  {player == gameState[gameState.currentPlayer!] ? (
                    <div>
                      <p><strong>Pending Clicks:</strong> {pendingClicks}</p>
                    <p>
                      <strong>Calculated Total Clicks:</strong> {calculatedTotalClicks(gameState.currentPlayer!)}
                    </p>
                    <p><strong>Passive Income:</strong> {player.passiveIncome}</p>
                    <p>
                      <strong>Items:</strong>{" "}
                      {player.items && Object.keys(player.items).length > 0
                        ? JSON.stringify(player.items, null, 2)
                        : "None"}
                    </p>
                    </div>
                  ) : (<div><p><strong>Passive Income:</strong> {player.passiveIncome}</p></div>)}
                  
                </>
              ) : (
                <p>null</p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DebugLogger;