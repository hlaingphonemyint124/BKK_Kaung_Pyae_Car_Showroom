import React from "react";

function AdminCardMenu({
  title = "",
  onClose,
  onEdit,
  onClear,
  thirdActionLabel,
  thirdActionHandler,
  fourthActionLabel,
  fourthActionHandler,
  fourthActionIcon = "＋",
}) {
  return (
    <div className="admin-card-menu-panel" onClick={(e) => e.stopPropagation()}>
      <div className="admin-card-menu-panel__header admin-card-menu-panel__header--no-title">
        <button className="admin-card-menu-panel__close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="admin-card-menu-panel__top">
        <button className="admin-card-menu-panel__icon-action" onClick={onEdit}>
          <div className="admin-card-menu-panel__icon-box admin-card-menu-panel__icon-box--edit">
            ✎
          </div>
          <span>Edit</span>
        </button>

        <div className="admin-card-menu-panel__divider" />

        <button className="admin-card-menu-panel__icon-action" onClick={onClear}>
          <div className="admin-card-menu-panel__icon-box admin-card-menu-panel__icon-box--clear">
            🗑
          </div>
          <span>Clear</span>
        </button>
      </div>

      <div className="admin-card-menu-panel__list">
        <button
          className="admin-card-menu-panel__item"
          onClick={thirdActionHandler}
        >
          <span className="admin-card-menu-panel__item-icon">＋</span>
          <span>{thirdActionLabel}</span>
        </button>

        <button
          className="admin-card-menu-panel__item"
          onClick={fourthActionHandler}
        >
          <span className="admin-card-menu-panel__item-icon">
            {fourthActionIcon}
          </span>
          <span>{fourthActionLabel}</span>
        </button>
      </div>
    </div>
  );
}

export default AdminCardMenu;