import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";
import useAdminCars from "../hooks/useAdminCars";

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
    markNewArrival,
    markBestSeller,
    markMostRented,
    markNotAvailable,
    loading,
    error,
  } = useAdminCars(mode);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

  const tabs =
    mode === "buy"
      ? [
          { label: "All", value: "all" },
          { label: "New Arrivals", value: "new-arrivals" },
          { label: "Popular Brands", value: "best-seller" },
        ]
      : [
          { label: "All", value: "all" },
          { label: "Most Rented", value: "most-rented" },
          { label: "Not Available", value: "not-available" },
        ];

  const brands = useMemo(() => {
    return [...new Set(filteredCars.map((c) => c.brand || "").filter(Boolean))];
  }, [filteredCars]);

  const displayCars = useMemo(() => {
    return filteredCars.filter((car) => {
      const name = car.name?.toLowerCase() || "";
      const brand = car.brand?.toLowerCase() || "";
      const fuel = car.specs?.fuel?.toLowerCase() || "";
      const transmission = car.specs?.transmission?.toLowerCase() || "";

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
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setIsFilterOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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
      <div className="admin-hero-block">
        <h1 className="admin-hero-block__title">Fast, Simple and Easy.</h1>
        <p className="admin-hero-block__subtitle">Shop Online. Pickup Today.</p>
      </div>

      <div className="admin-toolbar-overlay" ref={overlayRef}>
        <AdminFilterBar
          mode={mode === "buy" ? "Buy" : "Rental"}
          onFilterClick={() => {
            setIsFilterOpen((prev) => !prev);
            setIsSearchOpen(false);
          }}
          onSearchClick={() => {
            setIsSearchOpen((prev) => !prev);
            setIsFilterOpen(false);
          }}
          onModeClick={handleModeClick}
          isFilterOpen={isFilterOpen}
          isSearchOpen={isSearchOpen}
        />

        {isFilterOpen && (
          <div className="admin-filter-panel admin-overlay-panel">
            <div className="admin-filter-panel__grid">
              <div className="admin-filter-panel__group">
                <label>Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-filter-panel__group">
                <label>Fuel</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                >
                  <option value="">All Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="EV">EV</option>
                </select>
              </div>

              <div className="admin-filter-panel__group">
                <label>Transmission</label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                >
                  <option value="">All Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Auto">Auto</option>
                </select>
              </div>
            </div>

            <div className="admin-filter-panel__actions">
              <button onClick={handleReset}>Reset</button>
              <button onClick={handleApply}>Apply</button>
            </div>
          </div>
        )}

        {isSearchOpen && (
          <div className="admin-search-panel admin-overlay-panel">
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      <AdminTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {loading && <p className="admin-state-message">Loading cars...</p>}
      {error && <p className="admin-state-message admin-state-message--error">{error}</p>}

      {!loading && !error && (
        <div className="admin-grid">
          <AddCarCard onClick={handleAddCar} />

          {displayCars.map((car) => (
            <AdminCarCard
              key={car.id}
              car={car}
              isActive={activeCardId === car.id}
              onToggleMenu={() =>
                setActiveCardId(activeCardId === car.id ? null : car.id)
              }
              onCloseMenu={() => setActiveCardId(null)}
              onEdit={() => navigate(`/admin/${mode}/${car.id}`)}
              onViewDetail={() => navigate(`/admin/${mode}/${car.id}`)}
              onClear={() => {
                clearCar(car.id);
                setActiveCardId(null);
              }}
              thirdActionLabel={
                mode === "buy" ? "Add to New Arrivals" : "Add to Most Rented"
              }
              thirdActionHandler={() => {
                if (mode === "buy") {
                  markNewArrival?.(car.id);
                } else {
                  markMostRented?.(car.id);
                }
                setActiveCardId(null);
              }}
              fourthActionLabel={
                mode === "buy"
                  ? "Add to Best Seller"
                  : "Add to Not Available Now"
              }
              fourthActionHandler={() => {
                if (mode === "buy") {
                  markBestSeller?.(car.id);
                } else {
                  markNotAvailable?.(car.id);
                }
                setActiveCardId(null);
              }}
              showUnavailableOverlay={mode === "rental"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCarPage;