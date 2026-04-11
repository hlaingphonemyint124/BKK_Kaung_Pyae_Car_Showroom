import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import {
  loginUser,
  getCurrentUser,
  resendVerification,
} from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!emailRegex.test(value.trim())) {
        error = "Invalid email format";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters";
      }
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
    setVerifyEmail("");
    setResendMessage("");
    setResendError(false);

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError("");
    setVerifyEmail("");
    setResendMessage("");
    setResendError(false);

    try {
      const cleanForm = {
        email: form.email.trim(),
        password: form.password,
      };

      const loginResponse = await loginUser(cleanForm);

      let role =
        loginResponse?.user?.role ||
        loginResponse?.role ||
        null;

      if (!role) {
        const currentUser = await getCurrentUser();
        role =
          currentUser?.user?.role ||
          currentUser?.role ||
          "customer";
      }

      if (role === "admin" || role === "employee") {
        navigate("/admin/buy");
      } else {
        navigate("/");
      }
    } catch (error) {
      const responseData = error.response?.data || {};
      const message =
        responseData.message ||
        responseData.error ||
        "Login failed. Please try again.";

      setServerError(message);

      if (
        error.response?.status === 403 &&
        responseData.email &&
        message.toLowerCase().includes("verify")
      ) {
        setVerifyEmail(responseData.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verifyEmail) return;

    try {
      setResendLoading(true);
      setResendMessage("");
      setResendError(false);

      const response = await resendVerification({ email: verifyEmail });

      setResendMessage(
        response?.message ||
          "Verification email sent. Please check your inbox or spam folder."
      );
    } catch (error) {
      setResendError(true);
      setResendMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to resend verification email."
      );
    } finally {
      setResendLoading(false);
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

          <AuthButton
            text={loading ? "Logging In..." : "Log In"}
            type="submit"
            disabled={loading}
          />

          {serverError && (
            <p className="auth-submit-message error-message">
              {serverError}
            </p>
          )}

          {verifyEmail && (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </button>
          )}

          {resendMessage && (
            <p
              className={`auth-submit-message ${
                resendError ? "error-message" : "success-message"
              }`}
            >
              {resendMessage}
            </p>
          )}
        </form>

        <div className="auth-link-center">
          Forgot password? <Link to="/forgot-password">Click Here</Link>
        </div>

        <div className="auth-link-bottom">
          Don’t have an Account? <Link to="/signup">Sign Up Here</Link>
        </div>
      </div>
    </AuthHeader>
  );
}

export default LoginPage;