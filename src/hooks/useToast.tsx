// src/hooks/useToast.tsx
import { useState, useCallback } from "react";

export type ToastTarget = "all" | "p1" | "p2";

interface ToastState {
  message: string;
  visible: boolean;
  target: ToastTarget;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    visible: false,
    target: "all",
  });

  const showToast = useCallback((message: string, target: ToastTarget = "all") => {
    setToast({ message, visible: true, target });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
};
