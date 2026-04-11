import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import { verifyEmail } from "../services/authService";
import "../styles/AuthStyles.css";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");
    let redirectTimer;

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyUserEmail = async () => {
      try {
        const response = await verifyEmail(token);

        setStatus("success");
        setMessage(
          response?.message || "Email verified successfully. Redirecting to login..."
        );

        redirectTimer = setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Verification failed or the link has expired."
        );
      }
    };

    verifyUserEmail();

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [searchParams, navigate]);

  return (
    <AuthHeader>
      <div className="auth-body">
        <div className="auth-form-status">
          <h2>Email Verification</h2>

          {status === "loading" && (
            <p className="auth-submit-message">Verifying your email...</p>
          )}

          {status === "success" && (
            <p className="auth-submit-message success-message">{message}</p>
          )}

          {status === "error" && (
            <>
              <p className="auth-submit-message error-message">{message}</p>
              <div className="auth-link-bottom">
                <Link to="/login">Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthHeader>
  );
}

export default VerifyEmailPage;