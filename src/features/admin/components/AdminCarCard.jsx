import React from "react";
import { Fuel, Settings2 } from "lucide-react";
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

  const name = `${car.brand || ""} ${car.model || ""}`.trim() || "Unnamed Car";

  const isBuy = car.sale_price != null;
  const isRental = car.rent_price_per_day != null;

  const badgeText = isBuy ? "Sale" : isRental ? "Rent" : "";
  const badgeClass = isBuy
    ? "admin-product-card-badge--sale"
    : isRental
    ? "admin-product-card-badge--rent"
    : "";

  const status = car.status || "available";
  const isUnavailable = ["sold", "rented", "reserved", "maintenance"].includes(status);

  const statusLabelMap = {
    sold: "Sold",
    rented: "Rented",
    reserved: "Reserved",
    maintenance: "Maintenance",
  };

  const fuelLabel = car.fuel || car.fuel_type || car.specs?.fuel || "—";
  const transmissionLabel =
    car.transmission || car.specs?.transmission || "—";
  const driveLabel = car.drive || car.drive_type || car.specs?.drive || "";
  const engineLabel = car.engine || car.specs?.engine || "";
  const seatsLabel = car.seats ? `${car.seats} seats` : "";

  const description =
    [fuelLabel, driveLabel, engineLabel, seatsLabel]
      .filter(Boolean)
      .join(", ") || "Details available on request";

  const currency = car.currency_code || "THB";

  const priceLabel = isBuy
    ? `${Number(car.sale_price || 0).toLocaleString()} ${currency}`
    : `${Number(car.rent_price_per_day || 0).toLocaleString()} ${currency}/day`;

  return (
    <div className="admin-product-card">
      <div className="admin-product-card__image-wrap">
        <img src={imageSrc} alt={name} className="admin-product-card__image" />

        {badgeText && (
          <div className={`admin-product-card-badge ${badgeClass}`}>
            {badgeText}
          </div>
        )}

        <button
          className="admin-product-card__edit-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
        >
          Edit
        </button>

        {showUnavailableOverlay && isUnavailable && (
          <div className="admin-product-card__unavailable">
            {statusLabelMap[status] || "Not Available"}
          </div>
        )}
      </div>

      <div className="admin-product-card__body">
        <h3 className="admin-product-card__title">{name}</h3>
        <p className="admin-product-card__desc">{description}</p>

        <div className="admin-product-card__features">
          <div className="admin-product-card__feature">
            <span className="admin-product-card__feature-icon admin-product-card__feature-icon--fuel">
              <Fuel size={21} strokeWidth={2.2} />
            </span>
            <span className="admin-product-card__feature-text">{fuelLabel}</span>
          </div>

          <div className="admin-product-card__feature">
            <span className="admin-product-card__feature-icon">
              <Settings2 size={21} strokeWidth={2.2} />
            </span>
            <span className="admin-product-card__feature-text">
              {transmissionLabel}
            </span>
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