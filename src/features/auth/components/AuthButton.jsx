import React from "react";
import "../styles/AuthStyles.css";

function AuthButton({ text, type = "button", disabled = false }) {
  return (
    <button type={type} className="auth-button" disabled={disabled}>
      {text}
    </button>
  );
}

export default AuthButton;