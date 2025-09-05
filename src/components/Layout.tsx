// src/components/Layout.tsx
import React from "react";
import type { ReactNode } from "react";


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem", textAlign: "center" }}>
      <header>
        <h1>🍪 PvP Cookie Clicker</h1>
      </header>
      <main>{children}</main>
      <footer style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
        &copy; 2025 PvP Cookie Clicker
      </footer>
    </div>
  );
};

export default Layout;
