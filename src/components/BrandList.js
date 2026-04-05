import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BrandList.css";

const brands = [
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

const PER_SLIDE = 4;

export default function BrandList() {
  const navigate = useNavigate();

  const slides = [];
  for (let i = 0; i < brands.length; i += PER_SLIDE) {
    slides.push(brands.slice(i, i + PER_SLIDE));
  }

  const [current, setCurrent] = useState(0);
  const sliderRef  = useRef(null);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef(null);

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));

  // Non-passive wheel — fixes the console error
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      wheelAccum.current += e.deltaX;
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        if      (wheelAccum.current >  40) setCurrent((c) => Math.min(c + 1, slides.length - 1));
        else if (wheelAccum.current < -40) setCurrent((c) => Math.max(c - 1, 0));
        wheelAccum.current = 0;
      }, 50);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [slides.length]);

  // Touch swipe
  const touchX = useRef(0);
  const touchY = useRef(0);
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    const dx = touchX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) dx > 0 ? next() : prev();
  };

  // Mouse drag
  const mouseX   = useRef(0);
  const isDrag   = useRef(false);
  const onMouseDown  = (e) => { mouseX.current = e.clientX; isDrag.current = true; };
  const onMouseUp    = (e) => {
    if (!isDrag.current) return;
    isDrag.current = false;
    const dx = mouseX.current - e.clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };
  const onMouseLeave = () => { isDrag.current = false; };

  // 3D tilt
  const onCardMove = (e, el) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    el.style.transform = `perspective(500px) rotateX(${(y - 0.5) * 12}deg) rotateY(${(x - 0.5) * -12}deg) scale(1.04)`;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onCardLeave = (el) => { el.style.transform = ""; };

  // Particles
  const spawnParticles = (el) => {
    for (let i = 0; i < 4; i++) {
      const p = document.createElement("div");
      p.className = "bl-particle";
      const sz = Math.random() * 3 + 2;
      const x  = Math.random() * 70 + 15;
      const d  = Math.random() * 0.2;
      p.style.cssText = `width:${sz}px;height:${sz}px;left:${x}%;bottom:6px;animation:blFloatUp ${0.5 + Math.random() * 0.4}s ${d}s ease-out forwards`;
      el.appendChild(p);
      setTimeout(() => p.remove(), (1 + d) * 1000);
    }
  };

  // Ripple
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
    // Short delay so ripple is visible before navigation
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

      <div className="bl-slider">
        <button
          className="bl-arrow"
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous"
        >
          ‹
        </button>

        <div
          ref={sliderRef}
          className="bl-wrapper"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          style={{ touchAction: "pan-y" }}
        >
          <div
            className="bl-track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((group, pi) => (
              <div className="bl-slide" key={pi}>
                {group.map((brand, i) => (
                  <div
                    key={brand.slug}
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
            ))}
          </div>
        </div>

        <button
          className="bl-arrow"
          onClick={next}
          disabled={current === slides.length - 1}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <div className="bl-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`bl-dot${current === i ? " bl-dot--active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

    </section>
  );
}