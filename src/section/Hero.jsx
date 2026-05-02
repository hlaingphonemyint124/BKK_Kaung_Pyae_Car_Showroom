import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import { useLanguage } from "../context/LanguageContext";

const SLIDES = [
  process.env.PUBLIC_URL + "/images/SlideShow/ss1.jpg",
  process.env.PUBLIC_URL + "/images/SlideShow/ss2.jpg",
  process.env.PUBLIC_URL + "/images/SlideShow/ss3.jpeg",
];

export default function Hero() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero__slider">
        {SLIDES.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt={`Showroom slide ${index + 1}`}
            className={`hero__bg ${index === current ? "active" : ""}`}
          />
        ))}
      </div>

      <div className="hero__overlay"></div>

      <div className="hero__container">
        <div className="hero__left">
          <p className="hero__eyebrow">{t("hero_eyebrow")}</p>
          <h1 className="hero__title">{t("hero_title")}</h1>
          <div className="hero__actions">
            <Link className="btn-primary btn--lg" to="/showroom">
              {t("hero_browse")}
            </Link>
          </div>
        </div>
      </div>

      <div className="hero__bottom">
        <div className="hero__scroll-indicator">
          <span className="hero__scroll-label">{t("hero_scroll")}</span>
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
          {SLIDES.map((_, index) => (
            <span
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
              className={`hero__dot ${index === current ? "hero__dot--active" : ""}`}
              onClick={() => setCurrent(index)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setCurrent(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}