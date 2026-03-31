import React from "react";

function AddCarCard({ onAdd }) {
  return (
    <div className="admin-add-card" onClick={onAdd}>
      +
    </div>
  );
}

export default AddCarCard;