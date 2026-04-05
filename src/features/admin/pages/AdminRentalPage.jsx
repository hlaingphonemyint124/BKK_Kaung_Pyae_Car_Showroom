import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";
import useAdminCars from "../hooks/useAdminCars";

function AdminRentalPage() {
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const {
    filteredCars,
    activeCardId,
    setActiveCardId,
    activeTab,
    setActiveTab,
    clearCar,
    markMostRented,
    markNotAvailable,
  } = useAdminCars("rental");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

  const tabs = [
    { label: "All", value: "all" },
    { label: "Most Rented", value: "most-rented" },
    { label: "Not Available", value: "not-available" },
  ];

  const brands = useMemo(() => {
    const values = filteredCars.map((car) => car.brand).filter(Boolean);
    return [...new Set(values)];
  }, [filteredCars]);

  const filteredDisplayCars = useMemo(() => {
    return filteredCars.filter((car) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrand === "" || car.brand === selectedBrand;

      const matchesFuel =
        selectedFuel === "" || car.specs?.fuel === selectedFuel;

      const matchesTransmission =
        selectedTransmission === "" ||
        car.specs?.transmission === selectedTransmission;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission
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
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCar = () => {
    navigate("/admin/rental/new");
  };

  const handleToggleMenu = (carId) => {
    setActiveCardId((prev) => (prev === carId ? null : carId));
  };

  const handleCloseMenu = () => {
    setActiveCardId(null);
  };

  const handleEdit = (car) => {
    navigate(`/admin/rental/${car.id}`);
    handleCloseMenu();
  };

  const handleViewDetail = (car) => {
    navigate(`/admin/rental/${car.id}`);
  };

  const handleClear = (car) => {
    clearCar(car.id);
    handleCloseMenu();
  };

  const handleAddMostRented = (car) => {
    markMostRented(car.id);
    handleCloseMenu();
  };

  const handleAddNotAvailable = (car) => {
    markNotAvailable(car.id);
    handleCloseMenu();
  };

  const handleFilterClick = () => {
    setIsFilterOpen((prev) => !prev);
    setIsSearchOpen(false);
  };

  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
    setIsFilterOpen(false);
  };

  const handleModeClick = () => {
    navigate("/admin/buy");
  };

  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedFuel("");
    setSelectedTransmission("");
    setSearchTerm("");
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="admin-page-section">
      <div className="admin-hero-block">
        <h1 className="admin-hero-block__title">Fast, Simple and Easy.</h1>
        <p className="admin-hero-block__subtitle">
          Shop Online. Pickup Today. It’s Fast, Simple and Easy.
        </p>
      </div>

      <div className="admin-toolbar-overlay" ref={overlayRef}>
        <AdminFilterBar
          mode="Rental"
          onFilterClick={handleFilterClick}
          onModeClick={handleModeClick}
          onSearchClick={handleSearchClick}
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
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
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
              <button type="button" onClick={handleResetFilters}>
                Reset
              </button>
              <button type="button" onClick={handleApplyFilters}>
                Apply
              </button>
            </div>
          </div>
        )}

        {isSearchOpen && (
          <div className="admin-search-panel admin-overlay-panel">
            <input
              type="text"
              placeholder="Search by car name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      <AdminTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      <div className="admin-grid">
        <AddCarCard onClick={handleAddCar} />

        {filteredDisplayCars.map((car) => (
          <AdminCarCard
            key={car.id}
            car={car}
            isActive={activeCardId === car.id}
            onToggleMenu={() => handleToggleMenu(car.id)}
            onCloseMenu={handleCloseMenu}
            onEdit={() => handleEdit(car)}
            onViewDetail={() => handleViewDetail(car)}
            onClear={() => handleClear(car)}
            thirdActionLabel="Add to Most Rented"
            thirdActionHandler={() => handleAddMostRented(car)}
            fourthActionLabel="Add to Not Available Now"
            fourthActionHandler={() => handleAddNotAvailable(car)}
            showUnavailableOverlay={true}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminRentalPage;