import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "../section/SoldHistory.css";
import { getRentalHistory } from "../api/soldhistory.api";
import {
  getAdminRentals,
  updateAdminRentalStatus,
} from "../features/admin/services/adminRentalService";

const FILTERS     = ["All", "Rented", "Maintenance"];
const PAGE_SIZE   = 6;
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ─── ID normalizers — FIX for type/field-name mismatches ────────
   All IDs are coerced to trimmed strings so number vs string
   mismatches and different field names can never break comparisons. */
const getRentalCarId = (tx) => String(
  tx.car_id ??
  tx.carId ??
  tx.car?.id ??
  tx.car?._id ??
  tx.vehicle_id ??
  tx.vehicle?.id ??
  tx.vehicle?._id ??
  ""
).trim();

const getCarId = (car) => String(
  car.id ??
  car._id ??
  ""
).trim();

/* ─── Status normalizer — FIX for whitespace / case mismatches ── */
const normalizeStatus = (raw) =>
  String(raw ?? "").trim().toLowerCase();

const isCounted = (tx) => {
  const s = normalizeStatus(tx.status);
  return s === "pending"   ||
         s === "confirmed" ||
         s === "active"    ||
         s === "completed";
};

const isRentalCar = (car) =>
  car?.listing_type === "rent" ||
  car?.listing_type === "rental" ||
  (car?.listing_type == null && car?.rent_price_per_day != null);

const logRentDebug = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

/* ─── Response normalizers ────────────────────────────────────── */
function normalizeRentals(res) {
  const d = res?.data ?? res;
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
  const data = res?.data?.cars ?? res?.cars ?? res?.data ?? [];
  return Array.isArray(data) ? data : [];
}

/* ─── UI helpers ─────────────────────────────────────────────── */
function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getImg(car) {
  return car?.primary_image ||
    car?.images?.find((i) => i.is_primary)?.storage_path ||
    car?.images?.[0]?.storage_path ||
    null;
}

function getRentalId(tx) {
  return tx.id ?? tx._id ?? tx.rental_id;
}

function getRecordCarName(tx) {
  const brand = tx.car_brand || tx.car?.brand || tx.vehicle?.brand || "";
  const model = tx.car_model || tx.car?.model || tx.vehicle?.model || "";
  return `${brand} ${model}`.trim() || "—";
}

function getRecordCustomerName(tx) {
  return tx.customer_name || tx.customer?.full_name || tx.customer?.name || "—";
}

function formatMoney(value) {
  if (value == null || value === "") return "—";
  const num = Number(value);
  return Number.isNaN(num) ? "—" : `${num.toLocaleString()} THB`;
}

const rentalActionsFor = (status) => {
  switch (normalizeStatus(status)) {
    case "pending":
      return [
        { label: "Confirm", payload: { status: "confirmed" } },
        { label: "Cancel", payload: { status: "cancelled", cancelled_reason: "Cancelled by admin" } },
      ];
    case "confirmed":
      return [
        { label: "Activate", payload: { status: "active" } },
        { label: "Cancel", payload: { status: "cancelled", cancelled_reason: "Cancelled by admin" } },
      ];
    case "active":
      return [
        { label: "Complete", payload: { status: "completed" } },
        { label: "Cancel", payload: { status: "cancelled", cancelled_reason: "Cancelled by admin" } },
      ];
    default:
      return [];
  }
};

function statusLabel(status) {
  switch (normalizeStatus(status)) {
    case "rented":      return "Rented";
    case "maintenance": return "Maintenance";
    default:            return status || "—";
  }
}

function statusAccent(status) {
  switch (normalizeStatus(status)) {
    case "rented":      return "#3b82f6";
    case "maintenance": return "#f97316";
    default:            return "#6b7280";
  }
}

