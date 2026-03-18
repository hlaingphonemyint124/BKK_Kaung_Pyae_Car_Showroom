import React from "react";
import "./AuthStyles.css";

function AuthButton({ text, onClick, type = "button" }) {
  return (
    <button type={type} className="auth-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default AuthButton;