// src/components/SyncTimer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';

interface SyncTimerProps {
  size?: number;
  strokeWidth?: number;
}

const SyncTimer: React.FC<SyncTimerProps> = ({ 
  size = 32, 
  strokeWidth = 2 
}) => {
  const { heartbeat } = useGame();
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  
  // Reset the dial whenever heartbeat changes (game tick)
  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [heartbeat]);
  
  // Smooth animation between heartbeats
  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / 1000, 1); // 0-1 over 1 second
      setProgress(newProgress);
      
      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [heartbeat]);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);
  
  return (
    <div style={{ display: 'inline-block', margin: '0 8px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default SyncTimer;