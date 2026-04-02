import React from "react";
import AdminCardMenu from "./AdminCardMenu";

function AdminCarCard({
  car,
  isActive,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onClear,
  thirdActionLabel,
  thirdActionHandler,
  fourthActionLabel,
  fourthActionHandler,
  showUnavailableOverlay = true,
}) {
  const imageSrc = car.image || car.images?.[0];

  return (
    <div className="admin-product-card">
      
      {/* Image */}
      <div className="admin-product-card__image-wrap" onClick={onToggleMenu}>
        <img
          src={imageSrc}
          alt={car.name}
          className="admin-product-card__image"
        />

        {/* Badge */}
        <div className="admin-product-card__badge">
          {car.type === "buy" ? "Sale" : "Rent"}
        </div>

        {/* Optional unavailable overlay */}
        {showUnavailableOverlay && !car.status?.isAvailable && (
          <div className="admin-product-card__unavailable">
            Not Available
          </div>
        )}
      </div>

      {/* Body */}
      <div className="admin-product-card__body">
        <h3 className="admin-product-card__title">{car.name}</h3>

        <p className="admin-product-card__meta">
          {car.specs?.fuel || "Petrol"}, {car.specs?.drive || "2WD"},{" "}
          {car.specs?.doors || "2c"}, {car.specs?.seats || 4} seaters
        </p>

        <div className="admin-product-card__bottom">
          <div className="admin-product-card__price">
            {car.type === "buy"
              ? `${car.buy?.price?.toLocaleString()} THB`
              : `${car.rental?.pricePerDay?.toLocaleString()} THB/day`}
          </div>

          <button className="admin-product-card__detail">
            view detail →
          </button>
        </div>
      </div>

      {/* ✅ FULL CARD OVERLAY MENU (FIXED POSITION) */}
      {isActive && (
        <div
          className="admin-product-card__menu-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <AdminCardMenu
            onClose={onCloseMenu}
            onEdit={onEdit}
            onClear={onClear}
            thirdActionLabel={thirdActionLabel}
            thirdActionHandler={thirdActionHandler}
            fourthActionLabel={fourthActionLabel}
            fourthActionHandler={fourthActionHandler}
            fourthActionIcon="＋"
          />
        </div>
      )}
    </div>
  );
}

export default AdminCarCard;