import React from "react";
import { LuFuel, LuSettings2, } from "react-icons/lu";
import AdminCardMenu from "./AdminCardMenu";

function AdminCarCard({
  car,
  isActive,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onViewDetail,
  onClear,
  thirdActionLabel,
  thirdActionHandler,
  fourthActionLabel,
  fourthActionHandler,
  showUnavailableOverlay = true,
}) {
  const imageSrc =
    car.primary_image ||
    car.image ||
    car.images?.find((img) => img.is_primary)?.storage_path ||
    car.images?.[0]?.storage_path ||
    "/images/placeholder-car.jpg";

  const name = `${car.brand || ""} ${car.model || ""}`.trim();

  const isBuyCar = car.sale_price != null;

  const status = car.status || "available";
  const isAvailable = status === "available";

  const fuelLabel =
    car.fuel_type || car.fuel || car.specs?.fuel || "Petrol";

  const transmissionLabel =
    car.transmission || car.specs?.transmission || "Auto";

  const priceLabel = isBuyCar
    ? `${Number(car.sale_price || 0).toLocaleString()} THB`
    : `${Number(car.rent_price_per_day || 0).toLocaleString()} THB/day`;

  return (
    <div className="admin-product-card">
      <div className="admin-product-card__image-wrap" onClick={onToggleMenu}>
        <img
          src={imageSrc}
          alt={name}
          className="admin-product-card__image"
        />

        <div className="admin-product-card__badge">
          {isBuyCar ? "Sale" : "Rent"}
        </div>

        {showUnavailableOverlay && !isAvailable && (
          <div className="admin-product-card__unavailable">
            Not Available
          </div>
        )}
      </div>

      <div className="admin-product-card__body">
        <h3 className="admin-product-card__title">{name}</h3>

        <div className="admin-product-card__features">
          <div className="admin-product-card__feature">
            <span className="admin-product-card__feature-icon admin-product-card__feature-icon--fuel">
              <LuFuel />
            </span>
            <span className="admin-product-card__feature-text">{fuelLabel}</span>
          </div>

          <div className="admin-product-card__feature">
            <span className="admin-product-card__feature-icon">
              <LuSettings2 />
            </span>
            <span className="admin-product-card__feature-text">{transmissionLabel}</span>
          </div>
        </div>

        <div className="admin-product-card__bottom">
          <div className="admin-product-card__price">{priceLabel}</div>

          <button
            className="admin-product-card__detail"
            type="button"
            onClick={onViewDetail}
          >
            view detail →
          </button>
        </div>
      </div>

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