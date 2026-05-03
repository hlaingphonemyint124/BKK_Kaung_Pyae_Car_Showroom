import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import "../styles/admin.css";
import AdminCarCard from "../components/AdminCarCard";
import useAdminCars from "../hooks/useAdminCars";

const PANEL_ANIMATION_MS = 250;

function AdminCarPage({ mode }) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const {
    filteredCars,
    activeCardId,
    setActiveCardId,
    activeTab,
    setActiveTab,
    clearCar,
    markAsStatus,
    loading,
    error,
  } = useAdminCars(mode);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterMounted, setIsFilterMounted] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

  const tabs =
    mode === "buy"
      ? [
          { label: "All", value: "all" },
          { label: "Available", value: "available" },
          { label: "Reserved", value: "reserved" },
          { label: "Sold", value: "sold" },
        ]
      : [
          { label: "All", value: "all" },
          { label: "Available", value: "available" },
          { label: "Rented", value: "rented" },
          { label: "Not Available", value: "not-available" },
        ];

  const brands = useMemo(() => {
    return [...new Set(filteredCars.map((c) => c.brand || "").filter(Boolean))];
  }, [filteredCars]);

  const displayCars = useMemo(() => {
    return filteredCars.filter((car) => {
      const name = `${car.brand || ""} ${car.model || ""}`
        .trim()
        .toLowerCase();

      const brand = (car.brand || "").toLowerCase();

      const fuel = (
        car.specs?.fuel ||
        car.fuel_type ||
        car.fuel ||
        ""
      ).toLowerCase();

      const transmission = (
        car.specs?.transmission ||
        car.transmission ||
        ""
      ).toLowerCase();

      return (
        (!searchTerm ||
          name.includes(searchTerm.toLowerCase()) ||
          brand.includes(searchTerm.toLowerCase())) &&
        (!selectedBrand || brand === selectedBrand.toLowerCase()) &&
        (!selectedFuel || fuel === selectedFuel.toLowerCase()) &&
        (!selectedTransmission ||
          transmission === selectedTransmission.toLowerCase())
      );
    });
  }, [
    filteredCars,
    searchTerm,
    selectedBrand,
    selectedFuel,
    selectedTransmission,
  ]);

  useEffect(() => {
    let timeoutId;

    if (isFilterOpen) {
      setIsFilterMounted(true);
    } else if (isFilterMounted) {
      timeoutId = setTimeout(() => {
        setIsFilterMounted(false);
      }, PANEL_ANIMATION_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [isFilterOpen, isFilterMounted]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModeClick = () => {
    navigate(mode === "buy" ? "/admin/rental" : "/admin/buy");
  };

  const handleAddCar = () => {
    navigate(`/admin/${mode}/new`);
  };

  const handleReset = () => {
    setSelectedBrand("");
    setSelectedFuel("");
    setSelectedTransmission("");
    setSearchTerm("");
  };

  const handleApply = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="admin-page-section">
      <div className="admin-hero-row">
        <div className="admin-hero-block">
          <h1 className="admin-hero-block__title">Fast, Simple and Easy.</h1>
          <p className="admin-hero-block__subtitle">Shop Online. Pickup Today.</p>
        </div>

        <button type="button" className="admin-add-button" onClick={handleAddCar}>
          + Add New Car
        </button>
      </div>
      
      <div className="ac-controls" ref={overlayRef}>

        {/* ── Row 1: mode toggle + search + filter ── */}
        <div className="ac-top-row">
          <div className="ac-mode-toggle">
            <button
              type="button"
              className={`ac-mode-btn${mode === "buy" ? " ac-mode-btn--active" : ""}`}
              onClick={() => mode !== "buy" && handleModeClick()}
            >Buy</button>
            <button
              type="button"
              className={`ac-mode-btn${mode === "rental" ? " ac-mode-btn--active" : ""}`}
              onClick={() => mode !== "rental" && handleModeClick()}
            >Rental</button>
          </div>

          <div className="ac-search-wrap">
            <Search size={15} className="ac-search-icon" />
            <input
              className="ac-search-input"
              type="text"
              placeholder="Search brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="ac-search-clear" onClick={() => setSearchTerm("")}><X size={13} /></button>
            )}
          </div>

          <button
            type="button"
            className={`ac-filter-btn${isFilterOpen ? " ac-filter-btn--open" : ""}`}
            onClick={() => { setIsFilterMounted(true); setIsFilterOpen(o => !o); }}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* ── Filter dropdown ── */}
        {isFilterMounted && (
          <div className={`ac-filter-panel${isFilterOpen ? " ac-filter-panel--open" : ""}`}>
            <div className="ac-filter-grid">
              <div className="ac-filter-group">
                <label>Brand</label>
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="">All Brands</option>
                  {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
              <div className="ac-filter-group">
                <label>Fuel</label>
                <select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)}>
                  <option value="">All</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                  <option value="plug-in hybrid">Plug-in Hybrid</option>
                </select>
              </div>
              <div className="ac-filter-group">
                <label>Transmission</label>
                <select value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)}>
                  <option value="">All</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
            </div>
            <div className="ac-filter-actions">
              <button type="button" className="ac-filter-reset" onClick={handleReset}>Reset</button>
              <button type="button" className="ac-filter-apply" onClick={handleApply}>Apply</button>
            </div>
          </div>
        )}

        {/* ── Row 2: tabs + count ── */}
        <div className="ac-tabs-row">
          <div className="ac-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`ac-tab${activeTab === tab.value ? " ac-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >{tab.label}</button>
            ))}
          </div>
          <span className="ac-count">{displayCars.length} vehicle{displayCars.length !== 1 ? "s" : ""}</span>
        </div>

      </div>

      {loading && <p className="admin-state-message">Loading cars...</p>}

      {error && (
        <p className="admin-state-message admin-state-message--error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="admin-grid">
          {displayCars.map((car) => (
            <AdminCarCard
              key={car.id}
              car={car}
              isActive={activeCardId === car.id}
              onToggleMenu={() =>
                setActiveCardId(activeCardId === car.id ? null : car.id)
              }
              onCloseMenu={() => setActiveCardId(null)}
              onEdit={() => {
                navigate(`/admin/${mode}/${car.id}`);
              }}
              onViewDetail={() => {
                navigate(`/admin/${mode}/${car.id}`);
              }}
              onClear={() => {
                clearCar(car.id);
                setActiveCardId(null);
              }}
              thirdActionLabel={
                mode === "buy" ? "Mark as Reserved" : "Mark as Rented"
              }
              thirdActionHandler={() =>
                markAsStatus(car.id, mode === "buy" ? "reserved" : "rented")
              }
              fourthActionLabel={
                mode === "buy" ? "Mark as Sold" : "Mark as Unavailable"
              }
              fourthActionHandler={() =>
                markAsStatus(car.id, mode === "buy" ? "sold" : "maintenance")
              }
              showUnavailableOverlay={car.status !== "available"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCarPage;