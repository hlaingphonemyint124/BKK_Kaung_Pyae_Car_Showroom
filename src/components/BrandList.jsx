import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./BrandList.css";

// ✅ FIXED: use brands.api.js instead of raw fetch()
import { getAllBrands } from "../api/brands.api";

// ─── Fallback static brands ───────────────────────────────────────────────────
const FALLBACK_BRANDS = [
  { name: "Suzuki",      logo: "/images/Brands/suzuki.png",      slug: "suzuki"      },
  { name: "Toyota",      logo: "/images/Brands/toyota.png",      slug: "toyota"      },
  { name: "BMW",         logo: "/images/Brands/bmw.png",         slug: "bmw"         },
  { name: "Honda",       logo: "/images/Brands/honda.png",       slug: "honda"       },
  { name: "Mercedes",    logo: "/images/Brands/mercedes.png",    slug: "mercedes"    },
  { name: "Ford",        logo: "/images/Brands/ford.png",        slug: "ford"        },
  { name: "Nissan",      logo: "/images/Brands/nissan.png",      slug: "nissan"      },
  { name: "Audi",        logo: "/images/Brands/audi.png",        slug: "audi"        },
  { name: "Ferrari",     logo: "/images/Brands/ferrari.png",     slug: "ferrari"     },
  { name: "Hyundai",     logo: "/images/Brands/hyundai.png",     slug: "hyundai"     },
  { name: "Kia",         logo: "/images/Brands/kia.png",         slug: "kia"         },
  { name: "Lamborghini", logo: "/images/Brands/lamborghini.png", slug: "lamborghini" },
  { name: "Mazda",       logo: "/images/Brands/mazda.png",       slug: "mazda"       },
  { name: "Tesla",       logo: "/images/Brands/tesla.png",       slug: "tesla"       },
  { name: "Porsche",     logo: "/images/Brands/porsche.png",     slug: "porsche"     },
  { name: "Mitsubishi",  logo: "/images/Brands/mitsubishi.png",  slug: "mitsubishi"  },
];

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

  const [brands, setBrands]   = useState(FALLBACK_BRANDS);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: getAllBrands() from brands.api.js — handles both { data: [...] } and { data: { data: [...] } }
  useEffect(() => {
    getAllBrands()
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (Array.isArray(data) && data.length > 0) setBrands(data);
      })
      .catch(() => {
        console.warn("Brands API unavailable — using static fallback.");
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollLeft  = () => rowRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  const scrollRight = () => rowRef.current?.scrollBy({ left:  SCROLL_AMOUNT, behavior: "smooth" });

  /* ── 3-D tilt ── */
  const onCardMove = (e, el) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    el.style.transform = `perspective(500px) rotateX(${(y - 0.5) * 12}deg) rotateY(${(x - 0.5) * -12}deg) scale(1.04)`;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onCardLeave = (el) => { el.style.transform = ""; };

  /* ── Particles ── */
  const spawnParticles = (el) => {
    for (let i = 0; i < 4; i++) {
      const p  = document.createElement("div");
      p.className = "bl-particle";
      const sz = Math.random() * 3 + 2;
      const x  = Math.random() * 70 + 15;
      const d  = Math.random() * 0.2;
      p.style.cssText = `width:${sz}px;height:${sz}px;left:${x}%;bottom:6px;animation:blFloatUp ${0.5 + Math.random() * 0.4}s ${d}s ease-out forwards`;
      el.appendChild(p);
      setTimeout(() => p.remove(), (1 + d) * 1000);
    }
  };

  /* ── Ripple ── */
  const spawnRipple = (e, el) => {
    const r   = el.getBoundingClientRect();
    const rip = document.createElement("div");
    const sz  = Math.max(el.offsetWidth, el.offsetHeight) * 2.5;
    rip.className = "bl-ripple";
    rip.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px`;
    el.appendChild(rip);
    setTimeout(() => rip.remove(), 560);
  };

  const handleCardClick = (e, brand) => {
    spawnRipple(e, e.currentTarget);
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
                onMouseMove={(e) => onCardMove(e, e.currentTarget)}
                onMouseEnter={(e) => spawnParticles(e.currentTarget)}
                onMouseLeave={(e) => onCardLeave(e.currentTarget)}
                role="button"
                tabIndex={0}
                aria-label={`Browse ${brand.name} cars`}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/brands/${brand.slug}`)}
              >
                <div className="bl-logo">
                  <img src={brand.logo} alt={brand.name} draggable={false} />
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