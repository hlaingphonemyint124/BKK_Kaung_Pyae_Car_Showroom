import React, { useState } from "react";
import AdminMobileShell from "../components/AdminMobileShell";
import AdminTopBar from "../components/AdminTopBar";
import AdminFilterBar from "../components/AdminFilterBar";
import AdminTabs from "../components/AdminTabs";

import AddCarCard from "../components/AddCarCard";
import AdminCarCard from "../components/AdminCarCard";
import AdminEditMenu from "../components/AdminEditMenu";

import cars from "../data/mockAdminCars";

function AdminBuyPage() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <AdminMobileShell>

      {/* TOP BAR */}
      <AdminTopBar />

      {/* HERO TEXT */}
      <div className="admin-hero">
        <h2>Fast, Simple and Easy.</h2>
        <p>Shop Online. Pickup Today.</p>
      </div>

      {/* FILTER */}
      <AdminFilterBar />

      {/* TABS */}
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* GRID */}
      <div className="admin-grid">
        <AddCarCard onAdd={() => alert("Add car")} />

        {cars.map((car) => (
          <AdminCarCard
            key={car.id}
            car={car}
            onClick={setSelectedCar}
          />
        ))}
      </div>

      {/* POPUP */}
      {selectedCar && (
        <AdminEditMenu
          onClose={() => setSelectedCar(null)}
          onEdit={() => alert("Edit " + selectedCar.name)}
          onDelete={() => alert("Delete " + selectedCar.name)}
        />
      )}

    </AdminMobileShell>
  );
}

export default AdminBuyPage;