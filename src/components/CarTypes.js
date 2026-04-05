import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsCarFront } from "react-icons/bs";
import { FaCarSide, FaTruckPickup, FaShuttleVan } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { MdElectricCar } from "react-icons/md";
import "./CarTypes.css";

const types = [
  { name: "Pickup",    icon: <FaTruckPickup />, slug: "pickup"    },
  { name: "SUV",       icon: <FaCarSide />,     slug: "suv"       },
  { name: "Van",       icon: <FaShuttleVan />,  slug: "van"       },
  { name: "Sedan",     icon: <GiCarDoor />,     slug: "sedan"     },
  { name: "Hatchback", icon: <BsCarFront />,    slug: "hatchback" },
  { name: "Electric",  icon: <MdElectricCar />, slug: "electric"  },
];

const PER_SLIDE = 4;

export default function CarTypes() {
  const navigate = useNavigate();

  const slides = [];
  for (let i = 0; i < types.length; i += PER_SLIDE) {
    slides.push(types.slice(i, i + PER_SLIDE));
  }

  const [current, setCurrent] = useState(0);
  const sliderRef  = useRef(null);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef(null);

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));

  // Non-passive wheel — fixes console error
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
  const mouseX  = useRef(0);
  const isDrag  = useRef(false);
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
      p.className = "ct-particle";
      const sz = Math.random() * 3 + 2;
      const x  = Math.random() * 70 + 15;
      const d  = Math.random() * 0.2;
      p.style.cssText = `width:${sz}px;height:${sz}px;left:${x}%;bottom:6px;animation:ctFloatUp ${0.5 + Math.random() * 0.4}s ${d}s ease-out forwards`;
      el.appendChild(p);
      setTimeout(() => p.remove(), (1 + d) * 1000);
    }
  };

  // Ripple
  const spawnRipple = (e, el) => {
    const r   = el.getBoundingClientRect();
    const rip = document.createElement("div");
    const sz  = Math.max(el.offsetWidth, el.offsetHeight) * 2.5;
    rip.className = "ct-ripple";
    rip.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px`;
    el.appendChild(rip);
    setTimeout(() => rip.remove(), 560);
  };

  const handleCardClick = (e, type) => {
    spawnRipple(e, e.currentTarget);
    setTimeout(() => navigate(`/types/${type.slug}`), 180);
  };

  return (
    <section className="ct-section">

      <div className="ct-header">
        <h3 className="ct-title">Browse by Car Type</h3>
        <button className="ct-viewall" onClick={() => navigate("/types")}>
          View all →
        </button>
      </div>

      <div className="ct-slider">
        <button
          className="ct-arrow"
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous"
        >
          ‹
        </button>

        <div
          ref={sliderRef}
          className="ct-wrapper"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          style={{ touchAction: "pan-y" }}
        >
          <div
            className="ct-track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((group, pi) => (
              <div className="ct-slide" key={pi}>
                {group.map((type, i) => (
                  <div
                    key={type.slug}
                    className="ct-card"
                    style={{ animationDelay: `${i * 0.07}s` }}
                    onClick={(e) => handleCardClick(e, type)}
                    onMouseMove={(e) => onCardMove(e, e.currentTarget)}
                    onMouseEnter={(e) => spawnParticles(e.currentTarget)}
                    onMouseLeave={(e) => onCardLeave(e.currentTarget)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Browse ${type.name} cars`}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`/types/${type.slug}`)}
                  >
                    <div className="ct-icon">{type.icon}</div>
                    <p className="ct-label">{type.name}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          className="ct-arrow"
          onClick={next}
          disabled={current === slides.length - 1}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <div className="ct-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`ct-dot${current === i ? " ct-dot--active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      <p className="ct-note">+100 cars are ready to be yours</p>
      <button className="ct-shopBtn" onClick={() => navigate("/shop")}>
        View on Shop →
      </button>

    </section>
  );
}