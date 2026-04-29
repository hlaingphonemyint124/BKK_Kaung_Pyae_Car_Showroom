import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Showroom.css";

import { getCarsForSale, getCarsForRent } from "../api/showroom.api";
import { useAuth } from "../context/AuthContext";
import { Fuel, Settings2 } from "lucide-react";

const RED_THEME = "#ef2b2d";

const FUEL_COLORS = {
  petrol: "#f59e0b",
  diesel: "#78716c",
  hybrid: "#14b8a6",
  electric: "#3b82f6",
  "plug-in hybrid": "#8b5cf6",
};


const CATEGORIES = ["All", "Sedan", "Hatchback", "SUV", "Pickup Truck", "Van / Minivan", "Electric"];

export default function Showroom() {
  const navigate    = useNavigate();
  const [params]    = useSearchParams();
  const { user }    = useAuth();
  const isAdmin     = user?.role === "admin" || user?.role === "employee";

  const [mode, setMode] = useState(() => params.get("mode") === "rent" ? "rent" : "buy");
  const [filterOpen, setFilterOpen]           = useState(false);
  const [modeOpen, setModeOpen]               = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [searchQuery, setSearchQuery]         = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cars, setCars]                       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  const filterRef = useRef();
  const modeRef   = useRef();
  const searchRef = useRef();

  // ── Close dropdowns on outside click ──────────────────────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
      if (modeRef.current   && !modeRef.current.contains(e.target))   setModeOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Fetch cars ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedCategory("All");

    const apiFn = mode === "buy" ? getCarsForSale : getCarsForRent;

    apiFn()
      .then((res) => {
        const data = res.data.cars ?? [];
        console.log("PUBLIC SHOWROOM CARS:", data);
        setCars(data);
      })
      .catch(() => {
        console.warn("Showroom API unavailable.");
        setCars([]);
      })
      .finally(() => setLoading(false));
  }, [mode]);

  // ── Filter by mode price, category + search ───────────────────────────────
  const filteredCars = cars.filter((c) => {
    const hasPrice = mode === "buy" ? c.sale_price != null : c.rent_price_per_day != null;
    const matchesCategory =
      selectedCategory === "All" ||
      (c.type || "").toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    return hasPrice && matchesCategory && matchesSearch;
  });

  // ── Display price ──────────────────────────────────────────────────────────
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

  // ── Image source ───────────────────────────────────────────────────────────
  // ✅ FIXED: backend image field is storage_path not url
  const getImage = (car) =>
    car.images?.[0]?.storage_path || car.img || "/images/placeholder.png";

  return (
    <div className="showroom">
      <div className="showroomInner">

        <h2 className="title">Fast, Simple and Easy.</h2>
        <p className="subtitle">Shop Online. Pickup Today. It's Fast, Simple and Easy.</p>

        {/* ── Admin: Add New Car ── */}
        {isAdmin && (
          <div className="showroom-admin-bar">
            <button
              className="showroom-add-btn"
              onClick={() => navigate(mode === "buy" ? "/admin/buy/new" : "/admin/rental/new")}
            >
              + Add New Car
            </button>
          </div>
        )}

        {/* ── Filter Bar ── */}
        <div className="filterBar">

          <div className="filterItem" ref={filterRef}>
            <div className="filterBtn" onClick={() => setFilterOpen(!filterOpen)}>
              {selectedCategory === "All" ? "Filter" : selectedCategory} ▾
            </div>
            {filterOpen && (
              <div className="dropdown">
                {CATEGORIES.map((cat, i) => (
                  <div
                    key={i}
                    className={`dropdownItem ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => { setSelectedCategory(cat); setFilterOpen(false); }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filterItem" ref={modeRef}>
            <div className="filterBtn" onClick={() => setModeOpen(!modeOpen)}>
              {mode === "buy" ? "Buy" : "Rental"} ▾
            </div>
            {modeOpen && (
              <div className="dropdown">
                <div className="dropdownItem" onClick={() => { setMode("buy");  setModeOpen(false); }}>Buy</div>
                <div className="dropdownItem" onClick={() => { setMode("rent"); setModeOpen(false); }}>Rental</div>
              </div>
            )}
          </div>

          <div className="filterItem searchItem" ref={searchRef}>
            {searchOpen ? (
              <div className="searchInputWrap">
                <input
                  className="searchInput"
                  type="text"
                  autoFocus
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="searchClear"
                  onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="filterBtn" onClick={() => setSearchOpen(true)}>
                Search 🔍
              </div>
            )}
          </div>

        </div>

        {/* ── States ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.6 }}>
            Loading cars...
          </div>
        )}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "red" }}>
            {error}
          </div>
        )}
        {!loading && !error && filteredCars.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.6 }}>
            No cars found.
          </div>
        )}

        {/* ── Cars Grid ── */}
        {!loading && !error && filteredCars.length > 0 && (
          <div className="carsGrid">
            {filteredCars.map((car) => (
              <div
                className={`carCard carCard--${mode}`}
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                style={{ cursor: "pointer" }}
              >
                {isAdmin && (
                  <button
                    className="showroom-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(mode === "buy" ? `/admin/buy/${car.id}` : `/admin/rental/${car.id}`);
                    }}
                  >
                    ✏ Edit
                  </button>
                )}

                <div className={`tag ${mode === "buy" ? "sale" : "rent"}`}>
                  {mode === "buy" ? "Sale" : "Rent"}
                </div>

                <img src={getImage(car)} alt={`${car.brand} ${car.model}`} />

                <div className="cardBody">
                  <h3>{car.brand} {car.model}</h3>
                  <p className="desc">
                    {[(car.fuel || car.fuel_type), (car.drive || car.drive_type), car.engine, car.seats && `${car.seats} seats`]
                      .filter(Boolean)
                      .join(", ") || "Details available on request"}
                  </p>
                  <div className="showroom-specs">
                    <div className="showroom-spec-item">
                      <Fuel
                        className="showroom-spec-icon"
                        size={21}
                        strokeWidth={2.2}
                        style={{
                          color:
                            FUEL_COLORS[String(car.fuel || car.fuel_type || "").toLowerCase()] ||
                            RED_THEME,
                        }}
                      />
                      <span>{car.fuel || car.fuel_type || "—"}</span>
                    </div>

                    <div className="showroom-spec-item">
                      <Settings2
                        className="showroom-spec-icon"
                        size={21}
                        strokeWidth={2.2}
                        style={{ color: RED_THEME }}
                      />
                      <span>{car.transmission || "—"}</span>
                    </div>
                  </div>
                  <div className="bottomRow">
                    <div className="price">{displayPrice(car)}</div>
                    <div className="detail">view detail →</div>
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