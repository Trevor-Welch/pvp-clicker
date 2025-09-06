// src/components/ToastDisplay.tsx
import React from 'react';
import { useToast } from '../contexts/ToastContext';

interface ToastDisplayProps {
  currentPlayer?: "p1" | "p2" | null;
}

const ToastDisplay: React.FC<ToastDisplayProps> = ({ currentPlayer }) => {
  const { toasts, hideToast } = useToast();

  // Filter toasts based on current player
  const visibleToasts = toasts.filter(toast => 
    toast.target === "all" || toast.target === currentPlayer
  );

  if (visibleToasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {visibleToasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: '#333',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            animation: 'slideIn 0.3s ease-out',
            minWidth: '200px',
            maxWidth: '400px'
          }}
          onClick={() => hideToast(toast.id)}
        >
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            {toast.message}
          </div>
          <div style={{ 
            fontSize: '12px', 
            opacity: 0.7, 
            marginTop: '4px',
            textAlign: 'right'
          }}>
            Click to dismiss
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ToastDisplay;