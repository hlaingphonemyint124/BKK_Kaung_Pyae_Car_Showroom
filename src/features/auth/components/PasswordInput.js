import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/AuthStyles.css";

function PasswordInput({ label, placeholder, value, onChange, name }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-input-group">
      <label htmlFor={name}>{label}</label>

      <div className="password-wrapper">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="auth-input password-input"
        />

        <button
          type="button"
          className="eye-button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEye /> : <FiEyeOff />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;