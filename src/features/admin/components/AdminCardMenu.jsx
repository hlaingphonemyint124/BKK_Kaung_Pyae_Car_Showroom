import React from "react";

function AdminCardMenu({
  onClose,
  onEdit,
  onClear,
  onAddMostRented,
  onNotAvailable,
}) {
  return (
    <div className="admin-card-menu">
      <button className="admin-card-menu__close" onClick={onClose}>
        ×
      </button>

      <button className="admin-card-menu__item" onClick={onEdit}>
        ✏️ Edit
      </button>

      <button className="admin-card-menu__item" onClick={onClear}>
        🗑 Clear
      </button>

      <button className="admin-card-menu__item" onClick={onAddMostRented}>
        ➕ Add to Most Rented
      </button>

      <button className="admin-card-menu__item" onClick={onNotAvailable}>
        🚫 Not Available For Now
      </button>
    </div>
  );
}

export default AdminCardMenu;