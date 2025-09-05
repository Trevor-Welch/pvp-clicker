// src/components/Layout.tsx
import React from "react";
import type { ReactNode } from "react";


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="main">
      <header>
        <h1>🍪 PvP Cookie Clicker</h1>
      </header>
      <main>{children}</main>
      <footer>
        &copy; 2025 PvP Cookie Clicker
      </footer>
      </div>
  );
};

export default Layout;
