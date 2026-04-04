import "./Deals.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

/* ── Animated price counter ───────────────────────────────────────────────── */
function AnimatedPrice({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10);
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = numeric / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numeric) { setDisplay(numeric); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{display.toLocaleString()} {suffix}</span>;
}

/* ── Particle canvas ──────────────────────────────────────────────────────── */
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "rgba(220,30,30,",
      "rgba(180,10,10,",
      "rgba(100,10,10,",
      "rgba(60,60,60,",
      "rgba(40,40,40,",
    ];

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      flicker: Math.random() * 0.02 + 0.005,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.flicker) * 0.008;
        p.alpha = Math.max(0.05, Math.min(0.65, p.alpha));
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ── Spec row ─────────────────────────────────────────────────────────────── */
function SpecRow({ icon, label, value }) {
  return (
    <div className="spec-row">
      <span className="spec-icon">{icon}</span>
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  );
}

/* ── Card — carousel effects via outer div, magnetic tilt via inner div ───── */
function CarCard({ car, index, tab, flippedIndex, onFlip }) {
  const outerRef   = useRef(null); // carousel scale/tilt/fade — JS controlled
  const innerRef   = useRef(null); // magnetic tilt — separate layer
  const isFlipped  = flippedIndex === index;

  /* Magnetic tilt — only on inner wrapper */
  const tiltX = useRef(0);
  const tiltY = useRef(0);
  const tiltAnimRef = useRef(null);

  const handleMouseMove = (e) => {
    if (isFlipped) return;
    const rect = innerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    tiltX.current = ((e.clientY - cy) / (rect.height / 2)) * -6;
    tiltY.current = ((e.clientX - cx) / (rect.width / 2)) * 6;
  };

  const handleMouseLeave = () => {
    tiltX.current = 0;
    tiltY.current = 0;
  };

  /* Smoothly animate tilt toward target using lerp */
  const currentTiltX = useRef(0);
  const currentTiltY = useRef(0);

  useEffect(() => {
    const animate = () => {
      currentTiltX.current += (tiltX.current - currentTiltX.current) * 0.1;
      currentTiltY.current += (tiltY.current - currentTiltY.current) * 0.1;
      if (innerRef.current) {
        innerRef.current.style.transform =
          `rotateX(${currentTiltX.current.toFixed(3)}deg) rotateY(${currentTiltY.current.toFixed(3)}deg)`;
      }
      tiltAnimRef.current = requestAnimationFrame(animate);
    };
    tiltAnimRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(tiltAnimRef.current);
  }, []);

  return (
    /* Outer: carousel position effects applied by SmoothSlider */
    <div
      ref={outerRef}
      className="car-card"
      data-card-index={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onFlip(index)}
    >
      {/* Inner: magnetic tilt only */}
      <div ref={innerRef} className="card-tilt-inner">
        <div className={`card-flipper ${isFlipped ? "flipped" : ""}`}>

          {/* FRONT */}
          <div className="card-face card-front">
            <div className="card-corner card-corner--tl" />
            <div className="card-corner card-corner--br" />
            <div className="spotlight" />
            <div className="card-img-wrap">
              <div className="card-img-glow" />
              <img src={car.image} alt={car.name} draggable={false} />
            </div>
            <div className="card-rule" />
            <div className="car-info">
              <h3>{car.name}</h3>
              <p><AnimatedPrice value={car.price} suffix={car.suffix} /></p>
            </div>
            <button className="rent-btn" onClick={(e) => e.stopPropagation()}>
              <span className="btn-label">Shop Now</span>
              <span className="btn-arrow">→</span>
            </button>
            <div className="flip-hint">Tap to see specs ↺</div>
          </div>

          {/* BACK */}
          <div className="card-face card-back">
            <div className="card-corner card-corner--tl" />
            <div className="card-corner card-corner--br" />
            <div className="back-header">
              <h3 className="back-title">{car.name}</h3>
              <span className="back-badge">Specs</span>
            </div>
            <div className="specs-list">
              <SpecRow icon="📅" label="Year"         value={car.specs.year} />
              <SpecRow icon="⚙️" label="Engine"       value={car.specs.engine} />
              <SpecRow icon="🛣️" label="Mileage"      value={car.specs.mileage} />
              <SpecRow icon="⛽" label="Fuel"         value={car.specs.fuel} />
              <SpecRow icon="🔧" label="Transmission" value={car.specs.transmission} />
              <SpecRow icon="🎨" label="Color"        value={car.specs.color} />
            </div>
            <button className="rent-btn back-btn" onClick={(e) => e.stopPropagation()}>
              <span className="btn-label">Shop Now</span>
              <span className="btn-arrow">→</span>
            </button>
            <div className="flip-hint">Tap to go back ↺</div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Physics slider ───────────────────────────────────────────────────────── */
function SmoothSlider({ children, paused }) {
  const sliderRef      = useRef(null);
  const trackRef       = useRef(null);
  const velRef         = useRef(0);
  const posRef         = useRef(0);
  const isDragging     = useRef(false);
  const startX         = useRef(0);
  const startScroll    = useRef(0);
  const lastX          = useRef(0);
  const lastTime       = useRef(0);
  const animRef        = useRef(null);

  /* Smoothed per-card values to avoid jitter */
  const cardStates     = useRef({});

  const autoSpeed      = 0.55;
  const friction       = 0.92;
  const dragMultiplier = 1.3;

  const applyCardEffects = useCallback(() => {
    const slider = sliderRef.current;
    const track  = trackRef.current;
    if (!slider || !track) return;

    const sliderRect   = slider.getBoundingClientRect();
    const sliderCenter = sliderRect.left + sliderRect.width / 2;
    const maxDist      = sliderRect.width * 0.6;
    const cards        = track.querySelectorAll(".car-card");

    cards.forEach((card, i) => {
      const rect       = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance   = cardCenter - sliderCenter;
      const ratio      = Math.max(-1, Math.min(1, distance / maxDist));
      const absRatio   = Math.abs(ratio);

      /* Target values */
      const targetScale   = 1 - absRatio * 0.11;
      const targetTiltY   = ratio * 8;
      const targetOpacity = 1 - absRatio * 0.52;
      const targetZ       = (1 - absRatio) * 28;

      /* Init smoothed state */
      if (!cardStates.current[i]) {
        cardStates.current[i] = {
          scale: targetScale,
          tiltY: targetTiltY,
          opacity: targetOpacity,
          z: targetZ,
        };
      }

      const s = cardStates.current[i];
      const lerpFactor = isDragging.current ? 0.25 : 0.1;

      /* Lerp toward targets — this is what removes the shake */
      s.scale   += (targetScale   - s.scale)   * lerpFactor;
      s.tiltY   += (targetTiltY   - s.tiltY)   * lerpFactor;
      s.opacity += (targetOpacity - s.opacity) * lerpFactor;
      s.z       += (targetZ       - s.z)       * lerpFactor;

      card.style.transform  = `scale(${s.scale.toFixed(4)}) rotateY(${s.tiltY.toFixed(4)}deg) translateZ(${s.z.toFixed(4)}px)`;
      card.style.opacity    = s.opacity.toFixed(4);
      card.style.zIndex     = Math.round((1 - absRatio) * 10);
    });
  }, []);

  const loop = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    if (!isDragging.current) {
      if (!paused) {
        velRef.current += (autoSpeed - velRef.current) * 0.03;
      } else {
        velRef.current *= friction;
      }
      posRef.current += velRef.current;
      const max = el.scrollWidth / 2;
      if (posRef.current >= max) posRef.current -= max;
      if (posRef.current < 0)   posRef.current += max;
      el.scrollLeft = posRef.current;
    }

    applyCardEffects();
    animRef.current = requestAnimationFrame(loop);
  }, [paused, applyCardEffects]);

  useEffect(() => {
    /* Init scroll position */
    const el = sliderRef.current;
    if (el) posRef.current = el.scrollLeft;
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [loop]);

  const onPointerDown = (e) => {
    isDragging.current  = true;
    startX.current      = e.clientX;
    lastX.current       = e.clientX;
    lastTime.current    = Date.now();
    startScroll.current = posRef.current;
    sliderRef.current.setPointerCapture(e.pointerId);
    sliderRef.current.style.cursor = "grabbing";
    cancelAnimationFrame(animRef.current);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const now = Date.now();
    const dt  = now - lastTime.current || 1;
    const dx  = (startX.current - e.clientX) * dragMultiplier;
    velRef.current = ((e.clientX - lastX.current) / dt) * -dragMultiplier * 16;
    lastX.current  = e.clientX;
    lastTime.current = now;
    posRef.current = startScroll.current + dx;
    const max = sliderRef.current.scrollWidth / 2;
    if (posRef.current >= max) posRef.current -= max;
    if (posRef.current < 0)   posRef.current += max;
    sliderRef.current.scrollLeft = posRef.current;
    applyCardEffects();
  };

  const onPointerUp = () => {
    isDragging.current = false;
    sliderRef.current.style.cursor = "grab";
    animRef.current = requestAnimationFrame(loop);
  };

  return (
    <div
      ref={sliderRef}
      className="slider"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div ref={trackRef} className="slide-track">
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export default function Deals() {

  const bestSeller = [
    { name: "Nissan Juke",          price: "145,000", suffix: "THB",       image: "/images/BestDeals/bd1.png",  specs: { year: "2018", engine: "1.6L Turbo",       mileage: "62,000 km",  fuel: "Petrol", transmission: "Auto",      color: "White"         }},
    { name: "Mazda 6",              price: "420,000", suffix: "THB",       image: "/images/BestDeals/bd2.png",  specs: { year: "2021", engine: "2.5L SKYACTIV",    mileage: "28,000 km",  fuel: "Petrol", transmission: "Auto",      color: "Sonic Silver"  }},
    { name: "BMW e90",              price: "165,000", suffix: "THB",       image: "/images/BestDeals/bd3.png",  specs: { year: "2010", engine: "2.0L Twin Turbo",  mileage: "110,000 km", fuel: "Petrol", transmission: "Auto",      color: "Alpine White"  }},
    { name: "Mazda CX5",            price: "560,000", suffix: "THB",       image: "/images/BestDeals/bd4.png",  specs: { year: "2022", engine: "2.5L SKYACTIV",    mileage: "15,000 km",  fuel: "Petrol", transmission: "Auto",      color: "Soul Red"      }},
    { name: "Mitsubishi Lancer EX", price: "125,000", suffix: "THB",       image: "/images/BestDeals/bd5.png",  specs: { year: "2012", engine: "2.0L MIVEC",       mileage: "95,000 km",  fuel: "Petrol", transmission: "CVT",       color: "Rally Red"     }},
  ];

  const mostRented = [
    { name: "BMW 5 Series F90",   price: "5,500",   suffix: "THB / day", image: "/images/MostRented/mr1.png", specs: { year: "2022", engine: "2.0L TwinPower",  mileage: "18,000 km", fuel: "Petrol", transmission: "Auto",      color: "Black Sapphire" }},
    { name: "BMW 7 Series 750Li", price: "6,000",   suffix: "THB / day", image: "/images/MostRented/mr2.png", specs: { year: "2021", engine: "4.4L V8 Turbo",   mileage: "22,000 km", fuel: "Petrol", transmission: "Auto",      color: "Carbon Black"   }},
    { name: "Honda City",         price: "1,000",   suffix: "THB / day", image: "/images/MostRented/mr3.png", specs: { year: "2023", engine: "1.0L VTEC Turbo", mileage: "8,000 km",  fuel: "Petrol", transmission: "CVT",       color: "Lunar Silver"   }},
    { name: "Honda Accord G8",    price: "1,500",   suffix: "THB / day", image: "/images/MostRented/mr4.png", specs: { year: "2020", engine: "1.5L VTEC Turbo", mileage: "35,000 km", fuel: "Petrol", transmission: "CVT",       color: "Platinum White" }},
    { name: "Mercedes E200",      price: "1,600",   suffix: "THB / day", image: "/images/MostRented/mr5.png", specs: { year: "2021", engine: "2.0L EQ Boost",   mileage: "27,000 km", fuel: "Petrol", transmission: "9G-Tronic", color: "Polar White"    }},
    { name: "Mercedes S300",      price: "5,000",   suffix: "THB / day", image: "/images/MostRented/mr6.png", specs: { year: "2022", engine: "3.0L Inline-6",   mileage: "12,000 km", fuel: "Petrol", transmission: "9G-Tronic", color: "Obsidian Black" }},
  ];

  const [tab, setTab]                   = useState("seller");
  const [flippedIndex, setFlippedIndex] = useState(null);
  const cars = tab === "seller" ? bestSeller : mostRented;

  useEffect(() => { setFlippedIndex(null); }, [tab]);

  return (
    <section className="deals">
      <ParticleBackground />
      <div className="deals-ambient deals-ambient--1" />
      <div className="deals-ambient deals-ambient--2" />
      <div className="deals-ambient deals-ambient--3" />
      <div className="deals-noise" />

      <motion.div
        className="deals-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
      >
        <span className="deals-eyebrow">
          <span className="eyebrow-line" /> Exclusive Collection <span className="eyebrow-line" />
        </span>
        <h2 className="deals-title">Best Deals For You</h2>
        <p className="deals-sub">Premium vehicles. Unmatched prices.</p>
      </motion.div>

      <motion.div
        className="deal-tabs"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        viewport={{ once: true }}
      >
        <button className={tab === "seller" ? "active" : ""} onClick={() => setTab("seller")}>
          <span className="tab-dot" /> Best Seller
        </button>
        <button className={tab === "rented" ? "active" : ""} onClick={() => setTab("rented")}>
          <span className="tab-dot" /> Most Rented
        </button>
      </motion.div>

      <SmoothSlider paused={flippedIndex !== null}>
        {cars.concat(cars).map((car, index) => (
          <CarCard
            key={`${tab}-${index}`}
            car={car}
            index={index}
            tab={tab}
            flippedIndex={flippedIndex}
            onFlip={(i) => setFlippedIndex(flippedIndex === i ? null : i)}
          />
        ))}
      </SmoothSlider>

      <motion.div
        className="deals-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.button
          className="view-shop"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          View Full Collection
        </motion.button>
      </motion.div>
    </section>
  );
}