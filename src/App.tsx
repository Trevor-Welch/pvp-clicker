// src/App.tsx
// Main application component

import React from "react";
import GameController from "./controllers/GameController";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <Layout>
      <GameController />
    </Layout>
  );
};

export default App;
