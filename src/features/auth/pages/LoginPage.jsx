import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import { loginUser, getCurrentUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!emailRegex.test(value)) error = "Invalid email format";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6)
        error = "Password must be at least 6 characters";
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (serverError) setServerError("");
  };

  // ✅ REAL LOGIN (will work when backend is running)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      await loginUser({
        email: form.email,
        password: form.password,
      });

      const currentUser = await getCurrentUser();
      console.log("Current user:", currentUser);

      const role = currentUser.role || currentUser.user?.role;

      if (role === "admin" || role === "employee") {
        navigate("/admin/buy");
      } else {
        navigate("/");
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ DEV BUTTON (temporary)
  const handleDevAdminLogin = () => {
    navigate("/admin/buy");
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

          {serverError && (
            <p style={{ color: "red", marginTop: "8px", marginBottom: "8px" }}>
              {serverError}
            </p>
          )}

          {/* 🔴 REAL LOGIN BUTTON */}
          <AuthButton
            text={loading ? "Logging In..." : "Log In"}
            type="submit"
            disabled={loading}
          />
        </form>

        {/* 🟡 DEV BUTTON */}
        <button
          type="button"
          onClick={handleDevAdminLogin}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          Enter Admin Demo
        </button>

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