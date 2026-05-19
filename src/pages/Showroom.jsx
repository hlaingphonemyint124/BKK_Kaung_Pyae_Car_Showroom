import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Showroom.css";
import { getCarsForSale, getCarsForRent } from "../api/showroom.api";
import { useAuth } from "../context/AuthContext";
import { Fuel, Settings2, Search, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function ShowroomParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const COLS = [
      "rgba(220,30,30,",
      "rgba(200,20,20,",
      "rgba(240,60,60,",
      "rgba(180,10,10,",
      "rgba(255,80,50,",
    ];

    const pts = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      r0: Math.random() * 4 + 1,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      a: Math.random() * 0.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.12,
      fl: Math.random() * 0.015 + 0.004,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.a += Math.sin(Date.now() * p.fl) * 0.006;
        p.a = Math.max(0.3, Math.min(0.9, p.a));

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const pct = Math.max(0, Math.min(1, p.y / canvas.height));
        const r = Math.max(0.3, p.r0 * pct);
        const a = p.a * (0.3 + pct * 0.7);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.col}${a.toFixed(2)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="sr-particles" />;
}

const RED_THEME = "#ef2b2d";

const FUEL_COLORS = {
  petrol: "#f59e0b",
  diesel: "#78716c",
  hybrid: "#14b8a6",
  electric: "#3b82f6",
  "plug-in hybrid": "#8b5cf6",
};

const VALID_SORTS = ["price_asc", "price_desc", "newest"];

