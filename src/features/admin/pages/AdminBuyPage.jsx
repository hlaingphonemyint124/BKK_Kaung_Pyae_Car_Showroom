import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";
import useAdminCars from "../hooks/useAdminCars";

function AdminBuyPage() {
  const navigate = useNavigate();

  const {
    filteredCars,
    activeCardId,
    setActiveCardId,
    activeTab,
    setActiveTab,
    clearCar,
    markNewArrival,
    markBestSeller,
  } = useAdminCars("buy");

  const tabs = [
    { label: "All", value: "all" },
    { label: "New Arrivals", value: "new-arrivals" },
    { label: "Popular Brands", value: "best-seller" },
  ];

  const handleAddCar = () => {
    navigate("/admin/buy/new");
  };

  const handleToggleMenu = (carId) => {
    setActiveCardId((prev) => (prev === carId ? null : carId));
  };

  const handleCloseMenu = () => {
    setActiveCardId(null);
  };

  const handleEdit = (car) => {
    navigate(`/admin/buy/${car.id}`);
    handleCloseMenu();
  };

  const handleViewDetail = (car) => {
    navigate(`/admin/buy/${car.id}`);
  };

  const handleClear = (car) => {
    clearCar(car.id);
    handleCloseMenu();
  };

  const handleAddNewArrivals = (car) => {
    markNewArrival(car.id);
    handleCloseMenu();
  };

  const handleAddBestSeller = (car) => {
    markBestSeller(car.id);
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

      <AdminFilterBar mode="Buy" />
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
            thirdActionLabel="Add to New Arrivals"
            thirdActionHandler={() => handleAddNewArrivals(car)}
            fourthActionLabel="Add to Best Seller"
            fourthActionHandler={() => handleAddBestSeller(car)}
            showUnavailableOverlay={false}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminBuyPage;