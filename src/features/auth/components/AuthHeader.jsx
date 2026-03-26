import React from "react";
import "../styles/AuthStyles.css";

function AuthHeader({ children }) {
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
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthHeader;