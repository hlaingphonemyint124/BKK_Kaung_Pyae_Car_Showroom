import React from "react";

function AdminEditMenu({ onClose, onEdit, onDelete }) {
  return (
    <div className="admin-menu-overlay" onClick={onClose}>
      <div className="admin-menu" onClick={(e) => e.stopPropagation()}>
        
        <div className="admin-menu-item" onClick={onEdit}>
          ✏️ Edit
        </div>

        <div className="admin-menu-item" onClick={onDelete}>
          🗑 Clear
        </div>

        <div className="admin-menu-item">
          ➕ Add to Most Rented
        </div>

        <div className="admin-menu-item">
          🚫 Not Available For Now
        </div>

      </div>
    </div>
  );
}

export default AdminEditMenu;