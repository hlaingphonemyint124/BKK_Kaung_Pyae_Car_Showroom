import React from "react";

function AddCarCard({ onClick }) {
  return (
    <div className="admin-add-card" onClick={onClick}>
      <div className="admin-add-card__circle">+</div>
      <p className="admin-add-card__text">Add</p>
    </div>
  );
}

export default AddCarCard;