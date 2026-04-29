import React, { useRef, useEffect, useState } from "react";
import "./Testimonials.css";

const data = [
  {
    name: "Steven",
    car: "Honda Civic",
    text: "The service was excellent. The car was exactly as described and the rental process was very smooth.",
    rating: 5,
    initials: "ST",
  },
  {
    name: "John",
    car: "Toyota Yaris",
    text: "Smooth rental process and easy communication with the team. Will definitely be coming back.",
    rating: 5,
    initials: "JN",
  },
  {
    name: "Megan",
    car: "MG",
    text: "Rental prices are reasonable here. The pickup and return were super easy. Highly recommended!",
    rating: 5,
    initials: "MG",
  },
];

function TestimonialCard({ t, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 150 + 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 12;
    const rotX = -((y - cy) / cy) * 8;
    setTilt({ x: rotX, y: rotY });
    if (glowRef.current) {
      glowRef.current.style.left = `${x}px`;
      glowRef.current.style.top = `${y}px`;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 0.3,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 800);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardStyle = {
    transform: isHovered
      ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale(1.02)`
      : `perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`,
    opacity: visible ? 1 : 0,
    translate: visible ? "0 0" : "0 30px",
  };

  return (
    <div
      ref={cardRef}
      className={`ts-card ts-card-${index}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={glowRef} className="ts-cursor-glow" />
      <div className={`ts-shimmer ${isHovered ? "ts-shimmer-active" : ""}`} />
      <div className="ts-corner-tl" />
      <div className="ts-corner-br" />

      {sparkles.map((s) => (
        <div
          key={s.id}
          className="ts-sparkle"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      <span className="ts-quote">&ldquo;</span>

      <div className="ts-left">
        <div className={`ts-avatar ${isHovered ? "ts-avatar-glow" : ""}`}>
          <span className="ts-initials">{t.initials}</span>
          <div className="ts-avatar-ring" />
        </div>
        <div className="ts-badge">
          <span className="ts-badge-dot" />
          verified
        </div>
      </div>

      <div className="ts-body">
        <div className="ts-header">
          <div>
            <div className="ts-name">{t.name}</div>
            <div className="ts-car">
              <span className="ts-car-icon">⬡</span> {t.car}
            </div>
          </div>
          <div className="ts-stars">{"★".repeat(t.rating)}</div>
        </div>
        <div className="ts-divider">
          <div className="ts-divider-fill" />
        </div>
        <p className="ts-text">{t.text}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="ts-section">
      <h2 className={`ts-title ${titleVisible ? "visible" : ""}`}>
        What Our
        <span className="ts-title-sub">Customers Say</span>
      </h2>

      <p className={`ts-subtitle ${titleVisible ? "visible" : ""}`}>
        Real experiences · Real drivers
      </p>

      <div className="ts-grid">
        {data.map((t, i) => (
          <TestimonialCard key={i} t={t} index={i} />
        ))}
      </div>

      <div className="ts-dots">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`ts-dot ${i === 0 ? "active" : ""}`}
            style={{ width: i === 0 ? 20 : 5 }}
          />
        ))}
      </div>

      <p className="ts-footer">
        <span className="ts-footer-line" />
        Premium service built on trust, quality &amp; simplicity
        <span className="ts-footer-line right" />
      </p>
    </section>
  );
}
