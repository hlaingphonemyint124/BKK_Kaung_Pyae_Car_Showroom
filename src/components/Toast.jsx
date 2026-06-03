import React, { useEffect } from "react";
import "./Toast.css";

function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Close">✕</button>
    </div>
  );
}

export default Toast;
