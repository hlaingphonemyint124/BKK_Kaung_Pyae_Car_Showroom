import React, { useRef } from "react";
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

const SCROLL_AMOUNT = 280;

/* ✅ SAME NAV ARROW AS BRANDLIST */
function NavArrow({ dir, onClick }) {
  return (
    <button
      className={`ct-arrow ct-arrow--${dir}`}
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      <span className="ct-nav-glow" />
      <span className="ct-nav-ring" />

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === "prev"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </button>
  );
}

export default function CarTypes() {
  const navigate = useNavigate();
  const rowRef   = useRef(null);

  const scrollLeft  = () => rowRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  const scrollRight = () => rowRef.current?.scrollBy({ left:  SCROLL_AMOUNT, behavior: "smooth" });

  /* 3D tilt */
  const onCardMove = (e, el) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    el.style.transform = `perspective(500px) rotateX(${(y - 0.5) * 12}deg) rotateY(${(x - 0.5) * -12}deg) scale(1.04)`;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onCardLeave = (el) => { el.style.transform = ""; };

  /* particles */
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

  /* ripple */
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

      <div className="ct-wrapper">
        <NavArrow dir="prev" onClick={scrollLeft} />

        <div className="ct-row" ref={rowRef}>
          {types.map((type, i) => (
            <div
              key={type.slug}
              className="ct-card"
              style={{ animationDelay: `${i * 0.07}s` }}
              onClick={(e) => handleCardClick(e, type)}
              onMouseMove={(e) => onCardMove(e, e.currentTarget)}
              onMouseEnter={(e) => spawnParticles(e.currentTarget)}
              onMouseLeave={(e) => onCardLeave(e.currentTarget)}
            >
              <div className="ct-icon">{type.icon}</div>
              <p className="ct-label">{type.name}</p>
            </div>
          ))}
        </div>

        <NavArrow dir="next" onClick={scrollRight} />
      </div>

      <p className="ct-note">+100 cars are ready to be yours</p>

      <button className="ct-shopBtn" onClick={() => navigate("/shop")}>
        View on Shop →
      </button>

    </section>
  );
}