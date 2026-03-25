import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AuthStyles.css";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

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
    <AuthHeader>
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
          Agree to <Link to="/">Privacy Policy</Link> and{" "}
          <Link to="/">Terms & Conditions</Link>.
        </div>

        <div className="auth-link-bottom signup-login-link">
          Already have an Account? <Link to="/login">Log In Here</Link>
        </div>
      </div>
    </AuthHeader>
  );
}

export default SignupPage;
