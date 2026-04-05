import React, { useRef, useEffect, useState } from "react";

const data = [
  {
    name: "Steven",
    car: "Honda Civic",
    text: "The service was excellent. The car was exactly as described and the rental process was very smooth.",
    rating: 5,
    initials: "ST",
    accent: "#e11d2e"
  },
  {
    name: "John",
    car: "Toyota Yaris",
    text: "Smooth rental process and easy communication with the team. Will definitely be coming back.",
    rating: 5,
    initials: "JN",
    accent: "#ff3347"
  },
  {
    name: "Megan",
    car: "MG",
    text: "Rental prices are reasonable here. The pickup and return were super easy. Highly recommended!",
    rating: 5,
    initials: "MG",
    accent: "#c41525"
  }
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

    // move glow
    if (glowRef.current) {
      glowRef.current.style.left = `${x}px`;
      glowRef.current.style.top = `${y}px`;
    }
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    // spawn sparkles
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 0.3
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
      {/* Glow cursor tracker */}
      <div ref={glowRef} className="ts-cursor-glow" />

      {/* Shimmer sweep on hover */}
      <div className={`ts-shimmer ${isHovered ? "ts-shimmer-active" : ""}`} />

      {/* Corner accent */}
      <div className="ts-corner-tl" />
      <div className="ts-corner-br" />

      {/* Sparkles */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="ts-sparkle"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}

      <span className="ts-quote">&ldquo;</span>

      {/* Left column */}
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

      {/* Body */}
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@700;900&display=swap');

        :root {
          --red: #e11d2e;
          --red-dim: rgba(225,29,46,0.15);
          --red-glow: rgba(225,29,46,0.5);
          --bg: #090909;
          --card-bg: #111111;
          --card-border: #222;
          --text-primary: #f5f5f5;
          --text-secondary: #777;
          --text-muted: #444;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ts-section {
          background: var(--bg);
          padding: 72px 24px 60px;
          font-family: 'Barlow', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Ambient background glow */
        .ts-section::before {
          content: '';
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 380px;
          background: radial-gradient(ellipse, rgba(225,29,46,0.13) 0%, transparent 68%);
          pointer-events: none;
          animation: ambientPulse 5s ease-in-out infinite;
        }

        /* Subtle noise grain overlay */
        .ts-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
          z-index: 0;
        }

        @keyframes ambientPulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.15); }
        }

        /* Grid lines decoration */
        .ts-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .ts-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 42px;
          line-height: 1;
          color: #fff;
          text-align: center;
          margin-bottom: 10px;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .ts-title.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ts-title-sub {
          color: var(--red);
          display: block;
          text-shadow:
            0 0 20px rgba(225,29,46,0.7),
            0 0 60px rgba(225,29,46,0.25);
          position: relative;
        }

        /* Underline stroke under red text */
        .ts-title-sub::after {
          content: '';
          display: block;
          height: 3px;
          width: 60px;
          background: linear-gradient(90deg, var(--red), transparent);
          margin: 6px auto 0;
          border-radius: 2px;
        }

        .ts-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 36px;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }

        .ts-subtitle.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ts-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          max-width: 430px;
          position: relative;
          z-index: 2;
        }

        /* ─── CARD ─── */
        .ts-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 20px 20px 18px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform 0.18s cubic-bezier(0.23,1,0.32,1),
            box-shadow 0.18s ease,
            border-color 0.25s ease,
            opacity 0.6s ease,
            translate 0.6s ease;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .ts-card:hover {
          border-color: rgba(225,29,46,0.45);
          box-shadow:
            0 0 0 1px rgba(225,29,46,0.18),
            0 20px 50px rgba(0,0,0,0.7),
            0 0 60px rgba(225,29,46,0.1);
        }

        /* Cursor glow blob */
        .ts-cursor-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(225,29,46,0.14) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .ts-card:hover .ts-cursor-glow {
          opacity: 1;
        }

        /* Shimmer sweep */
        .ts-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255,255,255,0.04) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          transition: none;
          pointer-events: none;
          z-index: 1;
          border-radius: 20px;
        }

        .ts-shimmer-active {
          animation: shimmerSweep 0.55s ease forwards;
        }

        @keyframes shimmerSweep {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }

        /* Corner accents */
        .ts-corner-tl,
        .ts-corner-br {
          position: absolute;
          width: 18px;
          height: 18px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 3;
        }

        .ts-corner-tl {
          top: 10px; left: 10px;
          border-top: 2px solid var(--red);
          border-left: 2px solid var(--red);
          border-radius: 4px 0 0 0;
        }

        .ts-corner-br {
          bottom: 10px; right: 10px;
          border-bottom: 2px solid var(--red);
          border-right: 2px solid var(--red);
          border-radius: 0 0 4px 0;
        }

        .ts-card:hover .ts-corner-tl,
        .ts-card:hover .ts-corner-br {
          opacity: 1;
        }

        /* Sparkles */
        .ts-sparkle {
          position: absolute;
          background: var(--red);
          border-radius: 50%;
          pointer-events: none;
          z-index: 4;
          animation: sparklePop 0.7s ease forwards;
        }

        @keyframes sparklePop {
          0% { opacity: 1; transform: scale(0) translateY(0); }
          60% { opacity: 0.8; transform: scale(1.5) translateY(-8px); }
          100% { opacity: 0; transform: scale(0.5) translateY(-16px); }
        }

        /* Quote mark */
        .ts-quote {
          position: absolute;
          top: 10px; right: 14px;
          font-size: 60px;
          line-height: 1;
          color: rgba(225,29,46,0.06);
          font-family: Georgia, serif;
          pointer-events: none;
          user-select: none;
          z-index: 0;
          transition: color 0.3s ease;
        }

        .ts-card:hover .ts-quote {
          color: rgba(225,29,46,0.1);
        }

        /* ─── LEFT COLUMN ─── */
        .ts-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }

        .ts-avatar {
          width: 50px; height: 50px;
          border-radius: 50%;
          background: linear-gradient(145deg, #1e1e1e, #2c2c2c);
          border: 2px solid #2e2e2e;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .ts-avatar-glow {
          border-color: rgba(225,29,46,0.5) !important;
          box-shadow: 0 0 16px rgba(225,29,46,0.35) !important;
        }

        /* Spinning ring */
        .ts-avatar-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px dashed transparent;
          transition: border-color 0.3s ease;
          animation: none;
        }

        .ts-avatar-glow .ts-avatar-ring {
          border-color: rgba(225,29,46,0.3);
          animation: spinRing 4s linear infinite;
        }

        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ts-initials {
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.5px;
          font-family: 'Barlow Condensed', sans-serif;
          position: relative;
          z-index: 1;
        }

        .ts-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(225,29,46,0.12);
          border: 1px solid rgba(225,29,46,0.2);
          color: var(--red);
          font-size: 7.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 7px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .ts-badge-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 4px var(--red);
          animation: badgePulse 1.8s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ─── BODY ─── */
        .ts-body {
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .ts-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .ts-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.2px;
        }

        .ts-car {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ts-car-icon {
          font-size: 9px;
          color: var(--red);
          opacity: 0.7;
        }

        .ts-stars {
          color: var(--red);
          font-size: 12px;
          letter-spacing: 2px;
          line-height: 1;
          filter: drop-shadow(0 0 5px rgba(225,29,46,0.7));
        }

        .ts-divider {
          height: 1px;
          background: #1e1e1e;
          margin-bottom: 10px;
          overflow: hidden;
          border-radius: 1px;
        }

        .ts-divider-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, var(--red), rgba(225,29,46,0.1));
          transition: width 0.5s ease;
        }

        .ts-card:hover .ts-divider-fill {
          width: 100%;
        }

        .ts-text {
          font-size: 12px;
          line-height: 1.65;
          color: #6e6e6e;
          font-weight: 400;
          transition: color 0.3s ease;
        }

        .ts-card:hover .ts-text {
          color: #888;
        }

        /* ─── DOTS ─── */
        .ts-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 26px;
          position: relative;
          z-index: 2;
        }

        .ts-dot {
          height: 5px;
          border-radius: 3px;
          background: #222;
          transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
          cursor: pointer;
        }

        .ts-dot.active {
          background: var(--red);
          width: 20px !important;
          box-shadow: 0 0 10px rgba(225,29,46,0.7), 0 0 20px rgba(225,29,46,0.3);
        }

        /* ─── FOOTER ─── */
        .ts-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 11px;
          color: #363636;
          max-width: 290px;
          line-height: 1.7;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ts-footer-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(225,29,46,0.2));
        }

        .ts-footer-line.right {
          background: linear-gradient(90deg, rgba(225,29,46,0.2), transparent);
        }

        /* delay each card's animation */
        .ts-card-0 { transition-delay: 0.05s; }
        .ts-card-1 { transition-delay: 0.15s; }
        .ts-card-2 { transition-delay: 0.25s; }

        @media (max-width: 480px) {
          .ts-grid { max-width: 100%; }
          .ts-title { font-size: 34px; }
        }
      `}</style>

      <section className="ts-section">
        <div className="ts-grid-lines" />

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
          {[0, 1, 2].map(i => (
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
    </>
  );
}