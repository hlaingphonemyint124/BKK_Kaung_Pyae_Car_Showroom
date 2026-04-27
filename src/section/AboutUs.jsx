import React, { useEffect, useRef } from "react";
import "./AboutUs.css";

export default function AboutUs({ theme = "dark" }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about--visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const section = sectionRef.current;
    if (section) observer.observe(section);
    return () => {
      if (section) observer.unobserve(section);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`about ${theme}`}>

      <div className="about-title-wrapper">
        <h2 className="about-title">
          <span className="about-title-white">About </span>
          <span className="about-title-red">Us</span>
        </h2>
        <div className="about-title-underline" />
      </div>

      <div className="about-block about-block--1">
        <h4 className="about-heading">Who We Are?</h4>
        <p>
          <strong>BKK Kaung Pyae</strong> is a premium car showroom and rental
          service built to deliver quality, trust, and convenience.
        </p>
        <p>
          We provide a wide range of well-maintained vehicles for both rental
          and ownership, designed to meet modern lifestyle and business needs.
        </p>
        <p>Our goal is simple: make every journey smooth, safe, and stress-free.</p>
      </div>

      <div className="about-block about-block--2">
        <h4 className="about-heading">What We Do?</h4>
        <ul className="about-list">
          <li>Car rental for daily, weekly, and long-term use</li>
          <li>Car sales with carefully selected models</li>
          <li>Premium vehicles maintenance to high standards</li>
          <li>Easy booking with transparent pricing</li>
        </ul>
        <p className="about-highlight">
          Whether you're renting or choosing your next car,
          we make the process simple and reliable.
        </p>
      </div>

      <div className="about-block about-block--3">
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