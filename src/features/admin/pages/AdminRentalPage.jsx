import { useState } from "react";
import "../styles/admin.css";
import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";
import cars from "../data/mockAdminCars";

function AdminRentalPage() {
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  let rentalCars = cars.filter((car) => car.type === "rental");

  if (activeTab === "most-rented") {
    rentalCars = rentalCars.filter((car) => car.status?.isMostRented);
  }

  if (activeTab === "not-available") {
    rentalCars = rentalCars.filter((car) => !car.status?.isAvailable);
  }

  const tabs = [
    { label: "All", value: "all" },
    { label: "Most Rented", value: "most-rented" },
    { label: "Not Available", value: "not-available" },
  ];

  const handleAddCar = () => {
    console.log("Add new rental car");
  };

  const handleToggleMenu = (carId) => {
    setActiveCardId((prev) => (prev === carId ? null : carId));
  };

  const handleCloseMenu = () => {
    setActiveCardId(null);
  };

  const handleEdit = (car) => {
    console.log("Edit rental car:", car);
    handleCloseMenu();
  };

  const handleClear = (car) => {
    console.log("Clear rental car:", car);
    handleCloseMenu();
  };

  const handleAddMostRented = (car) => {
    console.log("Add to Most Rented:", car);
    handleCloseMenu();
  };

  const handleAddNotAvailable = (car) => {
    console.log("Add to Not Available Now:", car);
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

        {rentalCars.map((car) => (
          <AdminCarCard
            key={car.id}
            car={car}
            isActive={activeCardId === car.id}
            onToggleMenu={() => handleToggleMenu(car.id)}
            onCloseMenu={handleCloseMenu}
            onEdit={() => handleEdit(car)}
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