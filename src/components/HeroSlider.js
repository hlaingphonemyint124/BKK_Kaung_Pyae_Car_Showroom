import React, { useState, useEffect } from "react";
import "./HeroSlider.css";

export default function HeroSlider() {

  const slides = [
    {
      image: "/images/SlideShow/car1.jpg"
    },
    {
      image: "/images/SlideShow/car2.jpg"
    },
    {
      image: "/images/SlideShow/car3.jpg"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);

  }, []);

  return (
    <section className="hero">

      <img
        src={slides[current].image}
        alt="car"
        className="hero-image"
      />

      <div className="hero-overlay">

        <h1>
          <span>Premium cars</span><br/>
          for rent and ownership
        </h1>

        <button className="hero-btn">
          Browse Cars →
        </button>

      </div>

      <div className="hero-dots">

        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          />
        ))}

      </div>

    </section>
  );
}