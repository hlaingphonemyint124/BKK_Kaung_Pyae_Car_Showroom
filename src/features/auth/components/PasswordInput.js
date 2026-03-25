import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/AuthStyles.css";

function PasswordInput({ label, placeholder, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-input-group">
      <label>{label}</label>
      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="auth-input password-input"
        />
        <button
          type="button"
          className="eye-button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;