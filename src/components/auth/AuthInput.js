import React from "react";
import "./AuthStyles.css";

function AuthInput({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="auth-input-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="auth-input"
      />
    </div>
  );
}

export default AuthInput;