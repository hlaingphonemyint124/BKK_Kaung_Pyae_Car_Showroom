import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Showroom.css";

import { getCarsForSale, getCarsForRent } from "../api/showroom.api";

// ─── Fallback static cars (shown if API fails) ────────────────────────────────
const FALLBACK_BUY = [
  { id: 1, brand: "BYD",    model: "Atto 3",   images: [], img: "/images/ShopCar/bydAtto3.png",        fuel_type: "EV",     transmission: "Auto",   sale_price: 999999,  currency_code: "THB", type: "Electric"     },
  { id: 2, brand: "Toyota", model: "Fortuner", images: [], img: "/images/ShopCar/toyotaFortuner.webp", fuel_type: "Diesel", transmission: "Manual", sale_price: 999999,  currency_code: "THB", type: "SUV"          },
  { id: 3, brand: "Isuzu",  model: "D-Max",    images: [], img: "/images/ShopCar/isuzuDmax.webp",      fuel_type: "Diesel", transmission: "Manual", sale_price: 999999,  currency_code: "THB", type: "Pickup Truck" },
  { id: 4, brand: "Toyota", model: "Yaris",    images: [], img: "/images/ShopCar/toyotaYaris.webp",    fuel_type: "Petrol", transmission: "Auto",   sale_price: 999999,  currency_code: "THB", type: "Hatchback"    },
];

const FALLBACK_RENT = [
  { id: 5, brand: "BYD",    model: "Atto 3",      images: [], img: "/images/ShopCar/bydAtto3.png",        fuel_type: "EV",     transmission: "Auto",   rent_price_per_day: 728,  currency_code: "THB", type: "Electric"     },
  { id: 6, brand: "Honda",  model: "Civic Type R", images: [], img: "/images/ShopCar/hondaCivicFl5.webp", fuel_type: "Petrol", transmission: "Manual", rent_price_per_day: 1100, currency_code: "THB", type: "Sedan"        },
  { id: 7, brand: "Isuzu",  model: "D-Max",        images: [], img: "/images/ShopCar/isuzuDmax.webp",      fuel_type: "Diesel", transmission: "Manual", rent_price_per_day: 890,  currency_code: "THB", type: "Pickup Truck" },
  { id: 8, brand: "Toyota", model: "Yaris",        images: [], img: "/images/ShopCar/toyotaYaris.webp",    fuel_type: "Petrol", transmission: "Auto",   rent_price_per_day: 900,  currency_code: "THB", type: "Hatchback"    },
];

const CATEGORIES = ["All", "Sedan", "Hatchback", "SUV", "Pickup Truck", "Van / Minivan", "Electric"];

export default function Showroom() {
  const navigate = useNavigate();

  const [mode, setMode]                       = useState("buy");
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
        // ✅ FIXED: backend returns { cars: [...], total: n } not { data: [...] }
        const data = res.data.cars ?? [];
        if (data.length > 0) {
          setCars(data);
        } else {
          setCars(mode === "buy" ? FALLBACK_BUY : FALLBACK_RENT);
        }
      })
      .catch(() => {
        console.warn("Showroom API unavailable — using static fallback.");
        setCars(mode === "buy" ? FALLBACK_BUY : FALLBACK_RENT);
      })
      .finally(() => setLoading(false));
  }, [mode]);

  // ── Filter by category + search ────────────────────────────────────────────
  const filteredCars = cars.filter((c) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (c.type || "").toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
                className="carCard"
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={`tag ${mode === "buy" ? "sale" : "rent"}`}>
                  {mode === "buy" ? "Sale" : "Rent"}
                </div>

                <img src={getImage(car)} alt={`${car.brand} ${car.model}`} />

                <div className="cardBody">
                  <h3>{car.brand} {car.model}</h3>
                  <p className="desc">
                    {[car.fuel_type, car.drive_type, car.engine, car.seats && `${car.seats} seats`]
                      .filter(Boolean)
                      .join(", ") || "Details available on request"}
                  </p>
                  <div className="specs">
                    <div className="fuel">⛽ {car.fuel_type || "—"}</div>
                    <div className="gear">⚙ {car.transmission || "—"}</div>
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