import React, { useState, useEffect, useRef, useMemo } from "react";
import "../section/SoldHistory.css";
import { getAdminRentals, getRentalHistory } from "../api/soldhistory.api";

const FILTERS = ["All", "Rented", "Maintenance"];
const PAGE_SIZE = 6;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Count all non-cancelled rentals as transactions
const COUNTED_STATUSES = new Set(["pending", "confirmed", "active", "completed"]);

function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getImg(car) {
  return (
    car?.primary_image ||
    car?.images?.find((i) => i.is_primary)?.storage_path ||
    car?.images?.[0]?.storage_path ||
    null
  );
}

function statusLabel(status) {
  switch (status) {
    case "rented":
      return "Rented";
    case "maintenance":
      return "Maintenance";
    default:
      return status || "—";
  }
}

function statusAccent(status) {
  switch (status) {
    case "rented":
      return "#3b82f6";
    case "maintenance":
      return "#f97316";
    default:
      return "#6b7280";
  }
}

function normalizeRentals(res) {
  const d = res?.data;
  // Try every common envelope shape the backend might return
  if (Array.isArray(d))                return d;
  if (Array.isArray(d?.rentals))       return d.rentals;
  if (Array.isArray(d?.data?.rentals)) return d.data.rentals;
  if (Array.isArray(d?.data))          return d.data;
  if (Array.isArray(d?.rows))          return d.rows;
  if (Array.isArray(d?.data?.rows))    return d.data.rows;
  if (Array.isArray(d?.items))         return d.items;
  return [];
}

function normalizeCars(res) {
  const data = res?.data?.cars ?? res?.data ?? [];
  return Array.isArray(data) ? data : [];
}

function Counter({ target }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const num = parseInt(String(target), 10) || 0;
    if (!num) {
      setVal(0);
      return;
    }

    let cur = 0;
    const steps = 60;
    const inc = num / steps;

    const id = setInterval(() => {
      cur += inc;
      if (cur >= num) {
        setVal(num);
        clearInterval(id);
      } else {
        setVal(Math.floor(cur));
      }
    }, 1400 / steps);

    return () => clearInterval(id);
  }, [started, target]);

  return <span ref={ref}>{val.toLocaleString()}</span>;
}

function SkeletonCards({ count = 6 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div
      className="sh-car-card sh-skeleton-card"
      key={i}
      style={{ animationDelay: `${i * 0.05}s` }}
    >
      <div className="sh-skeleton sh-skeleton--img" />
      <div className="sh-car-card-body">
        <div className="sh-skeleton sh-skeleton--wide" style={{ marginBottom: 8 }} />
        <div className="sh-skeleton sh-skeleton--short" style={{ marginBottom: 16 }} />
        <div className="sh-skeleton sh-skeleton--med" />
      </div>
    </div>
  ));
}

