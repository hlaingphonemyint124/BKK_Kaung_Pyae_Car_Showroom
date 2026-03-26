import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // validate each field
  const validateField = (name, value) => {
    let error = "";

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

    return error;
  };

  // handle typing
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

  // handle submit
  const handleLogin = (e) => {
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
      alert("Login successful (fake)");
    }, 1000);
  };

  return (
    <AuthHeader>
      <div className="auth-body">
        <form onSubmit={handleLogin}>
          <AuthInput
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <AuthButton
            text={loading ? "Logging In..." : "Log In"}
            type="submit"
            disabled={loading}
          />
        </form>

        <div className="auth-link-center">
          Forgot password? <Link to="/">Click Here</Link>
        </div>

        <div className="auth-link-bottom">
          Don’t have an Account? <Link to="/signup">Sign Up Here</Link>
        </div>
      </div>
    </AuthHeader>
  );
}

export default LoginPage;