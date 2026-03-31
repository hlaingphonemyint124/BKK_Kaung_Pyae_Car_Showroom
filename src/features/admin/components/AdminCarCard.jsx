import React from "react";

function AdminCarCard({ car, onClick }) {
  return (
    <div className="admin-card" onClick={() => onClick(car)}>
      <img src={car.image} alt={car.name} />

      <div className="admin-card-body">
        <div className="admin-card-title">{car.name}</div>
        <div className="admin-card-price">
          {car.price} {car.type === "rental" ? "THB/day" : "THB"}
        </div>
      </div>
    </div>
  );
}

export default AdminCarCard;