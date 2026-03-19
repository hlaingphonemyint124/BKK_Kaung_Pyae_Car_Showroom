import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import "../components/auth/AuthStyles.css";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !emailOrPhone || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log({
      username,
      emailOrPhone,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-book">
        <div className="auth-book-left">
          <div className="auth-brand-content">
            <h1>
              BKK <br className="desktop-break" />
              Kaung Pyae
            </h1>
            <p>Car showroom and Rental Service</p>
            <div className="auth-brand-line"></div>
          </div>
        </div>

        <div className="auth-book-right">
          <div className="auth-body">
            <button type="button" className="google-signin-btn">
              <span className="google-icon">G</span>
              Sign up with Google
            </button>

            <div className="auth-or">Or</div>

            <form onSubmit={handleSignup}>
              <AuthInput
                label="Username"
                placeholder="Enter Your Username Here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <AuthInput
                label="Email / Phone"
                placeholder="Enter Your Email or Phone Here"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter Your Password Here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter Your Password Here"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <AuthButton text="Create Account" type="submit" />
            </form>

            <div className="auth-policy-text">
              Agree to {" "}
              <Link to="/">Privacy Policy</Link> and{" "}
              <Link to="/">Terms & Conditions</Link>.
            </div>

            <div className="auth-link-bottom signup-login-link">
              Already have an Account? <Link to="/login">Log In Here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

