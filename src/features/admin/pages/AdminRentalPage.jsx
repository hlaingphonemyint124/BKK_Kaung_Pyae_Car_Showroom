import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";
import useAdminCars from "../hooks/useAdminCars";

function AdminRentalPage() {
  const navigate = useNavigate();

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

  const tabs = [
    { label: "All", value: "all" },
    { label: "Most Rented", value: "most-rented" },
    { label: "Not Available", value: "not-available" },
  ];

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

  return (
    <div className="admin-page-section">
      <div className="admin-hero-block">
        <h1 className="admin-hero-block__title">Fast, Simple and Easy.</h1>
        <p className="admin-hero-block__subtitle">
          Shop Online. Pickup Today. It’s Fast, Simple and Easy.
        </p>
      </div>

      <AdminFilterBar mode="Rental" />
      <AdminTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      <div className="admin-grid">
        <AddCarCard onClick={handleAddCar} />

        {filteredCars.map((car) => (
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