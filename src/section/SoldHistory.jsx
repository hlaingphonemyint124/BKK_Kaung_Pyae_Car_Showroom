import React, { useState, useEffect, useRef } from "react";
import "./SoldHistory.css";
import { getSoldHistory, getSoldStats } from "../api/soldhistory.api";
import { Link } from "react-router-dom";




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
  const [stats, setStats]     = useState({ total_sold: 0, this_month: 0 });
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
        const carsData  = carsRes.data?.cars  ?? carsRes.data  ?? [];
        const statsData = statsRes.data?.stats ?? statsRes.data ?? { total_sold: 0, this_month: 0 };
        setCars(Array.isArray(carsData) ? carsData : []);
        setStats(statsData);
      })
      .catch(() => {
        setCars([]);
        setStats({ total_sold: 0, this_month: 0 });
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