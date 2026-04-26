import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fuel, Settings2, Palette, Gauge, Disc3, Users } from "lucide-react";
import { getCarById } from "../api/cars.api";
import "./CarDetail.css";

// Fuel value → icon color (same as admin SpecGrid)
const FUEL_COLORS = {
  petrol:           "#f59e0b",
  diesel:           "#78716c",
  hybrid:           "#14b8a6",
  electric:         "#3b82f6",
  "plug-in hybrid": "#8b5cf6",
  // fallback for old uppercase values
  Petrol:  "#f59e0b",
  Diesel:  "#78716c",
  Hybrid:  "#14b8a6",
  EV:      "#3b82f6",
};

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
    getCarById(id)
      .then((res) => setCar(res.data))
      .catch(() => setError("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="cd-loading">Loading...</div>;
  if (error || !car) return <div className="cd-loading">{error || "Car not found"}</div>;

  const images =
    car.images?.length > 0
      ? car.images.map((img) => img.storage_path)
      : [car.img || "/images/placeholder.png"];

  const fuel  = car.fuel  || car.fuel_type  || "";
  const drive = car.drive || car.drive_type || "";
  const isRental = !!car.rent_price_per_day && !car.sale_price;

  const specs = [
    { key: "fuel",         Icon: Fuel,      color: FUEL_COLORS[fuel] ?? "#f59e0b", label: "Fuel",         value: fuel  || "—" },
    { key: "transmission", Icon: Settings2, color: "#3b82f6",                      label: "Transmission", value: car.transmission || "—" },
    { key: "color",        Icon: Palette,   color: "#8b5cf6",                      label: "Color",        value: car.color || "—" },
    { key: "engine",       Icon: Gauge,     color: "#10b981",                      label: "Engine",       value: car.engine || "—" },
    { key: "drive",        Icon: Disc3,     color: "#06b6d4",                      label: "Drive",        value: drive || "—" },
    { key: "seats",        Icon: Users,     color: "#f43f5e",                      label: "Seats",        value: car.seats ? `${car.seats} Seaters` : "—" },
  ];

  const dailyPrice = isRental ? Number(car.rent_price_per_day) || 0 : 0;
  const currency   = car.currency_code || "THB";

  const infoRows = [
    { label: "Mileage",    value: car.mileage_km ? `${Number(car.mileage_km).toLocaleString()} km` : "—" },
    { label: "Model Year", value: car.year || "—" },
    { label: "Status",     value: car.status || "—" },
    ...(car.vin ? [{ label: "VIN", value: car.vin }] : []),
    ...(isRental && dailyPrice ? [
      { label: "7-Day Price (5% off)",   value: `${Math.round(dailyPrice * 7  * 0.95).toLocaleString()} ${currency}`, highlight: true },
      { label: "30-Day Price (10% off)", value: `${Math.round(dailyPrice * 30 * 0.90).toLocaleString()} ${currency}`, highlight: true },
    ] : []),
    ...(isRental && car.deposit ? [
      { label: "Deposit", value: `${Number(car.deposit).toLocaleString()} ${currency}` },
    ] : []),
  ];

  return (
    <div className="cd-wrapper">
      <div className="cd-shell">

        {/* ── LEFT COLUMN ── */}
        <div className="cd-left">

          {/* Media gallery */}
          <div className="cd-panel cd-panel--media">
            <div className="cd-main-img">
              <img src={images[activeImg]} alt={`${car.brand} ${car.model}`} />
              {(car.status === "sold" || car.status === "rented") && (
                <div className="cd-status-badge">{car.status}</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="cd-thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`cd-thumb${i === activeImg ? " cd-thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name + Price */}
          <div className="cd-panel">
            <p className="cd-section-label">{isRental ? "Rental Car" : "For Sale"}</p>
            <h1 className="cd-title">{car.year} {car.brand} {car.model}</h1>
            <div className="cd-price-row">
              <span className="cd-price">
                {car.sale_price
                  ? Number(car.sale_price).toLocaleString()
                  : Number(car.rent_price_per_day).toLocaleString()}
              </span>
              <span className="cd-currency">
                {car.currency_code || "THB"}{isRental ? " / day" : ""}
              </span>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="cd-right">

          {/* Spec grid */}
          <div className="cd-panel">
            <p className="cd-section-label">Specifications</p>
            <div className="cd-spec-grid">
              {specs.map(({ key, Icon, color, label, value }) => (
                <div key={key} className="cd-spec-item">
                  <div className="cd-spec-icon" style={{ color }}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <div className="cd-spec-value">{value}</div>
                  <div className="cd-spec-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info rows */}
          <div className="cd-panel">
            <p className="cd-section-label">Details</p>
            {infoRows.map(({ label, value, highlight }) => (
              <div key={label} className="cd-info-row">
                <span className="cd-info-label">{label}</span>
                <span className={`cd-info-value${highlight ? " cd-info-value--highlight" : ""}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="cd-panel cd-panel--contact">
            <p className="cd-contact-text">Interested in this car? Get in touch with us.</p>
            <button className="cd-contact-btn" onClick={() => navigate("/contact")}>
              Contact Us →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
