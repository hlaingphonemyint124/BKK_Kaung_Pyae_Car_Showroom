import React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <section className="about">

      <h2 className="about-title">About Us</h2>

      {/* WHO WE ARE */}
      <div className="about-block">
        <h4 className="about-heading">Who We Are?</h4>

        <p>
          <strong>BKK Kaung Pyae</strong> is a premium car showroom and rental
          service built to deliver quality, trust, and convenience.
        </p>

        <p>
          We provide a wide range of well-maintained vehicles for both rental
          and ownership, designed to meet modern lifestyle and business needs.
        </p>

        <p>
          Our goal is simple: make every journey smooth, safe, and stress-free.
        </p>
      </div>

      {/* WHAT WE DO */}
      <div className="about-block">
        <h4 className="about-heading">What We Do</h4>

        <ul className="about-list">
          <li>Car rental for daily, weekly, and long-term use</li>
          <li>Car sales with carefully selected models</li>
          <li>Flexible vehicle financing to help customers own their car</li>
          <li>Easy booking with transparent pricing</li>
        </ul>

        <p className="about-highlight">
          Whatever you're renting for or choosing your next car,
          we make the process simple and reliable.
        </p>
      </div>

      {/* VALUES */}
      <div className="about-block">
        <h4 className="about-heading">Our Values</h4>

        <div className="values">
          <div className="value-card">Trust</div>
          <div className="value-card">Quality</div>
          <div className="value-card">Simplicity</div>
          <div className="value-card">Customer First</div>
        </div>
      </div>

    </section>
  );
}