import React from "react";
import "./EasyRental.css";

export default function EasyRental() {
  return (
    <section className="easyRentalSection">

      <div className="easyRentalHeader">
        <h2>Easy Car Rental</h2>
        <p>Rent a car in just a few simple steps</p>
      </div>

      <div className="easyCard">

        <div className="stepsRow">

          <div className="stepsGroup">

            <div className="stepBox active">
              <span>Step</span>
              <strong>1</strong>
            </div>

            <div className="stepBox">
              <span>Step</span>
              <strong>2</strong>
            </div>

            <div className="stepBox">
              <span>Step</span>
              <strong>3</strong>
            </div>

          </div>

          <button className="rentalBtn">
            Rental Cars →
          </button>

        </div>

        <div className="divider"></div>

        <div className="loginArea">

          <h4>Log In or Sign In Account</h4>

          <p>
            Create account with your Mobile phone number or email.
          </p>

          <button className="signupBtn">
            Click here to sign up
          </button>

          <div className="loginHint">
            If you already logged in, you can continue to next step.
          </div>

          <div className="nextStep">
            Next step →
          </div>

        </div>

      </div>

      <div className="easyFooter">
        • Insured &nbsp;&nbsp; • Verified &nbsp;&nbsp; • Ready to Go
      </div>

    </section>
  );
}