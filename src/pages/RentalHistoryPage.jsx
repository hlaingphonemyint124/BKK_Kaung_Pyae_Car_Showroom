import React, { useState, useEffect, useRef, useMemo } from "react";
import "../section/SoldHistory.css";
import { getRentalHistory } from "../api/soldhistory.api";
import { useLanguage } from "../context/LanguageContext";

const FILTERS   = ["All", "Available", "Rented", "Maintenance"];
const PAGE_SIZE = 6;
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getImg(car) {
  return car.primary_image ||
    car.images?.find((i) => i.is_primary)?.storage_path ||
    car.images?.[0]?.storage_path ||
    null;
}

function statusLabel(status) {
  switch (status) {
    case "available":   return "Available";
    case "rented":      return "Rented";
    case "maintenance": return "Maintenance";
    case "reserved":    return "Reserved";
    default:            return status || "—";
  }
}

function statusAccent(status) {
  switch (status) {
    case "available":   return "#22c55e";
    case "rented":      return "#3b82f6";
    case "maintenance": return "#f97316";
    case "reserved":    return "#f59e0b";
    default:            return "#6b7280";
  }
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
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
    const num = parseInt(String(target), 10);
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

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
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
   RENTAL HISTORY PAGE
═══════════════════════════════════════════════════════════════ */
export default function RentalHistoryPage() {
  const { t }                 = useLanguage();
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [page, setPage]       = useState(1);
  const statsRef              = useRef([]);

  // ── Fetch ───────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    getRentalHistory()
      .then((res) => {
        const raw = res?.data?.cars ?? res?.data ?? [];
        const rentals = (Array.isArray(raw) ? raw : []).filter(
          (c) => c.listing_type === "rent"
        );
        setCars(rentals);
      })
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats (client-side) ─────────────────────────────
  const stats = useMemo(() => {
    const now   = new Date();
    const month = now.getMonth();
    const year  = now.getFullYear();

    const total          = cars.length;
    const currentlyRented = cars.filter((c) => c.status === "rented").length;
    const this_month     = cars.filter((c) => {
      if (c.status !== "rented") return false;
      const d = new Date(c.updated_at || 0);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;

    const monthly = MONTH_NAMES.map((name, i) => ({
      name,
      count: cars.filter((c) => {
        if (c.status !== "rented") return false;
        const d = new Date(c.updated_at || 0);
        return d.getMonth() === i && d.getFullYear() === year;
      }).length,
    })).filter((m) => m.count > 0);

    return { total, currentlyRented, this_month, monthly };
  }, [cars]);

  // ── Trigger stat bar animations ─────────────────────────────
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      statsRef.current.forEach((el) => el?.classList.add("animated"));
    }, 300);
    return () => clearTimeout(timer);
  }, [loading]);

  // ── Filter + paginate ───────────────────────────────────────
  const filtered = filter === "All"
    ? cars
    : cars.filter((c) => c.status?.toLowerCase() === filter.toLowerCase());

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleFilter = (f) => { setFilter(f); setPage(1); };

  return (
    <div className="sold-history-page rh-root">
      <section className="sh-root">
        <div className="sec-blob sec-blob--lg sec-blob--tr" />
        <div className="sec-blob sec-blob--md sec-blob--bc" />
        <div className="sec-blob sec-blob--sm sec-blob--ml" />
        <div className="sh-noise" />
        <div className="sh-inner">

          {/* ── Header ── */}
          <div className="sh-header">
            <div className="sh-title-block">
              <div className="sh-eyebrow">
                <span className="sh-eyebrow-line" />
                RENTAL RECORD
              </div>
              <h2 className="sh-title">Rental <span>History</span></h2>
              <p className="sh-subtitle">Every vehicle that went out on the road</p>
            </div>
          </div>

          {/* ── Stats Row: Total + Currently Rented + one cell per month ── */}
          <div className="sh-stats">
            <div className="sh-stat" ref={(el) => (statsRef.current[0] = el)}>
              <div className="sh-stat-value">
                <Counter target={stats.total} />
              </div>
              <div className="sh-stat-label">Total Rental Cars</div>
              <div className="sh-stat-bar" />
            </div>

            <div className="sh-stat" ref={(el) => (statsRef.current[1] = el)}>
              <div className="sh-stat-value blue">
                <Counter target={stats.currentlyRented} />
              </div>
              <div className="sh-stat-label">Currently Rented</div>
              <div className="sh-stat-bar" />
            </div>

            {stats.monthly.length === 0 && !loading && (
              <div className="sh-stat">
                <div className="sh-stat-value blue">0</div>
                <div className="sh-stat-label">No rentals yet</div>
                <div className="sh-stat-bar" />
              </div>
            )}

            {stats.monthly.map((m, i) => (
              <div key={m.name} className="sh-stat" ref={(el) => (statsRef.current[i + 2] = el)}>
                <div className="sh-stat-value blue">
                  <Counter target={m.count} />
                </div>
                <div className="sh-stat-label">{m.name}</div>
                <div className="sh-stat-bar" />
              </div>
            ))}
          </div>

          {/* ── Filter Tabs ── */}
          <div className="sh-filters">
            {FILTERS.map((f) => (
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
            {loading && <SkeletonCards count={6} />}

            {!loading && paginated.length === 0 && (
              <div className="sh-empty">
                <div className="sh-empty-icon">🚗</div>
                <div className="sh-empty-text">No rental cars found.</div>
              </div>
            )}

            {!loading && paginated.map((car, i) => {
              const accent = statusAccent(car.status);
              return (
                <div key={car.id} className="sh-car-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="sh-car-card-img-wrap">
                    {getImg(car)
                      ? <img className="sh-car-card-img" src={getImg(car)} alt={car.model} />
                      : <div className="sh-car-card-img-placeholder">🚗</div>}
                    <span className="sh-badge rented" style={{
                      background: `${accent}22`,
                      color: accent,
                      border: `1px solid ${accent}44`,
                    }}>
                      <span className="sh-badge-dot" style={{ background: accent }} />
                      {statusLabel(car.status)}
                    </span>
                  </div>

                  <div className="sh-car-card-body">
                    <div className="sh-car-card-header">
                      <div>
                        <div className="sh-car-name">{car.brand} {car.model}</div>
                        <div className="sh-car-year">{car.year}</div>
                      </div>
                      {car.rent_price_per_day && (
                        <div className="sh-price">
                          ฿{Number(car.rent_price_per_day).toLocaleString()}
                          <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>/day</span>
                        </div>
                      )}
                    </div>

                    <div className="sh-car-card-meta">
                      <div className="sh-meta-item">
                        <span className="sh-meta-icon">🏷️</span>
                        <span>{car.body_type || car.type || "—"}</span>
                      </div>
                      {car.rent_count != null && (
                        <div className="sh-meta-item">
                          <span className="sh-meta-icon">🔁</span>
                          <span>{car.rent_count} time{car.rent_count !== 1 ? "s" : ""} rented</span>
                        </div>
                      )}
                      <div className="sh-meta-item">
                        <span className="sh-meta-icon">📅</span>
                        <span>{formatDate(car.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="sh-pagination">
              <span className="sh-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
              </span>
              <div className="sh-page-btns">
                <button className="sh-page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`sh-page-btn ${page === i + 1 ? "active" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="sh-page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>›</button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
