import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { forgotPassword } from "../services/authService";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Invalid email format");
      return;
    }

    try {
      setLoading(true);

      const data = await forgotPassword({
        email: email.trim(),
      });

      console.log("FORGOT RESPONSE:", data);

      setSuccessMessage(
        data?.message ||
          data?.msg ||
          "If this email exists, a reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send reset link. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthHeader>
      <div className="auth-body">
        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <AuthButton
            text={loading ? "Sending..." : "Send Reset Link"}
            type="submit"
            disabled={loading}
          />

          {error && (
            <p className="auth-submit-message error-message">{error}</p>
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

export default ForgotPasswordPage;