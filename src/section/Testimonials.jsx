import React, { useRef, useEffect, useState } from "react";
import "./Testimonials.css";
import { useLanguage } from "../context/LanguageContext";
import ParticleBackground from "../components/ParticleBackground";
import { submitFeedback, getApprovedFeedbacks } from "../api/feedbacks.api";

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
  const { t: tFn } = useLanguage();
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
          {tFn("test_verified")}
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

function FeedbackForm() {
  const [rating, setRating]       = useState(0);
  const [hover, setHover]         = useState(0);
  const [name, setName]           = useState("");
  const [text, setText]           = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const active = hover || rating;
  const logFeedbackDebug = (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        customer_name: name.trim() || "Anonymous",
        stars: Number(rating),
        message: text.trim(),
      };
      logFeedbackDebug("FEEDBACK_SUBMIT_PAYLOAD", payload);
      await submitFeedback(payload);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setHover(0);
        setName("");
        setText("");
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="ts-feedback ts-feedback--success">
        <div className="ts-feedback__success-icon">✓</div>
        <p className="ts-feedback__success-title">Thank you for your review!</p>
        <p className="ts-feedback__success-sub">Your feedback is pending admin approval.</p>
      </div>
    );
  }

  return (
    <form className="ts-feedback" onSubmit={handleSubmit}>
      <div className="ts-feedback__head">
        <h3 className="ts-feedback__title">Share Your Experience</h3>
        <p className="ts-feedback__sub">How was your experience with us?</p>
      </div>

      <div className="ts-feedback__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`ts-feedback__star ${active >= star ? "ts-feedback__star--on" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="ts-feedback__rating-label">
            {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
          </span>
        )}
      </div>

      <input
        className="ts-feedback__input"
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
      />

      <textarea
        className="ts-feedback__textarea"
        placeholder="Tell us about your experience..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={400}
      />

      <div className="ts-feedback__footer">
        <span className="ts-feedback__chars">{text.length}/400</span>
        <button
          type="submit"
          className="ts-feedback__submit"
          disabled={submitting || rating === 0 || !text.trim()}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
      {error && <p className="ts-feedback__error">{error}</p>}
    </form>
  );
}

function mapFeedbackToCard(f) {
  const name = f.customer_name || "Anonymous";
  return {
    name,
    car: [f.car_brand, f.car_model].filter(Boolean).join(" ") || "General feedback",
    text: f.message,
    rating: Number(f.rating) || 5,
    initials: name.slice(0, 2).toUpperCase(),
  };
}

export default function Testimonials() {
  const { t } = useLanguage();
  const [titleVisible, setTitleVisible] = useState(false);
  const [approvedCards, setApprovedCards] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setTitleVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getApprovedFeedbacks()
      .then((res) => {
        const list = res?.data?.feedbacks ?? res?.data ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setApprovedCards(list.map(mapFeedbackToCard));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="ts-section">
      <ParticleBackground />
      <div className="sec-blob sec-blob--lg sec-blob--tc sec-blob--warm" />
      <div className="sec-blob sec-blob--md sec-blob--br" />
      <div className="sec-blob sec-blob--sm sec-blob--ml" />
      <div className="sec-noise" />

      <h2 className={`ts-title ${titleVisible ? "visible" : ""}`}>
        {t("test_title1")}
        <span className="ts-title-sub">{t("test_title2")}</span>
      </h2>

      <p className={`ts-subtitle ${titleVisible ? "visible" : ""}`}>
        {t("test_sub")}
      </p>

      <div className="ts-grid">
        {(approvedCards.length > 0 ? approvedCards : data).map((item, i) => (
          <TestimonialCard key={i} t={item} index={i} />
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

      <FeedbackForm />

      <p className="ts-footer">
        <span className="ts-footer-line" />
        {t("test_footer")}
        <span className="ts-footer-line right" />
      </p>
    </section>
  );
}