export default function RentalHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const statsRef = useRef([]);

  useEffect(() => {
    setLoading(true);

    const txPromise = getAdminRentals()
      .then((res) => {
        const list = normalizeRentals(res);
        setTransactions(list);
        return list;
      })
      .catch(() => {
        setTransactions([]);
        return [];
      });

    const carsPromise = getRentalHistory()
      .then((res) => {
        // Keep ALL rental cars for lookup/count support.
        // Do not filter available here.
        const allRentCars = normalizeCars(res).filter(
          (c) => c.listing_type === "rent"
        );

        setCars(allRentCars);
        return allRentCars;
      })
      .catch(() => {
        setCars([]);
        return [];
      });

    Promise.allSettled([txPromise, carsPromise]).finally(() => {
      setLoading(false);
    });
  }, []);

  const carMap = useMemo(() => {
    const map = new Map();
    cars.forEach((c) => map.set(c.id, c));
    return map;
  }, [cars]);

  const historyCars = useMemo(() => {
    return cars.filter(
      (c) => c.status === "rented" || c.status === "maintenance"
    );
  }, [cars]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const counted = transactions.filter((tx) =>
      COUNTED_STATUSES.has(tx.status)
    );

    // If admin/rentals returned nothing (e.g. 401), fall back to rent_count on cars
    const usingFallback = counted.length === 0 && cars.length > 0;
    const totalRentalCount = usingFallback
      ? cars.reduce((s, c) => s + Number(c.rent_count ?? c.total_rented ?? 0), 0)
      : counted.length;

    // ── Transaction-based stats ────────────────────────────
    const thisMonth = usingFallback ? 0 : counted.filter((tx) => {
      const d = new Date(tx.start_date || tx.created_at || 0);
      return !Number.isNaN(d.getTime()) &&
             d.getMonth() === currentMonth &&
             d.getFullYear() === currentYear;
    }).length;

    const monthly = usingFallback ? [] : MONTH_NAMES.map((name, i) => ({
      name,
      count: counted.filter((tx) => {
        const d = new Date(tx.start_date || tx.created_at || 0);
        return !Number.isNaN(d.getTime()) &&
               d.getMonth() === i &&
               d.getFullYear() === currentYear;
      }).length,
    })).filter((m) => m.count > 0);

    // ── Per-car count ──────────────────────────────────────
    let perCarList;
    if (usingFallback) {
      // Fallback: use rent_count from each car
      perCarList = cars
        .map((c) => ({
          carId: c.id,
          count: Number(c.rent_count ?? c.total_rented ?? 0),
          brand: c.brand || "—",
          model: c.model || "—",
          image: getImg(c),
        }))
        .filter((p) => p.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    } else {
      const perCar = new Map();
      counted.forEach((tx) => {
        // car_id might be directly on tx or nested
        const carId = tx.car_id || tx.car?.id;
        if (!carId) return;
        perCar.set(carId, (perCar.get(carId) || 0) + 1);
      });
      perCarList = [...perCar.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([carId, count]) => {
          const car = carMap.get(carId);
          const embedded = counted.find(
            (tx) => (tx.car_id || tx.car?.id) === carId
          )?.car;
          return {
            carId,
            count,
            brand: car?.brand || embedded?.brand || "—",
            model: car?.model || embedded?.model || "—",
            image: car ? getImg(car) : (embedded ? getImg(embedded) : null),
          };
        });
    }

    const mostRented = perCarList[0] || null;

    const maintenanceCount = historyCars.filter(
      (c) => c.status === "maintenance"
    ).length;

    return {
      totalRentalCount,
      thisMonth,
      monthly,
      perCarList,
      mostRented,
      maintenanceCount,
    };
  }, [transactions, carMap, historyCars]);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      statsRef.current.forEach((el) => el?.classList.add("animated"));
    }, 300);

    return () => clearTimeout(timer);
  }, [loading]);

  const filtered =
    filter === "Rented"
      ? historyCars.filter((c) => c.status === "rented")
      : filter === "Maintenance"
      ? historyCars.filter((c) => c.status === "maintenance")
      : historyCars;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="sold-history-page rh-root">
      <section className="sh-root">
        <div className="sec-blob sec-blob--lg sec-blob--tr" />
        <div className="sec-blob sec-blob--md sec-blob--bc" />
        <div className="sec-blob sec-blob--sm sec-blob--ml" />
        <div className="sh-noise" />

        <div className="sh-inner">
          <div className="sh-header">
            <div className="sh-title-block">
              <div className="sh-eyebrow">
                <span className="sh-eyebrow-line" />
                RENTAL RECORD
              </div>

              <h2 className="sh-title">
                Rental <span>History</span>
              </h2>

              <p className="sh-subtitle">
                Rental transaction records and fleet status
              </p>
            </div>
          </div>

          <div className="sh-stats">
            <div className="sh-stat" ref={(el) => (statsRef.current[0] = el)}>
              <div className="sh-stat-value blue">
                <Counter target={stats.totalRentalCount} />
              </div>
              <div className="sh-stat-label">Total Rental Count</div>
              <div className="sh-stat-bar" />
            </div>

            <div className="sh-stat" ref={(el) => (statsRef.current[1] = el)}>
              <div className="sh-stat-value blue">
                <Counter target={stats.thisMonth} />
              </div>
              <div className="sh-stat-label">Rentals This Month</div>
              <div className="sh-stat-bar" />
            </div>

            <div className="sh-stat" ref={(el) => (statsRef.current[2] = el)}>
              <div
                className="sh-stat-value blue"
                style={{ fontSize: 16, letterSpacing: "-0.01em" }}
              >
                {loading
                  ? "—"
                  : stats.mostRented
                  ? `${stats.mostRented.brand} ${stats.mostRented.model}`
                  : "—"}
              </div>
              <div className="sh-stat-label">Most Rented Car</div>
              <div className="sh-stat-bar" />
            </div>

            <div className="sh-stat" ref={(el) => (statsRef.current[3] = el)}>
              <div className="sh-stat-value" style={{ color: "#f97316" }}>
                <Counter target={stats.maintenanceCount} />
              </div>
              <div className="sh-stat-label">Maintenance Cars</div>
              <div className="sh-stat-bar" />
            </div>

            {stats.monthly.map((m, i) => (
              <div
                key={m.name}
                className="sh-stat"
                ref={(el) => (statsRef.current[i + 4] = el)}
              >
                <div className="sh-stat-value blue">
                  <Counter target={m.count} />
                </div>
                <div className="sh-stat-label">{m.name}</div>
                <div className="sh-stat-bar" />
              </div>
            ))}
          </div>

          {!loading && stats.perCarList.length > 0 && (
            <div className="sh-monthly">
              <div className="sh-monthly-title">Rental Count Per Car</div>

              <div className="sh-monthly-grid">
                {stats.perCarList.map((item) => (
                  <div
                    key={item.carId}
                    className="sh-monthly-item sh-monthly-item--car"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={`${item.brand} ${item.model}`}
                        className="sh-monthly-car-img"
                      />
                    )}

                    <div
                      className="sh-monthly-month"
                      style={{ textTransform: "none" }}
                    >
                      {item.brand} {item.model}
                    </div>

                    <div className="sh-monthly-count sh-monthly-count--blue">
                      {item.count}
                    </div>

                    <div className="sh-monthly-label">
                      rental transaction{item.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <div className="sh-grid">
            {loading && <SkeletonCards count={6} />}

            {!loading && paginated.length === 0 && (
              <div className="sh-empty">
                <div className="sh-empty-icon">🚗</div>
                <div className="sh-empty-text">No cars found.</div>
              </div>
            )}

            {!loading &&
              paginated.map((car, i) => {
                const accent = statusAccent(car.status);
                const txCount =
                  stats.perCarList.find((p) => p.carId === car.id)?.count ?? 0;

                return (
                  <div
                    key={car.id}
                    className="sh-car-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="sh-car-card-img-wrap">
                      {getImg(car) ? (
                        <img
                          className="sh-car-card-img"
                          src={getImg(car)}
                          alt={car.model}
                        />
                      ) : (
                        <div className="sh-car-card-img-placeholder">🚗</div>
                      )}

                      <span
                        className="sh-badge rented"
                        style={{
                          background: `${accent}22`,
                          color: accent,
                          border: `1px solid ${accent}44`,
                        }}
                      >
                        <span
                          className="sh-badge-dot"
                          style={{ background: accent }}
                        />
                        {statusLabel(car.status)}
                      </span>
                    </div>

                    <div className="sh-car-card-body">
                      <div className="sh-car-card-header">
                        <div>
                          <div className="sh-car-name">
                            {car.brand} {car.model}
                          </div>
                          <div className="sh-car-year">{car.year}</div>
                        </div>

                        {car.rent_price_per_day && (
                          <div className="sh-price">
                            ฿{Number(car.rent_price_per_day).toLocaleString()}
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                opacity: 0.7,
                              }}
                            >
                              /day
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="sh-rent-rounds">
                        <span className="sh-rent-rounds__icon">🔁</span>
                        <span className="sh-rent-rounds__count">{txCount}</span>
                        <span className="sh-rent-rounds__label">
                          rental transaction{txCount !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="sh-car-card-meta">
                        <div className="sh-meta-item">
                          <span className="sh-meta-icon">🏷️</span>
                          <span>{car.body_type || car.type || "—"}</span>
                        </div>

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

          {!loading && totalPages > 1 && (
            <div className="sh-pagination">
              <span className="sh-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} records
              </span>

              <div className="sh-page-btns">
                <button
                  className="sh-page-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  ‹
                </button>

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
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}