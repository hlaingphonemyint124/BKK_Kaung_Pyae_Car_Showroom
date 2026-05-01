import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Showroom.css";

import { getCarsForSale, getCarsForRent } from "../api/showroom.api";
import { useAuth } from "../context/AuthContext";
import { Fuel, Settings2, Search } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const RED_THEME = "#ef2b2d";

const FUEL_COLORS = {
  petrol:           "#f59e0b",
  diesel:           "#78716c",
  hybrid:           "#14b8a6",
  electric:         "#3b82f6",
  "plug-in hybrid": "#8b5cf6",
};

export default function Showroom() {
  const { t }       = useLanguage();
  const navigate    = useNavigate();
  const [params]    = useSearchParams();
  const { user }    = useAuth();
  const isAdmin     = user?.role === "admin" || user?.role === "employee";

  const [mode, setMode]                         = useState(() => params.get("mode") === "rent" ? "rent" : "buy");
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cars, setCars]                         = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedCategory("all");
    setSearchQuery("");

    const apiFn = mode === "buy" ? getCarsForSale : getCarsForRent;

    apiFn()
      .then((res) => {
        const data = res.data.cars ?? [];
        setCars(data);
      })
      .catch(() => {
        console.warn("Showroom API unavailable.");
        setCars([]);
      })
      .finally(() => setLoading(false));
  }, [mode]);

  const tabs = mode === "buy"
    ? [{ key: "all", label: t("sr_all") }, { key: "new",    label: t("sr_new_arrival") }]
    : [{ key: "all", label: t("sr_all") }, { key: "rented", label: t("sr_most_rented") }];

  const isNewArrival = (car) => {
    if (!car.created_at) return false;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return new Date(car.created_at) >= cutoff;
  };

  const isMostRented = (car) => Number(car.rent_count ?? car.total_rented ?? 0) > 0;

  const filteredCars = cars.filter((c) => {
    const hasPrice      = mode === "buy" ? c.sale_price != null : c.rent_price_per_day != null;
    const matchesTab    =
      selectedCategory === "all" ||
      (selectedCategory === "new"    && isNewArrival(c)) ||
      (selectedCategory === "rented" && isMostRented(c));
    const matchesSearch = !searchQuery.trim() || `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    return hasPrice && matchesTab && matchesSearch;
  });

  const displayPrice = (car) => {
    if (mode === "buy") {
      return car.sale_price
        ? `${Number(car.sale_price).toLocaleString()} ${car.currency_code || "THB"}`
        : "—";
    }
    return car.rent_price_per_day
      ? `${Number(car.rent_price_per_day).toLocaleString()} ${car.currency_code || "THB"}/day`
      : "—";
  };

  const getImage    = (car) => car.images?.[0]?.storage_path || car.img || "/images/placeholder.png";
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
                className={`sr-mode-btn ${mode === "buy" ? "sr-mode-btn--active" : ""}`}
                onClick={() => setMode("buy")}
              >
                {t("sr_buy")}
              </button>
              <button
                className={`sr-mode-btn ${mode === "rent" ? "sr-mode-btn--active" : ""}`}
                onClick={() => setMode("rent")}
              >
                {t("sr_rental")}
              </button>
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
          </div>

          <div className="sr-cats-row">
            {tabs.map(({ key, label }, i) => (
              <React.Fragment key={key}>
                {i > 0 && <span className="sr-tab-divider">|</span>}
                <button
                  className={`sr-cat-chip ${selectedCategory === key ? "sr-cat-chip--active" : ""}`}
                  onClick={() => setSelectedCategory(key)}
                >
                  {label}
                </button>
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
          <div className="sr-state">{t("sr_no_results")}</div>
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
                  >
                    ✏ Edit
                  </button>
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
                    <span className="sr-card-cta">{t("sr_details")}</span>
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
