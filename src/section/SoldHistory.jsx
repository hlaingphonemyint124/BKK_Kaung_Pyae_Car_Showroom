import React, { useState, useEffect, useRef } from "react";
import "./SoldHistory.css";
import { getSoldHistory, getSoldStats } from "../api/soldhistory.api";
import { Link } from "react-router-dom";



// ─── Fallback static data ─────────────────────────────────────────────────────
const FALLBACK_CARS = [
  { id: 1,  brand: "Toyota",     model: "Fortuner",     year: 2021, sale_price: 750000,  currency_code: "THB", mileage_km: 120000, type: "SUV",          sold_at: "2024-03-15", images: [], img: "/images/ShopCar/toyotaFortuner.webp"  },
  { id: 2,  brand: "BMW",        model: "5 Series",     year: 2020, sale_price: 1250000, currency_code: "THB", mileage_km: 85000,  type: "Sedan",        sold_at: "2024-03-10", images: [], img: "/images/BestDeals/bd3.png"              },
  { id: 3,  brand: "Mazda",      model: "CX-5",         year: 2022, sale_price: 560000,  currency_code: "THB", mileage_km: 15000,  type: "SUV",          sold_at: "2024-03-08", images: [], img: "/images/BestDeals/bd4.png"              },
  { id: 4,  brand: "Honda",      model: "Civic Type R", year: 2021, sale_price: 420000,  currency_code: "THB", mileage_km: 42000,  type: "Sedan",        sold_at: "2024-03-05", images: [], img: "/images/ShopCar/hondaCivicFl5.webp"    },
  { id: 5,  brand: "Mercedes",   model: "E200",         year: 2021, sale_price: 980000,  currency_code: "THB", mileage_km: 27000,  type: "Sedan",        sold_at: "2024-02-28", images: [], img: "/images/MostRented/mr5.png"             },
  { id: 6,  brand: "Isuzu",      model: "D-Max",        year: 2020, sale_price: 380000,  currency_code: "THB", mileage_km: 95000,  type: "Pickup Truck", sold_at: "2024-02-22", images: [], img: "/images/ShopCar/isuzuDmax.webp"         },
  { id: 7,  brand: "Nissan",     model: "Juke",         year: 2018, sale_price: 145000,  currency_code: "THB", mileage_km: 62000,  type: "SUV",          sold_at: "2024-02-18", images: [], img: "/images/BestDeals/bd1.png"              },
  { id: 8,  brand: "Mitsubishi", model: "Lancer EX",    year: 2012, sale_price: 125000,  currency_code: "THB", mileage_km: 95000,  type: "Sedan",        sold_at: "2024-02-14", images: [], img: "/images/BestDeals/bd5.png"              },
];

const FALLBACK_STATS = {
  total_sold: 248,
  this_month: 12,
};

const FILTERS   = ["All", "Sedan", "SUV", "Pickup Truck", "Hatchback", "Electric"];
const PAGE_SIZE = 6;

