import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isFilterMounted, setIsFilterMounted] = useState(false);
  const [isSearchMounted, setIsSearchMounted] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

  const tabs =
    mode === "buy"
      ? [
          { label: "All",       value: "all"       },
          { label: "Available", value: "available"  },
          { label: "Reserved",  value: "reserved"   },
          { label: "Sold",      value: "sold"       },
        ]
      : [
          { label: "All",           value: "all"           },
          { label: "Available",     value: "available"     },
          { label: "Rented",        value: "rented"        },
          { label: "Not Available", value: "not-available" },
        ];

  const brands = useMemo(() => {
    return [...new Set(filteredCars.map((c) => c.brand || "").filter(Boolean))];
  }, [filteredCars]);

  const displayCars = useMemo(() => {
    return filteredCars.filter((car) => {
      const name = `${car.brand || ""} ${car.model || ""}`.trim().toLowerCase();
      const brand = (car.brand || "").toLowerCase();
      const fuel = (car.specs?.fuel || car.fuel_type || car.fuel || "").toLowerCase();
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
    let timeoutId;

    if (isSearchOpen) {
      setIsSearchMounted(true);
    } else if (isSearchMounted) {
      timeoutId = setTimeout(() => {
        setIsSearchMounted(false);
      }, PANEL_ANIMATION_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [isSearchOpen, isSearchMounted]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setIsFilterOpen(false);
        setIsSearchOpen(false);
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
      <div className="admin-hero-block">
        <h1 className="admin-hero-block__title">Fast, Simple and Easy.</h1>
        <p className="admin-hero-block__subtitle">Shop Online. Pickup Today.</p>
      </div>

      <div className="admin-toolbar-overlay" ref={overlayRef}>
        <AdminFilterBar
          mode={mode === "buy" ? "Buy" : "Rental"}
          onFilterClick={() => {
            if (!isFilterOpen) {
              setIsFilterMounted(true);
            }
            setIsFilterOpen((prev) => !prev);
            setIsSearchOpen(false);
          }}
          onSearchClick={() => {
            if (!isSearchOpen) {
              setIsSearchMounted(true);
            }
            setIsSearchOpen((prev) => !prev);
            setIsFilterOpen(false);
          }}
          onModeClick={handleModeClick}
          isFilterOpen={isFilterOpen}
          isSearchOpen={isSearchOpen}
        />

        {isFilterMounted && (
          <div
            className={`admin-filter-panel admin-overlay-panel ${
              isFilterOpen ? "admin-overlay-panel--visible" : ""
            }`}
          >
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
              <button type="button" onClick={handleReset}>
                Reset
              </button>
              <button type="button" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        )}

        {isSearchMounted && (
          <div
            className={`admin-search-panel admin-overlay-panel ${
              isSearchOpen ? "admin-overlay-panel--visible" : ""
            }`}
          >
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
      {error && (
        <p className="admin-state-message admin-state-message--error">
          {error}
        </p>
      )}

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
              thirdActionLabel={mode === "buy" ? "Mark as Reserved" : "Mark as Rented"}
              thirdActionHandler={() =>
                markAsStatus(car.id, mode === "buy" ? "reserved" : "rented")
              }
              fourthActionLabel={mode === "buy" ? "Mark as Sold" : "Mark as Unavailable"}
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