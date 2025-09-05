// src/contexts/ToastContext.tsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ref, push, set, onValue, off } from 'firebase/database';
import { db } from '../firebase';
import type { ReactNode } from 'react';
import type { GameState } from '../types/game';

export interface ToastMessage {
  id: string;
  message: string;
  target: "all" | "p1" | "p2";
  timestamp: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, target: "all" | "p1" | "p2", duration?: number) => void;
  pushToast: (message: string, target: "all" | "p1" | "p2", duration?: number, overrideRoomId?: string) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
  gameState: GameState;
}

export const ToastProvider = ({ children, gameState }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { roomId, currentPlayer } = gameState;
  
  // Keep track of active timers to prevent duplicates
  const activeTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Helper function to set timer for toast auto-hide
  const setToastTimer = (id: string, duration: number) => {
    // Clear existing timer if it exists
    const existingTimer = activeTimers.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      hideToast(id);
      activeTimers.current.delete(id);
    }, duration);

    activeTimers.current.set(id, timer);
  };

  // Local toast - only shows on current player's screen
  const showToast = (message: string, target: "all" | "p1" | "p2", duration = 3000) => {
    console.log("Showing local toast:", { message, target, duration });
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      id,
      message,
      target,
      timestamp: Date.now(),
    };
    setToasts(prev => [...prev, newToast]);
    console.log("Local toasts after showToast:", [...toasts, newToast]);
    // Set timer for auto-hide
    setToastTimer(id, duration);
  };

  // Shared toast - pushes to Firebase so both players see it
  const pushToast = (message: string, target: "all" | "p1" | "p2", duration = 3000, overrideRoomId?: string) => {
    const targetRoomId = overrideRoomId || roomId;
    console.log("Pushing toast:", { message, target, duration, roomId: targetRoomId });
    
    if (!targetRoomId) {
      console.warn('Cannot push toast: no room connected');
      return;
    }
    
    const toastsRef = ref(db, `rooms/${targetRoomId}/toasts`);
    const newToastRef = push(toastsRef);
    const toastData = {
      message,
      target,
      timestamp: Date.now()
    };
    
    set(newToastRef, toastData);
    
    // Auto-remove from Firebase after duration + 1 second buffer
    setTimeout(() => {
      set(newToastRef, null);
    }, duration + 1000);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    
    // Clear the timer if it exists
    const timer = activeTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      activeTimers.current.delete(id);
    }
  };

  // Track previous player states to detect disconnections
  const [prevP1, setPrevP1] = useState(gameState.p1);
  const [prevP2, setPrevP2] = useState(gameState.p2);

  // Check for player disconnections and show toasts
  useEffect(() => {
    if (prevP1 && !gameState.p1) {
      showToast("Player 1 disconnected!", "all");
    }
    if (prevP2 && !gameState.p2) {
      showToast("Player 2 disconnected!", "all");
    }
    
    setPrevP1(gameState.p1);
    setPrevP2(gameState.p2);
  }, [gameState.p1, gameState.p2]);

  // Subscribe to Firebase toasts when room changes
  useEffect(() => {
    if (!roomId || !currentPlayer) {
      return;
    }

    const toastsRef = ref(db, `rooms/${roomId}/toasts`);
    
    /*
    const unsubscribe = onValue(toastsRef, (snapshot) => {
      const firebaseToasts = snapshot.val();
      if (!firebaseToasts) return;

      Object.entries(firebaseToasts).forEach(([firebaseId, toastData]: [string, any]) => {
        if (!toastData) return;
        
        const { message, target, timestamp } = toastData;
        
        // Only show toast if it's for this player or for all
        if (target === "all" || target === currentPlayer) {
          const localId = `firebase-${firebaseId}`;
          
          // Check if we already have this toast to avoid duplicates
          setToasts(prev => {
            if (prev.some(toast => toast.id === localId)) {
              return prev; // Toast already exists, don't add it again
            }
            
            const newToast: ToastMessage = {
              id: localId,
              message,
              target,
              timestamp
            };
            
            // Set timer for auto-hide (only for new toasts)
            setToastTimer(localId, 3000);
            
            return [...prev, newToast];
          });
        }
      });
    });
    */


    // Cleanup function
    return () => {
      off(toastsRef);
    };
  }, [roomId, currentPlayer]);

  // Cleanup all timers when component unmounts
  useEffect(() => {
    return () => {
      activeTimers.current.forEach(timer => clearTimeout(timer));
      activeTimers.current.clear();
    };
  }, []);

  const value = {
    toasts,
    showToast,      // Local only
    pushToast,      // Shared via Firebase
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook for using toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};