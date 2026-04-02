import { useState } from "react";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";
import cars from "../data/mockAdminCars";

function AdminBuyPage() {
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  let buyCars = cars.filter((car) => car.type === "buy");

  if (activeTab === "new-arrivals") {
    buyCars = buyCars.filter((car) => car.status?.isNewArrival);
  }

  if (activeTab === "best-seller") {
    buyCars = buyCars.filter((car) => car.status?.isBestSeller);
  }

  const tabs = [
    { label: "All", value: "all" },
    { label: "New Arrivals", value: "new-arrivals" },
    { label: "Popular Brands", value: "best-seller" },
  ];

  const handleAddCar = () => {
    console.log("Add new buy car");
  };

  const handleToggleMenu = (carId) => {
    setActiveCardId((prev) => (prev === carId ? null : carId));
  };

  const handleCloseMenu = () => {
    setActiveCardId(null);
  };

  const handleEdit = (car) => {
    console.log("Edit buy car:", car);
    handleCloseMenu();
  };

  const handleClear = (car) => {
    console.log("Clear buy car:", car);
    handleCloseMenu();
  };

  const handleAddNewArrivals = (car) => {
    console.log("Add to New Arrivals:", car);
    handleCloseMenu();
  };

  const handleAddBestSeller = (car) => {
    console.log("Add to Best Seller:", car);
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

        {buyCars.map((car) => (
          <AdminCarCard
            key={car.id}
            car={car}
            isActive={activeCardId === car.id}
            onToggleMenu={() => handleToggleMenu(car.id)}
            onCloseMenu={handleCloseMenu}
            onEdit={() => handleEdit(car)}
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