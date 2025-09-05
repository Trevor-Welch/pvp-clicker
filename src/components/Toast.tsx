// src/components/Toast.tsx
import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onHide }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onHide, 1000); // give fade out 1s before hiding
      }, 3000); // display duration
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        padding: "0.8rem 1.2rem",
        borderRadius: "8px",
        opacity: show ? 1 : 0,
        transition: "opacity 1s",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
