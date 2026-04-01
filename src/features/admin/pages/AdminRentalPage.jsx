import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import useAdminCars from "../hooks/useAdminCars";

function AdminRentalPage() {
  const navigate = useNavigate();

  const {
    filteredCars,
    activeTab,
    setActiveTab,
    activeCardId,
    setActiveCardId,
    clearCar,
    toggleMostRented,
    toggleAvailable,
  } = useAdminCars("rental");

  const handleAddClick = () => {
    console.log("Open add rental form");
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

  const handleClear = (car) => {
    clearCar(car.id);
    handleCloseMenu();
  };

  const handleAddMostRented = (car) => {
    toggleMostRented(car.id);
    handleCloseMenu();
  };

  const handleNotAvailable = (car) => {
    toggleAvailable(car.id);
    handleCloseMenu();
  };

  return (
    <div className="admin-page-section">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Admin Rental Cars</h2>
        <p className="admin-page-subtitle">
          Manage rental listings, update status, and edit car details.
        </p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-filter-bar">
          <div className="admin-filter-bar__item">Filter</div>
          <div className="admin-filter-bar__item">Rental</div>
          <div className="admin-filter-bar__item">Search</div>
        </div>

        <div className="admin-tabs">
          <div
            className={`admin-tabs__item ${
              activeTab === "all" ? "admin-tabs__item--active" : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </div>

          <div
            className={`admin-tabs__item ${
              activeTab === "most-rented" ? "admin-tabs__item--active" : ""
            }`}
            onClick={() => setActiveTab("most-rented")}
          >
            Most Rented
          </div>

          <div
            className={`admin-tabs__item ${
              activeTab === "not-available" ? "admin-tabs__item--active" : ""
            }`}
            onClick={() => setActiveTab("not-available")}
          >
            Not Available
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <AddCarCard onClick={handleAddClick} />

        {filteredCars.map((car) => (
          <AdminCarCard
            key={car.id}
            car={car}
            isActive={activeCardId === car.id}
            onToggleMenu={() => handleToggleMenu(car.id)}
            onCloseMenu={handleCloseMenu}
            onEdit={() => handleEdit(car)}
            onClear={() => handleClear(car)}
            onAddMostRented={() => handleAddMostRented(car)}
            onNotAvailable={() => handleNotAvailable(car)}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminRentalPage;