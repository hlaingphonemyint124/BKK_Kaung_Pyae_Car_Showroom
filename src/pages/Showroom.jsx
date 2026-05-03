import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Showroom.css";

import { getCarsForSale, getCarsForRent } from "../api/showroom.api";
import { useAuth } from "../context/AuthContext";
import { Fuel, Settings2, Search, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const RED_THEME = "#ef2b2d";

const FUEL_COLORS = {
  petrol:           "#f59e0b",
  diesel:           "#78716c",
  hybrid:           "#14b8a6",
  electric:         "#3b82f6",
  "plug-in hybrid": "#8b5cf6",
};

const VALID_SORTS = ["price_asc", "price_desc", "newest"];

export default function Showroom() {
  const { t }    = useLanguage();
  const navigate = useNavigate();
  const [params, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const isAdmin  = user?.role === "admin" || user?.role === "employee";
  const isFirstMount = useRef(true);

  // Initialise state from URL params so links are shareable
  const [mode, setMode]                         = useState(() => params.get("mode") === "rent" ? "rent" : "buy");
  const [searchQuery, setSearchQuery]           = useState(() => params.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cars, setCars]                         = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);
  const [fuelFilter, setFuelFilter]             = useState(() => params.get("fuel") || "all");
  const [transFilter, setTransFilter]           = useState(() => params.get("trans") || "all");
  const [sortOrder, setSortOrder]               = useState(() => {
    const s = params.get("sort");
    return VALID_SORTS.includes(s) ? s : "default";
  });
  const [filtersOpen, setFiltersOpen]           = useState(false);

  useEffect(() => {
    const apiFn = mode === "buy" ? getCarsForSale : getCarsForRent;

    if (isFirstMount.current) {
      // First mount: fetch without wiping URL-seeded filter state
      isFirstMount.current = false;
      setLoading(true);
      setError(null);
      apiFn()
        .then(res => setCars(res.data.cars ?? []))
        .catch(() => { console.warn("Showroom API unavailable."); setCars([]); })
        .finally(() => setLoading(false));
      return;
    }

    // Mode change: reset all filters
    setLoading(true);
    setError(null);
    setSelectedCategory("all");
    setSearchQuery("");
    setFuelFilter("all");
    setTransFilter("all");
    setSortOrder("default");
    apiFn()
      .then(res => setCars(res.data.cars ?? []))
      .catch(() => { console.warn("Showroom API unavailable."); setCars([]); })
      .finally(() => setLoading(false));
  }, [mode]);

  // Sync filter state → URL (replace so back-button still works)
  useEffect(() => {
    const p = new URLSearchParams();
    if (mode !== "buy")          p.set("mode", mode);
    if (searchQuery.trim())      p.set("q",    searchQuery.trim());
    if (sortOrder !== "default") p.set("sort", sortOrder);
    if (fuelFilter !== "all")    p.set("fuel", fuelFilter);
    if (transFilter !== "all")   p.set("trans", transFilter);
    setSearchParams(p, { replace: true });
  }, [mode, searchQuery, sortOrder, fuelFilter, transFilter]);

  const tabs = mode === "buy"
    ? [{ key: "all", label: t("sr_all") }, { key: "new",    label: t("sr_new_arrival") }]
    : [{ key: "all", label: t("sr_all") }, { key: "rented", label: t("sr_most_rented") }];

  const fuelOptions  = useMemo(() =>
    [...new Set(cars.map(c => (c.fuel || c.fuel_type || "").toLowerCase()).filter(Boolean))],
  [cars]);
  const transOptions = useMemo(() =>
    [...new Set(cars.map(c => (c.transmission || "").toLowerCase()).filter(Boolean))],
  [cars]);

  const isNewArrival = (car) => {
    if (!car.created_at) return false;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return new Date(car.created_at) >= cutoff;
  };
  const isMostRented = (car) => Number(car.rent_count ?? car.total_rented ?? 0) > 0;

  const filteredCars = useMemo(() => {
    const getP = (c) => mode === "buy" ? Number(c.sale_price || 0) : Number(c.rent_price_per_day || 0);

    const base = cars.filter((c) => {
      const hasPrice     = mode === "buy" ? c.sale_price != null : c.rent_price_per_day != null;
      const matchesTab   =
        selectedCategory === "all" ||
        (selectedCategory === "new"    && isNewArrival(c)) ||
        (selectedCategory === "rented" && isMostRented(c));
      const matchesSearch = !searchQuery.trim() ||
        `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFuel  = fuelFilter  === "all" || (c.fuel || c.fuel_type || "").toLowerCase() === fuelFilter;
      const matchesTrans = transFilter === "all" || (c.transmission || "").toLowerCase() === transFilter;
      return hasPrice && matchesTab && matchesSearch && matchesFuel && matchesTrans;
    });

    if (sortOrder === "price_asc")  return [...base].sort((a, b) => getP(a) - getP(b));
    if (sortOrder === "price_desc") return [...base].sort((a, b) => getP(b) - getP(a));
    if (sortOrder === "newest")     return [...base].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return base;
  }, [cars, mode, selectedCategory, searchQuery, fuelFilter, transFilter, sortOrder]);

  const activeFilterCount = [
    fuelFilter !== "all",
    transFilter !== "all",
    sortOrder !== "default",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFuelFilter("all");
    setTransFilter("all");
    setSortOrder("default");
  };

  const displayPrice = (car) => {
    if (mode === "buy")
      return car.sale_price ? `${Number(car.sale_price).toLocaleString()} ${car.currency_code || "THB"}` : "—";
    return car.rent_price_per_day
      ? `${Number(car.rent_price_per_day).toLocaleString()} ${car.currency_code || "THB"}/day` : "—";
  };

  const getImage     = (car) => car.images?.[0]?.storage_path || car.img || "/images/placeholder.png";
  const getFuelColor = (car) => FUEL_COLORS[String(car.fuel || car.fuel_type || "").toLowerCase()] || RED_THEME;

  return (
    <div className="sr">
      <div className="sr-inner">

        {/* ── Page Header ── */}
        <div className="sr-header">
          <div>
            <h2 className="sr-title">{t("sr_title")}</h2>
            <p className="sr-subtitle">{t("sr_subtitle")}</p>
          </div>
          {isAdmin && (
            <button
              className="sr-add-btn"
              onClick={() => navigate(mode === "buy" ? "/admin/buy/new" : "/admin/rental/new")}
            >
              {t("sr_add")}
            </button>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="sr-controls-wrap">

          <div className="sr-top-row">
            <div className="sr-mode-toggle">
              <button
                className={`sr-mode-btn ${mode === "buy"  ? "sr-mode-btn--active" : ""}`}
                onClick={() => setMode("buy")}
              >{t("sr_buy")}</button>
              <button
                className={`sr-mode-btn ${mode === "rent" ? "sr-mode-btn--active" : ""}`}
                onClick={() => setMode("rent")}
              >{t("sr_rental")}</button>
            </div>

            <div className="sr-search-wrap">
              <Search size={15} className="sr-search-icon" />
              <input
                className="sr-search-input"
                type="text"
                placeholder={t("sr_search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="sr-search-clear" onClick={() => setSearchQuery("")}>✕</button>
              )}
            </div>

            <button
              className={`sr-filter-btn ${filtersOpen ? "sr-filter-btn--open" : ""} ${activeFilterCount > 0 ? "sr-filter-btn--active" : ""}`}
              onClick={() => setFiltersOpen(o => !o)}
            >
              <SlidersHorizontal size={14} />
              {t("sr_filters")}
              {activeFilterCount > 0 && <span className="sr-filter-badge">{activeFilterCount}</span>}
            </button>
          </div>

          {/* ── Filter Panel ── */}
          {filtersOpen && (
            <div className="sr-filter-panel">

              <div className="sr-filter-group">
                <span className="sr-filter-label">{t("sr_sort")}</span>
                <select
                  className="sr-sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="default">{t("sr_sort_default")}</option>
                  <option value="price_asc">{t("sr_sort_price_low")}</option>
                  <option value="price_desc">{t("sr_sort_price_high")}</option>
                  <option value="newest">{t("sr_sort_newest")}</option>
                </select>
              </div>

              {fuelOptions.length > 0 && (
                <div className="sr-filter-group">
                  <span className="sr-filter-label">{t("sr_fuel")}</span>
                  <div className="sr-filter-chips">
                    <button
                      className={`sr-filter-chip ${fuelFilter === "all" ? "sr-filter-chip--active" : ""}`}
                      onClick={() => setFuelFilter("all")}
                    >{t("sr_all")}</button>
                    {fuelOptions.map(f => (
                      <button
                        key={f}
                        className={`sr-filter-chip ${fuelFilter === f ? "sr-filter-chip--active" : ""}`}
                        onClick={() => setFuelFilter(f)}
                      >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                    ))}
                  </div>
                </div>
              )}

              {transOptions.length > 0 && (
                <div className="sr-filter-group">
                  <span className="sr-filter-label">{t("sr_transmission")}</span>
                  <div className="sr-filter-chips">
                    <button
                      className={`sr-filter-chip ${transFilter === "all" ? "sr-filter-chip--active" : ""}`}
                      onClick={() => setTransFilter("all")}
                    >{t("sr_all")}</button>
                    {transOptions.map(tr => (
                      <button
                        key={tr}
                        className={`sr-filter-chip ${transFilter === tr ? "sr-filter-chip--active" : ""}`}
                        onClick={() => setTransFilter(tr)}
                      >{tr.charAt(0).toUpperCase() + tr.slice(1)}</button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterCount > 0 && (
                <button
                  className="sr-filter-clear-inline"
                  onClick={() => { setFuelFilter("all"); setTransFilter("all"); setSortOrder("default"); }}
                >
                  <X size={12} /> {t("sr_clear_filters")}
                </button>
              )}

            </div>
          )}

          <div className="sr-cats-row">
            {tabs.map(({ key, label }, i) => (
              <React.Fragment key={key}>
                {i > 0 && <span className="sr-tab-divider">|</span>}
                <button
                  className={`sr-cat-chip ${selectedCategory === key ? "sr-cat-chip--active" : ""}`}
                  onClick={() => setSelectedCategory(key)}
                >{label}</button>
              </React.Fragment>
            ))}
            <span className="sr-count">
              {filteredCars.length} {filteredCars.length !== 1 ? t("sr_vehicles") : t("sr_vehicle")}
            </span>
          </div>

        </div>

        {/* ── States ── */}
        {loading && <div className="sr-state">{t("sr_loading")}</div>}
        {!loading && error && <div className="sr-state sr-state--error">{error}</div>}
        {!loading && !error && filteredCars.length === 0 && (
          <div className="sr-empty">
            <div className="sr-empty-icon">🚗</div>
            <h3 className="sr-empty-title">{t("sr_empty_title")}</h3>
            <p className="sr-empty-sub">{t("sr_no_results")}</p>
            <button className="sr-empty-clear btn-secondary" onClick={clearAllFilters}>
              {t("sr_clear_filters")}
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && !error && filteredCars.length > 0 && (
          <div className="sr-grid">
            {filteredCars.map((car) => (
              <div
                className={`sr-card sr-card--${mode}`}
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
              >
                {isAdmin && (
                  <button
                    className="sr-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(mode === "buy" ? `/admin/buy/${car.id}` : `/admin/rental/${car.id}`);
                    }}
                  >✏ Edit</button>
                )}

                <div className="sr-card-img-wrap">
                  <img src={getImage(car)} alt={`${car.brand} ${car.model}`} draggable={false} />
                  <div className="sr-card-img-overlay" />
                  <span className={`sr-badge sr-badge--${mode}`}>
                    {mode === "buy" ? t("sr_for_sale") : t("sr_for_rent")}
                  </span>
                </div>

                <div className="sr-card-body">
                  <p className="sr-card-brand">{car.brand}</p>
                  <h3 className="sr-card-name">{car.model}</h3>

                  <div className="sr-card-specs">
                    <span className="sr-spec-chip">
                      <Fuel size={12} style={{ color: getFuelColor(car), flexShrink: 0 }} />
                      {car.fuel || car.fuel_type || "—"}
                    </span>
                    <span className="sr-spec-chip">
                      <Settings2 size={12} style={{ color: RED_THEME, flexShrink: 0 }} />
                      {car.transmission || "—"}
                    </span>
                  </div>

                  <div className="sr-card-footer">
                    <p className="sr-card-price">{displayPrice(car)}</p>
                    <span className="sr-card-cta">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
