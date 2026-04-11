import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import { resetPassword } from "../services/authService";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!token) {
      newErrors.token = "Invalid or missing reset token";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const data = await resetPassword({
        token,
        new_password: password,
      });

      setSuccessMessage(
        data?.message || "Password reset successfully. Redirecting to login..."
      );

      setPassword("");
      setConfirmPassword("");
      setErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthHeader>
      <div className="auth-body">
        <form onSubmit={handleSubmit}>
          <PasswordInput
            label="New Password"
            name="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <AuthButton
            text={loading ? "Resetting..." : "Reset Password"}
            type="submit"
            disabled={loading}
          />

          {errors.token && (
            <p className="auth-submit-message error-message">{errors.token}</p>
          )}

          {serverError && (
            <p className="auth-submit-message error-message">{serverError}</p>
          )}

          {successMessage && (
            <p className="auth-submit-message success-message">
              {successMessage}
            </p>
          )}
        </form>

        <div className="auth-link-bottom">
          Back to <Link to="/login">Log In</Link>
        </div>
      </div>
    </AuthHeader>
  );
}

export default ResetPasswordPage;