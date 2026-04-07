import React, { useState, useEffect } from "react";
import "./Hero.css";

export default function Hero() {
  const slides = [
    process.env.PUBLIC_URL + "/images/SlideShow/ss1.jpg",
    process.env.PUBLIC_URL + "/images/SlideShow/ss2.jpg",
    process.env.PUBLIC_URL + "/images/SlideShow/ss3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="hero__slider">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt="Car slide"
            className={`hero__bg ${index === current ? "active" : ""}`}
          />
        ))}
      </div>

      <div className="hero__overlay"></div>

      <div className="hero__container">
        <div className="hero__left">
          <p className="hero__eyebrow">Premium cars</p>
          <h1 className="hero__title">For rent and ownership</h1>
          <div className="hero__actions">
            <a className="btn btn--primary" href="/shop">
              Browse Cars →
            </a>
          </div>
        </div>
      </div>

      <div className="hero__bottom">
        <div className="hero__scroll-indicator">
          <span className="hero__scroll-label">Scroll</span>
          <div className="hero__scroll-line">
            <div className="hero__scroll-thumb"></div>
          </div>
          <div className="hero__scroll-chevrons">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="hero__dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`hero__dot ${index === current ? "hero__dot--active" : ""}`}
              onClick={() => setCurrent(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}