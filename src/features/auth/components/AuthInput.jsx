import React from "react";
import "../styles/AuthStyles.css";

function AuthInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  onBlur,
}) {
  return (
    <div className="auth-input-group">
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
        className={`auth-input ${error ? "input-error" : ""}`}
      />

      <p className={`input-error-text ${error ? "show" : ""}`}>
        {error || "\u00A0"}
      </p>
    </div>
  );
}

export default AuthInput;