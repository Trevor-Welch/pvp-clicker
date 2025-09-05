// src/components/CookieCounter.tsx
import React from "react";

interface CookieCounterProps {
  clicks: number;
  onClick: () => void;
  playerId: "p1" | "p2";
  isActivePlayer: boolean;
}

const CookieCounter: React.FC<CookieCounterProps> = ({
  clicks,
  onClick,
  playerId,
  isActivePlayer,
}) => {
  return (
    <div
      style={{
        margin: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: 10,
        opacity: isActivePlayer ? 1 : 0.5,
      }}
    >
      <h2>{playerId === "p1" ? "Player 1" : "Player 2"}</h2>
      <h1>{clicks}</h1>
      {isActivePlayer && (
        <button
          onClick={onClick}
          style={{ fontSize: "2rem", padding: "1rem 2rem", borderRadius: 10 }}
        >
          Click Cookie
        </button>
      )}
    </div>
  );
};

export default CookieCounter;
