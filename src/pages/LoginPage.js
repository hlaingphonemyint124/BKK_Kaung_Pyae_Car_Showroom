import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import "../components/auth/AuthStyles.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({
      username,
      password,
      rememberMe,
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
            <form onSubmit={handleLogin}>
              <AuthInput
                label="Username"
                placeholder="Enter Your Username Here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter Your Password Here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="remember-row">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>

              <AuthButton text="Log In" type="submit" />
            </form>

            <div className="auth-link-center">
              Forgot password? <Link to="/">Click Here</Link>
            </div>

            <div className="auth-link-bottom">
              Don’t have an Account? <Link to="/signup">Sign Up Here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;