export default function Showroom() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin" || user?.role === "employee";
  const isFirstMount = useRef(true);

  const [mode, setMode] = useState(() =>
    params.get("mode") === "rent" ? "rent" : "buy"
  );
  const [searchQuery, setSearchQuery] = useState(() => params.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bodyTypeFilter, setBodyTypeFilter] = useState(
    () => params.get("body_type") || "all"
  );
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fuelFilter, setFuelFilter] = useState(
    () => params.get("fuel") || "all"
  );
  const [transFilter, setTransFilter] = useState(
    () => params.get("trans") || "all"
  );
  const [sortOrder, setSortOrder] = useState(() => {
    const s = params.get("sort");
    return VALID_SORTS.includes(s) ? s : "default";
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchCars = useCallback(async (currentMode) => {
    const apiFn = currentMode === "buy" ? getCarsForSale : getCarsForRent;

    try {
      setLoading(true);
      setError(null);

      const res = await apiFn();
      const normalizedCars =
        res?.data?.cars || res?.cars || res?.data || [];

      setCars(normalizedCars);
    } catch (err) {
      console.error("Showroom API unavailable:", err);
      setCars([]);
      setError("Unable to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchCars(mode);
      return;
    }

    setSelectedCategory("all");
    setSearchQuery("");
    setFuelFilter("all");
    setTransFilter("all");
    setSortOrder("default");
    setFiltersOpen(false);

    fetchCars(mode);
  }, [mode, fetchCars]);

  useEffect(() => {
    const p = new URLSearchParams();

    if (mode !== "buy") p.set("mode", mode);
    if (searchQuery.trim()) p.set("q", searchQuery.trim());
    if (sortOrder !== "default") p.set("sort", sortOrder);
    if (fuelFilter !== "all") p.set("fuel", fuelFilter);
    if (transFilter !== "all") p.set("trans", transFilter);
    if (bodyTypeFilter !== "all") {
      p.set("body_type", bodyTypeFilter);
    }

    setSearchParams(p, { replace: true });
  }, [mode, searchQuery, sortOrder, fuelFilter, transFilter, bodyTypeFilter, setSearchParams]);

  const tabs =
    mode === "buy"
      ? [
          { key: "all", label: t("sr_all") },
          { key: "new", label: t("sr_new_arrival") },
        ]
      : [
          { key: "all", label: t("sr_all") },
          { key: "rented", label: t("sr_most_rented") },
        ];

  const fuelOptions = useMemo(
    () => [
      ...new Set(
        cars
          .map((car) => (car.fuel || car.fuel_type || "").toLowerCase())
          .filter(Boolean)
      ),
    ],
    [cars]
  );

  const transOptions = useMemo(
    () => [
      ...new Set(
        cars
          .map((car) => (car.transmission || "").toLowerCase())
          .filter(Boolean)
      ),
    ],
    [cars]
  );

  const isNewArrival = (car) => {
    if (!car.created_at) return false;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    return new Date(car.created_at) >= cutoff;
  };

  const isMostRented = (car) =>
    Number(car.rent_count ?? car.total_rented ?? 0) > 0;

  const filteredCars = useMemo(() => {
    const getPrice = (car) =>
      mode === "buy"
        ? Number(car.sale_price || 0)
        : Number(car.rent_price_per_day || 0);

    const base = cars.filter((car) => {
      const hasPrice =
        mode === "buy"
          ? car.sale_price != null
          : car.rent_price_per_day != null;

      const matchesTab =
        selectedCategory === "all" ||
        (selectedCategory === "new" && isNewArrival(car)) ||
        (selectedCategory === "rented" && isMostRented(car));

      const fullName = `${car.brand || ""} ${car.model || ""}`.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        fullName.includes(searchQuery.trim().toLowerCase());

      const matchesFuel =
        fuelFilter === "all" ||
        (car.fuel || car.fuel_type || "").toLowerCase() === fuelFilter;

      const matchesTrans =
        transFilter === "all" ||
        (car.transmission || "").toLowerCase() === transFilter;

      const matchesBodyType =
        bodyTypeFilter === "all" ||
        (car.body_type || "").toLowerCase() === bodyTypeFilter;

      return (
        hasPrice &&
        matchesTab &&
        matchesSearch &&
        matchesFuel &&
        matchesTrans &&
        matchesBodyType
      );
    });

    if (sortOrder === "price_asc") {
      return [...base].sort((a, b) => getPrice(a) - getPrice(b));
    }

    if (sortOrder === "price_desc") {
      return [...base].sort((a, b) => getPrice(b) - getPrice(a));
    }

    if (sortOrder === "newest") {
      return [...base].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    }

    return base;
  }, [
    cars,
    mode,
    selectedCategory,
    searchQuery,
    fuelFilter,
    transFilter,
    bodyTypeFilter,
    sortOrder,
  ]);

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
    setBodyTypeFilter("all");
    setSortOrder("default");
  };

  const displayPrice = (car) => {
    if (mode === "buy") {
      return car.sale_price
        ? `${Number(car.sale_price).toLocaleString()} ${
            car.currency_code || "THB"
          }`
        : "—";
    }

    return car.rent_price_per_day
      ? `${Number(car.rent_price_per_day).toLocaleString()} ${
          car.currency_code || "THB"
        }/day`
      : "—";
  };

  const getImage = (car) =>
    car.primary_image ||
    car.image ||
    car.images?.find((img) => img.is_primary)?.storage_path ||
    car.images?.find((img) => img.is_primary)?.secure_url ||
    car.images?.[0]?.storage_path ||
    car.images?.[0]?.secure_url ||
    car.img ||
    "/images/placeholder.png";

  const getFuelColor = (car) =>
    FUEL_COLORS[String(car.fuel || car.fuel_type || "").toLowerCase()] ||
    RED_THEME;

  return (
    <div className="sr">
      <ShowroomParticles />

      <div className="sr-inner">
        <div className="sr-header">
          <div>
            <h2 className="sr-title">{t("sr_title")}</h2>
            <p className="sr-subtitle">{t("sr_subtitle")}</p>
          </div>

          {isAdmin && (
            <button
              className="sr-add-btn"
              onClick={() =>
                navigate(mode === "buy" ? "/admin/buy/new" : "/admin/rental/new")
              }
            >
              {t("sr_add")}
            </button>
          )}
        </div>

        <div className="sr-controls-wrap">
          <div className="sr-top-row">
            <div className="sr-mode-toggle">
              <button
                className={`sr-mode-btn ${
                  mode === "buy" ? "sr-mode-btn--active" : ""
                }`}
                onClick={() => setMode("buy")}
              >
                {t("sr_buy")}
              </button>

              <button
                className={`sr-mode-btn ${
                  mode === "rent" ? "sr-mode-btn--active" : ""
                }`}
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
                <button
                  className="sr-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              className={`sr-filter-btn ${
                filtersOpen ? "sr-filter-btn--open" : ""
              } ${
                activeFilterCount > 0 ? "sr-filter-btn--active" : ""
              }`}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal size={14} />
              {t("sr_filters")}
              {activeFilterCount > 0 && (
                <span className="sr-filter-badge">{activeFilterCount}</span>
              )}
            </button>
          </div>

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
                      className={`sr-filter-chip ${
                        fuelFilter === "all" ? "sr-filter-chip--active" : ""
                      }`}
                      onClick={() => setFuelFilter("all")}
                    >
                      {t("sr_all")}
                    </button>

                    {fuelOptions.map((fuel) => (
                      <button
                        key={fuel}
                        className={`sr-filter-chip ${
                          fuelFilter === fuel ? "sr-filter-chip--active" : ""
                        }`}
                        onClick={() => setFuelFilter(fuel)}
                      >
                        {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {transOptions.length > 0 && (
                <div className="sr-filter-group">
                  <span className="sr-filter-label">
                    {t("sr_transmission")}
                  </span>

                  <div className="sr-filter-chips">
                    <button
                      className={`sr-filter-chip ${
                        transFilter === "all" ? "sr-filter-chip--active" : ""
                      }`}
                      onClick={() => setTransFilter("all")}
                    >
                      {t("sr_all")}
                    </button>

                    {transOptions.map((transmission) => (
                      <button
                        key={transmission}
                        className={`sr-filter-chip ${
                          transFilter === transmission
                            ? "sr-filter-chip--active"
                            : ""
                        }`}
                        onClick={() => setTransFilter(transmission)}
                      >
                        {transmission.charAt(0).toUpperCase() +
                          transmission.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterCount > 0 && (
                <button
                  className="sr-filter-clear-inline"
                  onClick={() => {
                    setFuelFilter("all");
                    setTransFilter("all");
                    setBodyTypeFilter("all");
                    setSortOrder("default");
                  }}
                >
                  <X size={12} /> {t("sr_clear_filters")}
                </button>
              )}
            </div>
          )}

          <div className="sr-cats-row">
            {tabs.map(({ key, label }, index) => (
              <React.Fragment key={key}>
                {index > 0 && <span className="sr-tab-divider">|</span>}

                <button
                  className={`sr-cat-chip ${
                    selectedCategory === key ? "sr-cat-chip--active" : ""
                  }`}
                  onClick={() => setSelectedCategory(key)}
                >
                  {label}
                </button>
              </React.Fragment>
            ))}

            <span className="sr-count">
              {filteredCars.length}{" "}
              {filteredCars.length !== 1 ? t("sr_vehicles") : t("sr_vehicle")}
            </span>
          </div>
        </div>

        {loading && <div className="sr-state">{t("sr_loading")}</div>}

        {!loading && error && (
          <div className="sr-state sr-state--error">{error}</div>
        )}

        {!loading && !error && filteredCars.length === 0 && (
          <div className="sr-empty">
            <div className="sr-empty-icon">🚗</div>

            <h3 className="sr-empty-title">{t("sr_empty_title")}</h3>

            <p className="sr-empty-sub">{t("sr_no_results")}</p>

            <button
              className="sr-empty-clear btn-secondary"
              onClick={clearAllFilters}
            >
              {t("sr_clear_filters")}
            </button>
          </div>
        )}

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
                      navigate(
                        mode === "buy"
                          ? `/admin/buy/${car.id}`
                          : `/admin/rental/${car.id}`
                      );
                    }}
                  >
                    ✏ Edit
                  </button>
                )}

                <div className="sr-card-img-wrap">
                  <img
                    src={getImage(car)}
                    alt={`${car.brand || ""} ${car.model || ""}`}
                    draggable={false}
                  />

                  <div className="sr-card-img-overlay" />

                  <span className={`sr-badge sr-badge--${mode}`}>
                    {mode === "buy" ? t("sr_for_sale") : t("sr_for_rent")}
                  </span>

                  {car.status && car.status !== "available" && (
                    <div className="sr-card-status-overlay">
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </div>
                  )}
                </div>

                <div className="sr-card-body">
                  <p className="sr-card-brand">{car.brand}</p>
                  <h3 className="sr-card-name">{car.model}</h3>

                  <div className="sr-card-specs">
                    <div className="sr-spec-badge">
                      <Fuel
                        size={20}
                        className="sr-spec-badge__icon"
                        style={{ color: getFuelColor(car) }}
                      />
                      <span className="sr-spec-badge__label">
                        {car.fuel || car.fuel_type || "—"}
                      </span>
                    </div>

                    <div className="sr-spec-sep" />

                    <div className="sr-spec-badge">
                      <Settings2
                        size={20}
                        className="sr-spec-badge__icon"
                        style={{ color: RED_THEME }}
                      />
                      <span className="sr-spec-badge__label">
                        {car.transmission || "—"}
                      </span>
                    </div>
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