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

  const buyCars = cars.filter((car) => car.type === "buy");

  const handleAddCar = () => {
    console.log("Add car");
  };

  const handleToggleMenu = (carId) => {
    setActiveCardId((prev) => (prev === carId ? null : carId));
  };

  const handleCloseMenu = () => {
    setActiveCardId(null);
  };

  const handleEdit = (car) => {
    console.log("Edit", car);
    handleCloseMenu();
  };

  const handleClear = (car) => {
    console.log("Clear", car);
    handleCloseMenu();
  };

  const handleAddMostRented = (car) => {
    console.log("Most rented", car);
    handleCloseMenu();
  };

  const handleNotAvailable = (car) => {
    console.log("Not available", car);
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

      <AdminFilterBar />
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
            onAddMostRented={() => handleAddMostRented(car)}
            onNotAvailable={() => handleNotAvailable(car)}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminBuyPage;