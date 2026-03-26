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

      <div className="password-wrapper">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`auth-input password-input ${
            error ? "input-error" : ""
          }`}
        />

        <button
          type="button"
          className="eye-button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEye /> : <FiEyeOff />}
        </button>
      </div>

      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}

export default PasswordInput;