import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./BrandList.css";
import { applyCardTilt, resetCardTilt, spawnParticles, spawnRipple } from "../utils/cardEffects";

// ✅ FIXED: use brands.api.js instead of raw fetch()
import { getAllBrands } from "../api/brands.api";


const SCROLL_AMOUNT = 280;

/* ── Nav Arrow ── */
function NavArrow({ dir, onClick }) {
  return (
    <motion.button
      className={`bl-arrow bl-arrow--${dir}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      <span className="bl-nav-glow" />
      <span className="bl-nav-ring" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === "prev"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </motion.button>
  );
}

export default function BrandList() {
  const navigate = useNavigate();
  const rowRef   = useRef(null);

  const [brands, setBrands]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBrands()
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(() => {
        console.warn("Brands API unavailable.");
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollLeft  = () => rowRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  const scrollRight = () => rowRef.current?.scrollBy({ left:  SCROLL_AMOUNT, behavior: "smooth" });

  const handleCardClick = (e, brand) => {
    spawnRipple(e, e.currentTarget, "bl-ripple");
    setTimeout(() => navigate(`/brands/${brand.slug}`), 180);
  };

  return (
    <section className="bl-section">

      <div className="bl-header">
        <h2 className="bl-title">Brands</h2>
        <button className="bl-viewall" onClick={() => navigate("/brands")}>
          View all →
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", opacity: 0.5 }}>
          Loading brands...
        </div>
      )}

      {!loading && (
        <div className="bl-wrapper">
          <NavArrow dir="prev" onClick={scrollLeft} />

          <div className="bl-row" ref={rowRef}>
            {brands.map((brand, i) => (
              <div
                key={brand.slug || brand.id || i}
                className="bl-card"
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={(e) => handleCardClick(e, brand)}
                onMouseMove={(e) => applyCardTilt(e, e.currentTarget)}
                onMouseEnter={(e) => spawnParticles(e.currentTarget, "bl-particle", "blFloatUp")}
                onMouseLeave={(e) => resetCardTilt(e.currentTarget)}
                role="button"
                tabIndex={0}
                aria-label={`Browse ${brand.name} cars`}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/brands/${brand.slug}`)}
              >
                <div className="bl-logo">
                  <img
                    src={brand.logo || `/images/Brands/${brand.name.toLowerCase()}.png`}
                    alt={brand.name}
                    draggable={false}
                    onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
                  />
                </div>
                <p className="bl-label">{brand.name}</p>
              </div>
            ))}
          </div>

          <NavArrow dir="next" onClick={scrollRight} />
        </div>
      )}

    </section>
  );
}