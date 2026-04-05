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
      else if (value.length < 6) error = "Password must be at least 6 characters";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setServerError("");

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError("");

    try {
      const cleanForm = {
        email: form.email.trim(),
        password: form.password.trim(),
      };

      await loginUser(cleanForm);

      const currentUser = await getCurrentUser();
      console.log("CURRENT USER:", currentUser);

      const role = currentUser?.user?.role || currentUser?.role;
      console.log("ROLE:", role);

      if (role === "admin" || role === "employee") {
        navigate("/admin/buy");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log("RESPONSE DATA:", error.response?.data);
      console.log("STATUS:", error.response?.status);

      setServerError(
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthHeader>
      <div className="auth-body">
        <form onSubmit={handleLogin}>
          <AuthInput
            label="Email"
            name="email"
            type="email"
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

          {serverError && <p className="input-error-text">{serverError}</p>}

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