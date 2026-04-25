import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/AuthStyles.css";

function PasswordInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  onBlur,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-input-group">
      <label htmlFor={name}>{label}</label>

      <div className={`password-wrapper ${error ? "input-error" : ""}`}>
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="current-password"
          className="auth-input password-input"
        />

        <button
          type="button"
          className="eye-button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEye /> : <FiEyeOff />}
        </button>
      </div>

      <p className={`input-error-text ${error ? "show" : ""}`}>
        {error || "\u00A0"}
      </p>
    </div>
  );
}

export default PasswordInput;