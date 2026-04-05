import "./Deals.css";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED PRICE
───────────────────────────────────────────────────────────────────────────── */
function AnimatedPrice({ value, suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const target = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (!target) return;
    let cur = 0;
    const steps = 60;
    const inc = target / steps;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= target) { setDisplay(target); clearInterval(id); }
      else setDisplay(Math.floor(cur));
    }, 1200 / steps);
    return () => clearInterval(id);
  }, [started, value]);

  return <span ref={ref}>{display.toLocaleString()} {suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLE CANVAS  (dark mode only — opacity controlled by CSS)
───────────────────────────────────────────────────────────────────────────── */
function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const COLS = [
      "rgba(220,30,30,", "rgba(180,10,10,",
      "rgba(100,10,10,", "rgba(60,60,60,", "rgba(40,40,40,",
    ];
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.3,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      a: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      fl: Math.random() * 0.02 + 0.005,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.a += Math.sin(Date.now() * p.fl) * 0.008;
        p.a = Math.max(0.05, Math.min(0.65, p.a));
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10)             p.x = canvas.width + 10;
        if (p.x > canvas.width+10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.col}${p.a.toFixed(2)})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="deals-particles" />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SPEC ROW
───────────────────────────────────────────────────────────────────────────── */
function SpecRow({ icon, label, value }) {
  return (
    <div className="spec-row">
      <span className="spec-icon">{icon}</span>
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAR CARD
   ════════════════════════════════════════════════════════════════════════════
   THE FLIP FIX — root causes on Safari / Chrome Mac:
   ① Any JS-written `transform` on .car-card breaks preserve-3d on the child.
   ② `overflow:hidden` on a preserve-3d ancestor flattens children in Safari.
   ③ `will-change:transform` creates a new stacking context → same problem.
   ④ `filter` on any ancestor collapses 3d.

   Solution:
   • .car-card        → perspective only. No transform, no overflow, no filter,
                         no will-change. Just a sizing + perspective shell.
   • .card-flipper    → the ONLY element that rotates. Has preserve-3d.
                         Fixed pixel height so it never collapses.
   • .card-face       → backface-visibility hidden. overflow:hidden is fine here
                         because it's a leaf — NOT a preserve-3d parent.
   • Hover lift       → applied via CSS on .card-face directly, not on .car-card.
   • Click vs drag    → tracked by pointerdown/up distance on the card itself.
───────────────────────────────────────────────────────────────────────────── */
function CarCard({ car, index, isFlipped, onFlip }) {
  const downPos = useRef({ x: 0, y: 0 });

  return (
    <motion.div
      className="car-card"
      onPointerDown={e  => { downPos.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={e    => {
        const dx = Math.abs(e.clientX - downPos.current.x);
        const dy = Math.abs(e.clientY - downPos.current.y);
        if (dx < 8 && dy < 8) onFlip(index);
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`card-flipper${isFlipped ? " flipped" : ""}`}>

        {/* ══ FRONT ══ */}
        <div className="card-face card-front">
          <div className="card-gloss" />
          <div className="card-corner tl" /><div className="card-corner br" />

          <div className="card-img-wrap">
            <div className="card-img-glow" />
            <img src={car.image} alt={car.name} draggable={false} />
          </div>

          <div className="card-sep" />

          <div className="card-info">
            <h3 className="card-name">{car.name}</h3>
            <p className="card-price"><AnimatedPrice value={car.price} suffix={car.suffix} /></p>
          </div>

          <button
            className="card-cta"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
          >
            <span>Shop Now</span><span className="cta-arrow">→</span>
          </button>
          <p className="flip-hint">Tap card to see specs ↺</p>
        </div>

        {/* ══ BACK ══ */}
        <div className="card-face card-back">
          <div className="card-gloss" />
          <div className="card-corner tl" /><div className="card-corner br" />

          <div className="back-head">
            <h3 className="back-name">{car.name}</h3>
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

          <button
            className="card-cta"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
          >
            <span>Shop Now</span><span className="cta-arrow">→</span>
          </button>
          <p className="flip-hint">Tap to go back ↺</p>
        </div>

      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAV ARROW
───────────────────────────────────────────────────────────────────────────── */
function NavArrow({ dir, onClick }) {
  return (
    <motion.button
      className={`nav-arrow nav-arrow--${dir}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      <span className="nav-glow" />
      <span className="nav-ring" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === "prev"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SLIDER  — drag + momentum, NO auto-scroll
   Cards do NOT move on their own. User must drag/swipe or click arrows.
───────────────────────────────────────────────────────────────────────────── */
function Slider({ children, navigateRef }) {
  const trackRef   = useRef(null);
  const dragging   = useRef(false);
  const startX     = useRef(0);
  const startScr   = useRef(0);
  const lastX      = useRef(0);
  const lastT      = useRef(0);
  const vel        = useRef(0);
  const rafId      = useRef(null);

  /* Smooth arrow navigation */
  useEffect(() => {
    if (!navigateRef) return;
    navigateRef.current = (dir) => {
      const el = trackRef.current;
      if (!el) return;
      const card = el.querySelector(".car-card");
      const step = card ? card.offsetWidth + 24 : 314;
      cancelAnimationFrame(rafId.current);
      const from = el.scrollLeft;
      const to   = from + dir * step;
      const dur  = 460;
      const t0   = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.scrollLeft = from + (to - from) * ease(p);
        if (p < 1) rafId.current = requestAnimationFrame(tick);
      };
      rafId.current = requestAnimationFrame(tick);
    };
  }, [navigateRef]);

  /* Momentum after drag release */
  const momentum = () => {
    const el = trackRef.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    let v = vel.current;
    const tick = () => {
      v *= 0.91;
      el.scrollLeft += v;
      if (Math.abs(v) > 0.3) rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
  };

  const onDown = e => {
    cancelAnimationFrame(rafId.current);
    dragging.current = true;
    startX.current   = e.clientX;
    lastX.current    = e.clientX;
    lastT.current    = Date.now();
    startScr.current = trackRef.current.scrollLeft;
    vel.current      = 0;
    trackRef.current.setPointerCapture(e.pointerId);
    trackRef.current.style.cursor = "grabbing";
  };

  const onMove = e => {
    if (!dragging.current) return;
    const dx = startX.current - e.clientX;
    trackRef.current.scrollLeft = startScr.current + dx;
    const now = Date.now();
    vel.current = (lastX.current - e.clientX) / Math.max(now - lastT.current, 1) * 16;
    lastX.current = e.clientX;
    lastT.current = now;
  };

  const onUp = e => {
    if (!dragging.current) return;
    dragging.current = false;
    trackRef.current.style.cursor = "grab";
    if (Math.abs(e.clientX - startX.current) > 6) momentum();
  };

  return (
    <div
      ref={trackRef}
      className="slider-track"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <div className="slider-inner">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const BEST_SELLER = [
  { name: "Nissan Juke",          price: "145,000", suffix: "THB",       image: "/images/BestDeals/bd1.png",
    specs: { year: "2018", engine: "1.6L Turbo",      mileage: "62,000 km",  fuel: "Petrol", transmission: "Auto", color: "White"        }},
  { name: "Mazda 6",              price: "420,000", suffix: "THB",       image: "/images/BestDeals/bd2.png",
    specs: { year: "2021", engine: "2.5L SKYACTIV",   mileage: "28,000 km",  fuel: "Petrol", transmission: "Auto", color: "Sonic Silver"  }},
  { name: "BMW e90",              price: "165,000", suffix: "THB",       image: "/images/BestDeals/bd3.png",
    specs: { year: "2010", engine: "2.0L Twin Turbo", mileage: "110,000 km", fuel: "Petrol", transmission: "Auto", color: "Alpine White"  }},
  { name: "Mazda CX5",            price: "560,000", suffix: "THB",       image: "/images/BestDeals/bd4.png",
    specs: { year: "2022", engine: "2.5L SKYACTIV",   mileage: "15,000 km",  fuel: "Petrol", transmission: "Auto", color: "Soul Red"      }},
  { name: "Mitsubishi Lancer EX", price: "125,000", suffix: "THB",       image: "/images/BestDeals/bd5.png",
    specs: { year: "2012", engine: "2.0L MIVEC",      mileage: "95,000 km",  fuel: "Petrol", transmission: "CVT",  color: "Rally Red"     }},
];

const MOST_RENTED = [
  { name: "BMW 5 Series F90",   price: "5,500",   suffix: "THB / day", image: "/images/MostRented/mr1.png",
    specs: { year: "2022", engine: "2.0L TwinPower",  mileage: "18,000 km", fuel: "Petrol", transmission: "Auto",      color: "Black Sapphire" }},
  { name: "BMW 7 Series 750Li", price: "6,000",   suffix: "THB / day", image: "/images/MostRented/mr2.png",
    specs: { year: "2021", engine: "4.4L V8 Turbo",   mileage: "22,000 km", fuel: "Petrol", transmission: "Auto",      color: "Carbon Black"   }},
  { name: "Honda City",         price: "1,000",   suffix: "THB / day", image: "/images/MostRented/mr3.png",
    specs: { year: "2023", engine: "1.0L VTEC Turbo", mileage: "8,000 km",  fuel: "Petrol", transmission: "CVT",       color: "Lunar Silver"   }},
  { name: "Honda Accord G8",    price: "1,500",   suffix: "THB / day", image: "/images/MostRented/mr4.png",
    specs: { year: "2020", engine: "1.5L VTEC Turbo", mileage: "35,000 km", fuel: "Petrol", transmission: "CVT",       color: "Platinum White" }},
  { name: "Mercedes E200",      price: "1,600",   suffix: "THB / day", image: "/images/MostRented/mr5.png",
    specs: { year: "2021", engine: "2.0L EQ Boost",   mileage: "27,000 km", fuel: "Petrol", transmission: "9G-Tronic", color: "Polar White"    }},
  { name: "Mercedes S300",      price: "5,000",   suffix: "THB / day", image: "/images/MostRented/mr6.png",
    specs: { year: "2022", engine: "3.0L Inline-6",   mileage: "12,000 km", fuel: "Petrol", transmission: "9G-Tronic", color: "Obsidian Black" }},
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────────────────── */
export default function Deals() {
  const [tab, setTab]       = useState("seller");
  const [flipped, setFlip]  = useState(null);
  const navigateRef         = useRef(null);

  const cars = tab === "seller" ? BEST_SELLER : MOST_RENTED;
  useEffect(() => setFlip(null), [tab]);

  return (
    <section className="deals">
      <ParticleBackground />
      <div className="deals-blob deals-blob--1" />
      <div className="deals-blob deals-blob--2" />
      <div className="deals-blob deals-blob--3" />
      <div className="deals-noise" />

      {/* ── Header ── */}
      <motion.div className="deals-header"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}
      >
        <p className="deals-eyebrow">
          <span className="eyebrow-rule" />Exclusive Collection<span className="eyebrow-rule" />
        </p>
        <h2 className="deals-title">Best Deals For You</h2>
        <p className="deals-sub">Premium vehicles. Unmatched prices.</p>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div className="deals-tabs"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }} viewport={{ once: true }}
      >
        <button className={tab === "seller" ? "active" : ""} onClick={() => setTab("seller")}>
          <span className="tab-dot" />New Arrivals
        </button>
        <button className={tab === "rented" ? "active" : ""} onClick={() => setTab("rented")}>
          <span className="tab-dot" />Most Rented
        </button>
      </motion.div>

      {/* ── Slider Row ── */}
      <div className="slider-row">
        <NavArrow dir="prev" onClick={() => navigateRef.current?.(-1)} />

        <div className="slider-mask">
          <Slider navigateRef={navigateRef}>
            {cars.map((car, i) => (
              <CarCard
                key={`${tab}-${i}`}
                car={car}
                index={i}
                isFlipped={flipped === i}
                onFlip={idx => setFlip(flipped === idx ? null : idx)}
              />
            ))}
          </Slider>
        </div>

        <NavArrow dir="next" onClick={() => navigateRef.current?.(1)} />
      </div>

      {/* ── CTA ── */}
      <motion.div className="deals-cta"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} viewport={{ once: true }}
      >
        <motion.button className="cta-btn"
          whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
        >
          View Full Collection
        </motion.button>
      </motion.div>
    </section>
  );
}