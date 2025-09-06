// src/components/CookieCounter.tsx
import React from "react";
import { useClicks } from "../hooks/useClicks";
import { useGame } from "../contexts/GameContext";

interface CookieCounterProps {
  clicks: number;
  playerId: "p1" | "p2";
  isActivePlayer: boolean;
  passiveIncome: number; // new prop for CPS
}

const CookieCounter: React.FC<CookieCounterProps> = ({
  clicks,
  playerId,
  isActivePlayer,
  passiveIncome,
}) => {
  const { clickCookie } = useClicks();
  const { calculatedTotalClicks } = useGame();

  const handleClick = () => {
    clickCookie(10);
  };

  return (
    <div
      style={{
        margin: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: 10,
        opacity: isActivePlayer ? 1 : 0.5,
        minWidth: "250px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h2>{playerId === "p1" ? "Player 1" : "Player 2"}</h2>
      <h1>{isActivePlayer ? calculatedTotalClicks(playerId) : clicks}</h1>
      <span style={{ fontSize: "0.9rem", color: "#555" }}>
        Passive Income: {passiveIncome.toFixed(1)} cps
      </span>
      {isActivePlayer && (
        <button
          onClick={handleClick}
          style={{ fontSize: "2rem", padding: "1rem 2rem", borderRadius: 10, marginTop: "0.5rem" }}
        >
          Click Cookie
        </button>
        
      )}
    </div>
  );
};

export default CookieCounter;
