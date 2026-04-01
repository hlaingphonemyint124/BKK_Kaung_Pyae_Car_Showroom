import React from "react";
import AdminCardMenu from "./AdminCardMenu";

function AdminCarCard({
  car,
  isActive,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onClear,
  onAddMostRented,
  onNotAvailable,
}) {
  const imageSrc = car.image || car.images?.[0];

  return (
    <div className="admin-product-card">
      <div className="admin-product-card__image-wrap" onClick={onToggleMenu}>
        <img
          src={imageSrc}
          alt={car.name}
          className="admin-product-card__image"
        />

        <div className="admin-product-card__badge">
          {car.type === "buy" ? "Sale" : "Rent"}
        </div>

        {!car.status?.isAvailable && (
          <div className="admin-product-card__unavailable">
            Sorry! Not Available for now
          </div>
        )}

        {isActive && (
          <div
            className="admin-product-card__menu-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminCardMenu
              onClose={onCloseMenu}
              onEdit={onEdit}
              onClear={onClear}
              onAddMostRented={onAddMostRented}
              onNotAvailable={onNotAvailable}
            />
          </div>
        )}
      </div>

      <div className="admin-product-card__body">
        <h3 className="admin-product-card__title">{car.brand || car.name}</h3>

        <p className="admin-product-card__meta">
          {car.specs?.fuel || "Petrol"},{" "}
          {car.specs?.drive || "2WD"},{" "}
          {car.specs?.doors || "2c"},{" "}
          {car.specs?.seats || 4} seaters....
        </p>

        <div className="admin-product-card__features">
          <div className="admin-product-card__feature">
            <div className="admin-product-card__feature-icon">🔌</div>
            <div className="admin-product-card__feature-text">
              {car.specs?.power || "EV"}
            </div>
          </div>

          <div className="admin-product-card__feature">
            <div className="admin-product-card__feature-icon">H</div>
            <div className="admin-product-card__feature-text">
              {car.specs?.transmission || "Auto"}
            </div>
          </div>
        </div>

        <div className="admin-product-card__bottom">
          <div className="admin-product-card__price">
            {car.type === "buy"
              ? `${car.buy?.price?.toLocaleString()} THB`
              : `${car.rental?.pricePerDay?.toLocaleString()} THB/day`}
          </div>

          <button
            type="button"
            className="admin-product-card__detail"
            onClick={onEdit}
          >
            view detail →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminCarCard;