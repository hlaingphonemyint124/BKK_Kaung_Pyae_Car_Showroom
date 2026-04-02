import React from "react";

function AdminCardMenu({
  onClose,
  onEdit,
  onClear,
  thirdActionLabel,
  thirdActionHandler,
  fourthActionLabel,
  fourthActionHandler,
}) {
  return (
    <div className="admin-card-menu">
      <button className="admin-card-menu__close" onClick={onClose}>
        ×
      </button>

      {/* Top Actions */}
      <div className="admin-card-menu__top">
        <button className="admin-card-menu__icon-action" onClick={onEdit}>
          <div className="admin-card-menu__icon-box admin-card-menu__icon-box--edit">
            ✎
          </div>
          <span>Edit</span>
        </button>

        <div className="admin-card-menu__divider" />

        <button className="admin-card-menu__icon-action" onClick={onClear}>
          <div className="admin-card-menu__icon-box admin-card-menu__icon-box--clear">
            🗑
          </div>
          <span>Clear</span>
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="admin-card-menu__list">
        <button className="admin-card-menu__item" onClick={thirdActionHandler}>
          <span className="admin-card-menu__plus">＋</span>
          <span>{thirdActionLabel}</span>
        </button>

        <button className="admin-card-menu__item" onClick={fourthActionHandler}>
          <span className="admin-card-menu__plus">＋</span>
          <span>{fourthActionLabel}</span>
        </button>
      </div>
    </div>
  );
}

export default AdminCardMenu;