/* ─── Counter component ──────────────────────────────────────── */
function Counter({ target }) {
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
    const num = parseInt(String(target), 10) || 0;
    if (!num) { setVal(0); return; }
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

  return <span ref={ref}>{val.toLocaleString()}</span>;
}

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
  const [transactions, setTransactions] = useState([]);
  const [cars, setCars]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("All");
  const [page, setPage]                 = useState(1);
  const [updatingRentalId, setUpdatingRentalId] = useState(null);
  const [actionError, setActionError]   = useState("");
  const statsRef                        = useRef([]);

  const fetchRentalRecords = useCallback(async () => {
    try {
      const res = await getAdminRentals();
      const list = normalizeRentals(res);
      logRentDebug("rentals sample", list.slice(0, 5));
      logRentDebug(list.map(tx => ({
        rentalId: tx.id,
        status: tx.status,
        normalizedCarId: getRentalCarId(tx),
      })));
      setTransactions(list);
      return list;
    } catch (err) {
      console.warn("[RentalHistory] /admin/rentals failed:", err?.response?.status, err?.message);
      setTransactions([]);
      return [];
    }
  }, []);

  const fetchRentalCars = useCallback(async () => {
    try {
      const res = await getRentalHistory();
      const list = normalizeCars(res).filter(isRentalCar);
      logRentDebug("cars sample", list.slice(0, 5));
      setCars(list);
      return list;
    } catch (err) {
      console.warn("[RentalHistory] /cars failed:", err?.message);
      setCars([]);
      return [];
    }
  }, []);

  const handleRentalStatus = async (tx, payload) => {
    const rentalId = getRentalId(tx);
    if (!rentalId || updatingRentalId) return;

    try {
      setUpdatingRentalId(rentalId);
      setActionError("");
      await updateAdminRentalStatus(rentalId, payload);
      await Promise.allSettled([fetchRentalRecords(), fetchRentalCars()]);
    } catch (err) {
      console.error("Failed to update rental status:", err);
      setActionError(err.response?.data?.error || err.message || "Failed to update rental status.");
    } finally {
      setUpdatingRentalId(null);
    }
  };

  /* ── Fetch both sources in parallel ──────────────────────── */
  useEffect(() => {
    setLoading(true);

    Promise.allSettled([fetchRentalRecords(), fetchRentalCars()])
      .finally(() => setLoading(false));
  }, [fetchRentalRecords, fetchRentalCars]);

  /* ── Cars visible in the history grid ───────────────────── */
  const historyCars = useMemo(() =>
    cars.filter((c) => c.status === "rented" || c.status === "maintenance"),
  [cars]);

  /* ── Stats ───────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const now          = new Date();
    const currentMonth = now.getMonth();
    const currentYear  = now.getFullYear();

    /* Step 1: filter counted transactions with normalized status */
    const counted = transactions.filter(isCounted);

    /* Step 2: build per-car count map with NORMALIZED string IDs */
    const rentCountByCarId = {};
    counted.forEach((tx) => {
      const carId = getRentalCarId(tx);
      if (!carId) return;
      rentCountByCarId[carId] = (rentCountByCarId[carId] || 0) + 1;
    });
    logRentDebug("rentCountByCarId", rentCountByCarId);

    /* Step 3: total rental count
       If transactions are empty (e.g. 401), fall back to sum of rent_count from cars */
    const hasTxData    = counted.length > 0;
    const totalRentalCount = hasTxData
      ? counted.length
      : cars.reduce((s, c) => s + Number(c.rent_count ?? 0), 0);

    /* Step 4: this month */
    const thisMonth = hasTxData
      ? counted.filter((tx) => {
          const d = new Date(tx.start_date || tx.created_at || 0);
          return !Number.isNaN(d.getTime()) &&
                 d.getMonth() === currentMonth &&
                 d.getFullYear() === currentYear;
        }).length
      : 0;

    /* Step 5: monthly breakdown */
    const monthly = hasTxData
      ? MONTH_NAMES.map((name, i) => ({
          name,
          count: counted.filter((tx) => {
            const d = new Date(tx.start_date || tx.created_at || 0);
            return !Number.isNaN(d.getTime()) &&
                   d.getMonth() === i &&
                   d.getFullYear() === currentYear;
          }).length,
        })).filter((m) => m.count > 0)
      : [];

    /* Step 6: per-car list — FIX: fallback per-car from rent_count,
       not just globally. This means even when some tx exist,
       a car with no matching tx still shows its rent_count. */
    const perCarList = cars
      .map((c) => {
        const carId      = getCarId(c);
        const finalCount =
          rentCountByCarId[carId] ??
          c.rent_count ??
          0;

        return {
          carId,
          count: finalCount,
          rent_count: finalCount,
          brand: c.brand || "—",
          model: c.model || "—",
          image: getImg(c),
        };
      })
      .filter((p) => p.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const mostRented       = perCarList[0] || null;
    const currentlyRentedCount = historyCars.filter((c) => c.status === "rented").length;
    const maintenanceCount = historyCars.filter((c) => c.status === "maintenance").length;

    logRentDebug("[RentalHistory] final stats:", {
      totalRentalCount, thisMonth, currentlyRentedCount, maintenanceCount,
      perCarList: perCarList.map(p => `${p.brand} ${p.model}: ${p.count}`),
    });

    return { totalRentalCount, thisMonth, monthly, perCarList, mostRented, currentlyRentedCount, maintenanceCount, rentCountByCarId };
  }, [transactions, cars, historyCars]);

  /* ── Stat bar animations ─────────────────────────────────── */
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      statsRef.current.forEach((el) => el?.classList.add("animated"));
    }, 300);
    return () => clearTimeout(timer);
  }, [loading]);

  /* ── Filter + paginate ───────────────────────────────────── */
  const filtered =
    filter === "Rented"      ? historyCars.filter((c) => c.status === "rented") :
    filter === "Maintenance" ? historyCars.filter((c) => c.status === "maintenance") :
    historyCars;

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
                <span className="sh-eyebrow-line" />RENTAL RECORD
              </div>
              <h2 className="sh-title">Rental <span>History</span></h2>
              <p className="sh-subtitle">Rental transaction records and fleet status</p>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="sh-stats">
            <div className="sh-stat" ref={(el) => (statsRef.current[0] = el)}>
              <div className="sh-stat-value blue"><Counter target={stats.totalRentalCount} /></div>
              <div className="sh-stat-label">Rental Transactions</div>
              <div className="sh-stat-bar" />
            </div>

            <div className="sh-stat" ref={(el) => (statsRef.current[1] = el)}>
              <div className="sh-stat-value blue"><Counter target={stats.thisMonth} /></div>
              <div className="sh-stat-label">Rentals This Month</div>
              <div className="sh-stat-bar" />
            </div>

            <div className="sh-stat" ref={(el) => (statsRef.current[2] = el)}>
              <div className="sh-stat-value blue">
                <Counter target={stats.currentlyRentedCount} />
              </div>
              <div className="sh-stat-label">Currently Rented Cars</div>
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
              <div key={m.name} className="sh-stat" ref={(el) => (statsRef.current[i + 4] = el)}>
                <div className="sh-stat-value blue"><Counter target={m.count} /></div>
                <div className="sh-stat-label">{m.name}</div>
                <div className="sh-stat-bar" />
              </div>
            ))}
          </div>

          {/* Rental Records */}
          {!loading && (
            <div className="sh-monthly">
              <div className="sh-monthly-title">Rental Records</div>

              {actionError && (
                <div style={{
                  marginBottom: 12,
                  color: "#dc2626",
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  {actionError}
                </div>
              )}

              {transactions.length === 0 ? (
                <div className="sh-empty">
                  <div className="sh-empty-text">No rental records yet.</div>
                </div>
              ) : (
                <div className="sh-monthly-grid">
                  {transactions.map((tx) => {
                    const rentalId = getRentalId(tx);
                    const actions = rentalActionsFor(tx.status);
                    const isUpdating = updatingRentalId === rentalId;
                    const status = normalizeStatus(tx.status) || "-";

                    return (
                      <div key={rentalId || `${getRentalCarId(tx)}-${tx.start_date}-${tx.end_date}`}
                        className="sh-monthly-item sh-monthly-item--car">
                        <div className="sh-monthly-month" style={{ textTransform: "none" }}>
                          {getRecordCarName(tx)}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 6 }}>
                          {getRecordCustomerName(tx)}
                        </div>
                        <div className="sh-monthly-label" style={{ marginTop: 8 }}>
                          {formatDate(tx.start_date)} - {formatDate(tx.end_date)}
                        </div>
                        <div className="sh-monthly-label" style={{ marginTop: 8 }}>
                          Status: <strong>{status}</strong>
                        </div>
                        <div className="sh-monthly-label">
                          Deposit: {formatMoney(tx.deposit_amount)}
                        </div>
                        <div className="sh-monthly-label">
                          Total: {formatMoney(tx.total_price)}
                        </div>

                        {actions.length > 0 && (
                          <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            justifyContent: "center",
                            marginTop: 12,
                          }}>
                            {actions.map((action) => (
                              <button
                                key={action.label}
                                type="button"
                                className="sh-filter-btn"
                                disabled={isUpdating}
                                onClick={() => handleRentalStatus(tx, action.payload)}
                              >
                                {isUpdating ? "Updating..." : action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!loading && stats.perCarList.length > 0 && (
            <div className="sh-monthly">
              <div className="sh-monthly-title">Rental Count Per Car</div>
              <div className="sh-monthly-grid">
                {stats.perCarList.map((item) => (
                  <div key={item.carId} className="sh-monthly-item sh-monthly-item--car">
                    {item.image && (
                      <img src={item.image} alt={`${item.brand} ${item.model}`}
                        className="sh-monthly-car-img" />
                    )}
                    <div className="sh-monthly-month" style={{ textTransform: "none" }}>
                      {item.brand} {item.model}
                    </div>
                    <div className="sh-monthly-count sh-monthly-count--blue">{item.count}</div>
                    <div className="sh-monthly-label">
                      rental transaction{item.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Filter Tabs ── */}
          <div className="sh-filters">
            {FILTERS.map((f) => (
              <button key={f} className={`sh-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => handleFilter(f)}>{f}</button>
            ))}
          </div>

          {/* ── Car Grid ── */}
          <div className="sh-grid">
            {loading && <SkeletonCards count={6} />}

            {!loading && paginated.length === 0 && (
              <div className="sh-empty">
                <div className="sh-empty-icon">🚗</div>
                <div className="sh-empty-text">No cars found.</div>
              </div>
            )}

            {!loading && paginated.map((car, i) => {
              const carId  = getCarId(car);
              const accent = statusAccent(car.status);

              const txCount =
                stats.rentCountByCarId?.[carId] ??
                car.rent_count ??
                0;

              logRentDebug("FINAL_RENDER_CAR", {
                carId,
                statsRentCount: stats.rentCountByCarId?.[carId],
                carRentCount: car.rent_count,
                finalTxCount: txCount,
              });

              return (
                <div key={car.id} className="sh-car-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="sh-car-card-img-wrap">
                    {getImg(car)
                      ? <img className="sh-car-card-img" src={getImg(car)} alt={car.model} />
                      : <div className="sh-car-card-img-placeholder">🚗</div>}
                    <span className="sh-badge rented" style={{
                      background: `${accent}22`, color: accent, border: `1px solid ${accent}44`,
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

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="sh-pagination">
              <span className="sh-page-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
              </span>
              <div className="sh-page-btns">
                <button className="sh-page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} className={`sh-page-btn ${page === i + 1 ? "active" : ""}`}
                    onClick={() => setPage(i + 1)}>{i + 1}</button>
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
