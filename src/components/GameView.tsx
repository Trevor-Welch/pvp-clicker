// src/components/GameView.tsx
import React from "react";
import RoomSelector from "./RoomSelector";
import CookieCounter from "./CookieCounter";
import DebugLogger from "./DebugLogger";
import { useGame } from "../contexts/GameContext";
import Store from "./Store";

const GameView: React.FC = () => {
  const { gameState, handleClick } = useGame();

  // Render room selector if no room joined
  if (!gameState.roomId) {
    return (
      <RoomSelector
      />
    );
  }

  // Render game room
  return (
    <div className="game-view">
        <div className="left-col">
            <h2>Room ID: {gameState.roomId}</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {gameState.p1 && (
          <CookieCounter
            clicks={gameState.p1.clicks}
            onClick={gameState.currentPlayer === "p1" ? handleClick : () => {}}
            playerId="p1"
            isActivePlayer={gameState.currentPlayer === "p1"}
            passiveIncome={gameState.p1.passiveIncome}
          />
        )}
        {gameState.p2 && (
          <CookieCounter
            clicks={gameState.p2.clicks}
            onClick={gameState.currentPlayer === "p2" ? handleClick : () => {}}
            playerId="p2"
            isActivePlayer={gameState.currentPlayer === "p2"}
            passiveIncome={gameState.p2.passiveIncome}
          />
        )}
      </div>
      <DebugLogger />
        </div>
        <div className="right-col">
        <Store />
      </div>
    </div>
  );
};

export default GameView;