// ─── Format date ──────────────────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, prefix = "", suffix = "" }) {
  const [val, setVal]         = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const num = parseInt(String(target).replace(/[^0-9]/g, ""), 10);
    if (!num) return;
    let cur = 0;
    const steps = 60;
    const inc   = num / steps;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= num) { setVal(num); clearInterval(id); }
      else setVal(Math.floor(cur));
    }, 1400 / steps);
    return () => clearInterval(id);
  }, [started, target]);

  return (
    <span ref={ref}>
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Skeleton cards ───────────────────────────────────────────────────────────
function SkeletonCards({ count = 6 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div className="sh-car-card sh-skeleton-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
      <div className="sh-skeleton sh-skeleton--img" />
      <div className="sh-car-card-body">
        <div className="sh-skeleton sh-skeleton--wide" style={{ marginBottom: 8 }} />
        <div className="sh-skeleton sh-skeleton--short" style={{ marginBottom: 16 }} />
        <div className="sh-skeleton sh-skeleton--med" />
      </div>
    </div>
  ));
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function SoldHistory() {
  const [cars, setCars]       = useState([]);
  const [stats, setStats]     = useState(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [page, setPage]       = useState(1);
  const statsRef              = useRef([]);

  // ── Fetch data ──────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSoldHistory({ limit: 50 }),
      getSoldStats(),
    ])
      .then(([carsRes, statsRes]) => {
        const carsData  = carsRes.data?.cars  ?? carsRes.data  ?? FALLBACK_CARS;
        const statsData = statsRes.data?.stats ?? statsRes.data ?? FALLBACK_STATS;
        setCars(Array.isArray(carsData) && carsData.length > 0 ? carsData : FALLBACK_CARS);
        setStats(statsData);
      })
      .catch(() => {
        setCars(FALLBACK_CARS);
        setStats(FALLBACK_STATS);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Trigger stat bar animations ─────────────────────────────
  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => {
      statsRef.current.forEach(el => el?.classList.add("animated"));
    }, 300);
    return () => clearTimeout(timeout);
  }, [loading]);

  // ── Filter + paginate ───────────────────────────────────────
  const filtered = filter === "All"
    ? cars
    : cars.filter(c => (c.type || "").toLowerCase() === filter.toLowerCase());

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (f) => { setFilter(f); setPage(1); };

  // ── Image helper ────────────────────────────────────────────
  const getImg = (car) =>
    car.images?.[0]?.storage_path || car.img || null;

  return (
    <section className="sh-root">
      <div className="sh-noise" />
      <div className="sh-inner">

        {/* ── Header ── */}
        <div className="sh-header">
          <div className="sh-title-block">
            <div className="sh-eyebrow">
              <span className="sh-eyebrow-line" />
              Sales Record
            </div>
            <h2 className="sh-title">SOLD <span>HISTORY</span></h2>
            <p className="sh-subtitle">Every vehicle that found its new home</p>
          </div>
          <Link to="/sold-history" className="sh-viewall-btn">
  View All Records →
</Link>
        </div>

        {/* ── Stats Row — 2 stats ── */}
        <div className="sh-stats">
          {[
            { label: "Total Cars Sold", value: stats.total_sold, prefix: "", suffix: "",      red: false },
            { label: "Sold This Month", value: stats.this_month, prefix: "", suffix: " cars", red: true  },
          ].map((s, i) => (
            <div
              key={i}
              className="sh-stat"
              ref={el => statsRef.current[i] = el}
            >
              <div className={`sh-stat-value ${s.red ? "red" : ""}`}>
                <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="sh-stat-label">{s.label}</div>
              <div className="sh-stat-bar" />
            </div>
          ))}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="sh-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`sh-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => handleFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Product Grid ── */}
        <div className="sh-grid">

          {/* Loading */}
          {loading && <SkeletonCards count={6} />}

          {/* Empty */}
          {!loading && paginated.length === 0 && (
            <div className="sh-empty">
              <div className="sh-empty-icon">🚗</div>
              <div className="sh-empty-text">No sold cars found for this filter.</div>
            </div>
          )}

          {/* Cards */}
          {!loading && paginated.map((car, i) => (
            <div
              key={car.id}
              className="sh-car-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Image */}
              <div className="sh-car-card-img-wrap">
                {getImg(car)
                  ? <img className="sh-car-card-img" src={getImg(car)} alt={car.model} />
                  : <div className="sh-car-card-img-placeholder">🚗</div>
                }
                <span className="sh-badge sold">
                  <span className="sh-badge-dot" />Sold
                </span>
              </div>

              {/* Body */}
              <div className="sh-car-card-body">
                <div className="sh-car-card-header">
                  <div>
                    <div className="sh-car-name">{car.brand} {car.model}</div>
                    <div className="sh-car-year">{car.year}</div>
                  </div>
                  <div className="sh-price">฿{Number(car.sale_price).toLocaleString()}</div>
                </div>

                <div className="sh-car-card-meta">
                  <div className="sh-meta-item">
                    <span className="sh-meta-icon">🏷️</span>
                    <span>{car.type || "—"}</span>
                  </div>
                  <div className="sh-meta-item">
                    <span className="sh-meta-icon">🛣️</span>
                    <span>{car.mileage_km ? `${Number(car.mileage_km).toLocaleString()} km` : "—"}</span>
                  </div>
                  <div className="sh-meta-item">
                    <span className="sh-meta-icon">📅</span>
                    <span>{formatDate(car.sold_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="sh-pagination">
            <span className="sh-page-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
            </span>
            <div className="sh-page-btns">
              <button
                className="sh-page-btn"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >‹</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`sh-page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="sh-page-btn"
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
              >›</button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}