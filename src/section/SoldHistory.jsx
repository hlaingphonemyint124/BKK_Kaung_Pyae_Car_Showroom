import React, { useState, useEffect, useRef, useMemo } from "react";
import "./SoldHistory.css";
import { getSoldHistory } from "../api/soldhistory.api";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const FILTERS = ["All", "Reserved", "Sold"];
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

function soldDate(car) {
  return car.sold_at || car.updated_at || null;
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
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function SoldHistory() {
  const { t }             = useLanguage();
  const [cars, setCars]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [page, setPage]       = useState(1);
  const statsRef              = useRef([]);

  // ── Fetch — compute stats client-side ──────────────────────
  useEffect(() => {
    setLoading(true);
    getSoldHistory()
      .then((res) => {
        const raw = res?.data?.cars ?? res?.data ?? [];
        const sold = (Array.isArray(raw) ? raw : []).filter(
          (c) => c.listing_type === "sale" && (c.status === "sold" || c.status === "reserved")
        );
        setCars(sold);
      })
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats — only count status==="sold", not reserved ──
  const stats = useMemo(() => {
    const now   = new Date();
    const month = now.getMonth();
    const year  = now.getFullYear();

    // Stats operate only on sold cars; reserved cars appear in the list but not stats
    const soldOnly = cars.filter((c) => c.status === "sold");

    const total_sold = soldOnly.length;

    const this_month = soldOnly.filter((c) => {
      const d = new Date(soldDate(c) || 0);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;

    // Monthly sold count for current year
    const monthly = MONTH_NAMES.map((name, i) => ({
      name,
      count: soldOnly.filter((c) => {
        const d = new Date(soldDate(c) || 0);
        return d.getMonth() === i && d.getFullYear() === year;
      }).length,
    })).filter((m) => m.count > 0);

    return { total_sold, this_month, monthly };
  }, [cars]);

  // ── Trigger stat bar animations ─────────────────────────────
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      statsRef.current.forEach((el) => el?.classList.add("animated"));
    }, 300);
    return () => clearTimeout(t);
  }, [loading]);

  // ── Filter + paginate ───────────────────────────────────────
  const filtered =
    filter === "All"      ? cars :
    filter === "Sold"     ? cars.filter((c) => c.status === "sold") :
    filter === "Reserved" ? cars.filter((c) => c.status === "reserved") :
    cars;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleFilter = (f) => { setFilter(f); setPage(1); };

  return (
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
              {t("sold_eyebrow")}
            </div>
            <h2 className="sh-title">{t("sold_title1")} <span>{t("sold_title2")}</span></h2>
            <p className="sh-subtitle">{t("sold_sub")}</p>
          </div>
          <Link to="/sold-history" className="btn-secondary">
            {t("sold_view_all")}
          </Link>
        </div>

        {/* ── Stats Row: Total Sold | Sold This Month | Jan | Feb … ── */}
        <div className="sh-stats">
          <div className="sh-stat" ref={(el) => (statsRef.current[0] = el)}>
            <div className="sh-stat-value">
              <Counter target={stats.total_sold} />
            </div>
            <div className="sh-stat-label">Total Cars Sold</div>
            <div className="sh-stat-bar" />
          </div>

          <div className="sh-stat" ref={(el) => (statsRef.current[1] = el)}>
            <div className="sh-stat-value red">
              <Counter target={stats.this_month} />
            </div>
            <div className="sh-stat-label">Sold This Month</div>
            <div className="sh-stat-bar" />
          </div>

          {stats.monthly.length === 0 && !loading && (
            <div className="sh-stat">
              <div className="sh-stat-value red">0</div>
              <div className="sh-stat-label">No sales yet</div>
              <div className="sh-stat-bar" />
            </div>
          )}

          {stats.monthly.map((m, i) => (
            <div key={m.name} className="sh-stat" ref={(el) => (statsRef.current[i + 2] = el)}>
              <div className="sh-stat-value red">
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
              <div className="sh-empty-text">{t("sold_empty")}</div>
            </div>
          )}

          {!loading && paginated.map((car, i) => (
            <div key={car.id} className="sh-car-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="sh-car-card-img-wrap">
                {getImg(car)
                  ? <img className="sh-car-card-img" src={getImg(car)} alt={car.model} />
                  : <div className="sh-car-card-img-placeholder">🚗</div>}
                <span className="sh-badge sold">
                  <span className="sh-badge-dot" />{t("sold_badge")}
                </span>
              </div>

              <div className="sh-car-card-body">
                <div className="sh-car-card-header">
                  <div>
                    <div className="sh-car-name">{car.brand} {car.model}</div>
                    <div className="sh-car-year">{car.year}</div>
                  </div>
                  <div className="sh-price">฿{Number(car.sale_price || 0).toLocaleString()}</div>
                </div>

                <div className="sh-car-card-meta">
                  <div className="sh-meta-item">
                    <span className="sh-meta-icon">🏷️</span>
                    <span>{car.body_type || car.type || "—"}</span>
                  </div>
                  <div className="sh-meta-item">
                    <span className="sh-meta-icon">🛣️</span>
                    <span>{car.mileage_km ? `${Number(car.mileage_km).toLocaleString()} km` : "—"}</span>
                  </div>
                  <div className="sh-meta-item">
                    <span className="sh-meta-icon">📅</span>
                    <span>{formatDate(soldDate(car))}</span>
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
              {t("sold_showing")} {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} {t("sold_of")} {filtered.length} {t("sold_records")}
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
  );
}
