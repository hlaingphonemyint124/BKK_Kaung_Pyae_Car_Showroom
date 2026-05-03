import React, { useEffect, useRef } from "react";
import "./AboutUs.css";

const STATS = [
  { value: "5+",   label: "Years in Business" },
  { value: "200+", label: "Vehicles Sold & Rented" },
  { value: "1,000+", label: "Happy Customers" },
  { value: "3",    label: "Languages Supported" },
];

const VALUES = [
  {
    icon: "🛡",
    title: "Trust First",
    desc: "Every car is verified, inspected, and honestly described. No surprises.",
  },
  {
    icon: "✦",
    title: "Premium Quality",
    desc: "We handpick vehicles maintained to the highest standards.",
  },
  {
    icon: "⚡",
    title: "Simple & Fast",
    desc: "Transparent pricing, easy booking, zero hidden fees.",
  },
  {
    icon: "◎",
    title: "Customer First",
    desc: "Our team speaks your language and is available every day.",
  },
];

export default function AboutUs({ theme = "dark" }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("about--visible");
        });
      },
      { threshold: 0.08 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); observer.disconnect(); };
  }, []);

  return (
    <section ref={sectionRef} className={`about-section ${theme}`}>
      <div className="sec-blob sec-blob--lg sec-blob--tl" />
      <div className="sec-blob sec-blob--md sec-blob--mr" />
      <div className="sec-blob sec-blob--sm sec-blob--bc" />
      <div className="sec-noise" />

      <div className="about-inner">

        {/* Left column — copy */}
        <div className="about-left">
          <p className="sec-eyebrow">Our Story</p>
          <h2 className="about-heading">
            Premium cars,<br />
            <span>honest service.</span>
          </h2>
          <p className="about-body">
            <strong>BKK Kaung Pyae</strong> started with one belief — buying or renting a car
            should feel good, not stressful. We built a showroom in Bangkok where quality,
            transparency, and speed come standard.
          </p>
          <p className="about-body">
            Whether you need a car for a day or you're ready to own one, our team makes
            the process smooth, safe, and straightforward.
          </p>

          {/* Stats strip */}
          <div className="about-stats">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat__value">{s.value}</span>
                <span className="about-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — values */}
        <div className="about-right">
          <div className="about-values">
            {VALUES.map((v) => (
              <div key={v.title} className="about-value-card">
                <span className="about-value-card__icon">{v.icon}</span>
                <div>
                  <h4 className="about-value-card__title">{v.title}</h4>
                  <p className="about-value-card__desc">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
