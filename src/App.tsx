// src/App.tsx
import React from "react";
import Layout from "./components/Layout";
import GameView from "./components/GameView";
import { ToastProvider } from "./contexts/ToastContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import ToastDisplay from "./components/ToastDisplay";

// Inner component that has access to GameContext
const AppContent: React.FC = () => {
  const { gameState } = useGame();
  
  return (
    <ToastProvider gameState={gameState}>
      <Layout>
        <GameView />
      </Layout>
      <ToastDisplay currentPlayer={gameState.currentPlayer} />
    </ToastProvider>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;