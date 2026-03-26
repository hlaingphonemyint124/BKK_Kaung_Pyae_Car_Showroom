import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = "";

    if (name === "username") {
      if (!value.trim()) error = "Username is required";
      else if (value.length < 3)
        error = "Username must be at least 3 characters";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!emailRegex.test(value))
        error = "Invalid email format";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6)
        error = "Password must be at least 6 characters";
    }

    if (name === "confirmPassword") {
      if (!value) error = "Please confirm your password";
      else if (value !== form.password)
        error = "Passwords do not match";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // real-time validation
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    setTimeout(() => {
      console.log(form);
      setLoading(false);
      alert("Signup successful (fake)");
    }, 1000);
  };

  return (
    <AuthHeader>
      <div className="auth-body">
        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Username"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />

          <AuthInput
            label="Email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <AuthButton
            text={loading ? "Creating..." : "Create Account"}
            type="submit"
          />
        </form>

        <div className="auth-link-bottom">
          Already have an Account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </AuthHeader>
  );
}

export default SignupPage;