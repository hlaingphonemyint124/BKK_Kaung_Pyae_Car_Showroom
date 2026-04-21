import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../api/cars.api";
import "./CarDetail.css";

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCarById(id)
      .then((res) => setCar(res.data))        // ✅ FIXED: backend returns car directly, not res.data.data
      .catch(() => setError("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;
  if (error || !car) return <div style={{ padding: "40px" }}>{error}</div>;

  return (
    <div className="carDetailWrapper">
      <div className="carDetail">

        {/* IMAGE */}
        <div className="carHero">
          <img
            src={car.images?.[0]?.storage_path || car.img || "/images/placeholder.png"}
            alt={car.model}
          />
        </div>

        {/* CONTENT */}
        <div className="carContent">
          <h1 className="carTitle">{car.year} {car.brand} {car.model}</h1>
          <div className="carPrice">
            {car.sale_price
              ? `${Number(car.sale_price).toLocaleString()} ${car.currency_code || "THB"}`
              : car.rent_price_per_day
              ? `${Number(car.rent_price_per_day).toLocaleString()} ${car.currency_code || "THB"}/day`
              : "Price on request"}
          </div>

          {/* SPEC GRID */}
          <div className="specGrid">

            <div className="specItem">
              <div className="specIcon fuel">⛽</div>
              <p>{car.fuel_type || "—"}</p>
            </div>

            <div className="divider"></div>

            <div className="specItem">
              <div className="specIcon gear">⚙</div>
              <p>{car.transmission || "—"}</p>
            </div>

            <div className="divider"></div>

            <div className="specItem">
              <div className="specIcon color">🎨</div>
              <p>{car.color || "—"}</p>
            </div>

            <div className="specItem">
              <div className="specIcon engine">🔋</div>
              <p>{car.engine || "—"}</p>
            </div>

            <div className="divider"></div>

            <div className="specItem">
              <div className="specIcon drive">🛞</div>
              <p>{car.drive_type || "—"}</p>
            </div>

            <div className="divider"></div>

            <div className="specItem">
              <div className="specIcon seat">👥</div>
              <p>{car.seats ? `${car.seats} Seaters` : "—"}</p>
            </div>

          </div>

          {/* INFO ROWS */}
          <div className="infoRow">
            <span>Mileage</span>
            <span className="highlight">
              {car.mileage_km ? `${Number(car.mileage_km).toLocaleString()} km` : "—"}
            </span>
          </div>
          <div className="infoRow">
            <span>Model Year</span>
            <span className="highlight">{car.year}</span>
          </div>
          <div className="infoRow">
            <span>Status</span>
            <span className="highlight">{car.status}</span>
          </div>

          {/* CONTACT */}
          <div className="contactSection">
            <p>• Interested in this car?</p>
            <button className="contactBtn">Contact Seller →</button>
          </div>

        </div>
      </div>
    </div>
  );
}