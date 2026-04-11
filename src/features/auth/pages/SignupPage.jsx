import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import { signupUser } from "../services/authService";

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = "";

    if (name === "username") {
      if (!value.trim()) error = "Username is required";
      else if (value.trim().length < 3) {
        error = "Username must be at least 3 characters";
      }
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    if (name === "confirmPassword") {
      if (!value) error = "Please confirm your password";
      else if (value !== form.password) {
        error = "Passwords do not match";
      }
    }

    if (name === "acceptedTerms") {
      if (!value) error = "You must agree to the Terms and Conditions";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, fieldValue),
      ...(name === "password"
        ? {
            confirmPassword:
              form.confirmPassword && form.confirmPassword !== fieldValue
                ? "Passwords do not match"
                : "",
          }
        : {}),
    }));

    setServerError("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      setServerError("");
      setSuccessMessage("");

      const payload = {
        full_name: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      const data = await signupUser(payload);

      setSuccessMessage(
        data?.message || "Account created successfully. Please verify your email."
      );

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptedTerms: false,
      });

      setErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Signup failed. Please try again.";

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <AuthHeader>
      <div className="auth-body">
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignup}
          >
            <div className="google-icon">G</div>
            Sign up with Google
          </button>

          <div className="auth-or">Or</div>

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
            type="email"
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

          <div className="remember-row">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
            />
            <span>I agree to the Terms and Conditions</span>
          </div>

          {errors.acceptedTerms && (
            <p className="input-error-text terms-error">{errors.acceptedTerms}</p>
          )}

          <AuthButton
            text={loading ? "Creating..." : "Create Account"}
            type="submit"
            disabled={loading}
          />

          {serverError && (
            <p className="auth-submit-message error-message">{serverError}</p>
          )}

          {successMessage && (
            <p className="auth-submit-message success-message">{successMessage}</p>
          )}

          <div className="auth-policy-text">
            Signing up for this website means you agree to the{" "}
            <Link to="/privacy-policy">Privacy Policy</Link> and{" "}
            <Link to="/terms-and-conditions">Terms and Conditions</Link>.
          </div>
        </form>

        <div className="auth-link-bottom">
          Already have an Account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </AuthHeader>
  );
}

export default SignupPage;