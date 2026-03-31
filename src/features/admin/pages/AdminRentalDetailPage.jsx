import { useParams } from "react-router-dom";
import "../styles/admin.css";
import mockAdminCars from "../data/mockAdminCars";
import SpecGrid from "../components/SpecGrid";
import RentalTermsSection from "../components/RentalTermsSection";
import ConfirmBar from "../components/ConfirmBar";

function AdminRentalDetailPage() {
  const { id } = useParams();
  const car = mockAdminCars.find((item) => item.id === id);

  if (!car) return <div>Car not found</div>;

  const specs = [
    { icon: "⛽", label: "Fuel", value: car.specs.fuel },
    { icon: "📅", label: "Year", value: car.year },
    { icon: "🎨", label: "Color", value: car.specs.color },
    { icon: "🏷", label: "Plate", value: car.specs.plate },
    { icon: "⚙", label: "MPG", value: car.specs.mpg },
    { icon: "👥", label: "Seats", value: `${car.specs.seats} Seats` },
  ];

  return (
    <div className="admin-page">
      <div className="admin-mobile-shell">
        <div className="admin-header-bar">
          <div className="admin-brand">
            <div className="admin-brand__title">
              BKK Kaung Pyae
              <br />
              Auto
            </div>
            <div className="admin-top-icons">
              <span>EN</span>
              <span>↔</span>
              <span>☰</span>
            </div>
          </div>
        </div>

        <div className="admin-detail-image">
          <img src={car.image || car.images?.[0]} alt={car.name} />
        </div>

        <div className="admin-detail-dots">
          <span className="admin-detail-dot admin-detail-dot--active" />
          <span className="admin-detail-dot" />
          <span className="admin-detail-dot" />
          <span className="admin-detail-dot" />
          <span className="admin-detail-dot" />
          <span className="admin-detail-dot" />
        </div>

        <div className="admin-info-group">
          <div className="admin-info-box">
            <div className="admin-info-box__label">Name</div>
            <div className="admin-info-box__value">{car.year} {car.name}</div>
          </div>

          <div className="admin-info-box">
            <div className="admin-info-box__label">Price</div>
            <div className="admin-price-box">
              <div className="admin-info-box__value">
                {car.rental?.pricePerDay?.toLocaleString()}
              </div>
              <div className="admin-price-unit">THB/ Day</div>
            </div>
          </div>
        </div>

        <SpecGrid specs={specs} />

        <div className="admin-line-row">
          <div className="admin-line-row__label">Rent for 7-Days</div>
          <div className="admin-line-row__value">
            {car.rental?.price7Days?.toLocaleString()} THB
          </div>
        </div>

        <div className="admin-line-row">
          <div className="admin-line-row__label">Rent for 30-Days</div>
          <div className="admin-line-row__value">
            {car.rental?.price30Days?.toLocaleString()} THB
          </div>
        </div>

        <RentalTermsSection
          termsText={car.rental?.terms}
          rows={7}
        />

        <ConfirmBar
          label="Confirm"
          onClick={() => console.log("Confirm rental detail")}
        />

        <div className="admin-footer">
          <h3 className="admin-footer__title">BKK Kaung Pyae</h3>
          <div className="admin-footer__sub">
            Monday - Sunday <span>9am - 5pm</span>
          </div>

          <div className="admin-footer__section">
            <div className="admin-footer__label">Contact Us</div>
            <div className="admin-footer__row">
              <div className="admin-footer__left">
                <div>📞 +95 9 XXX XXX</div>
                <div>✉ support@example.com</div>
              </div>
              <div className="admin-footer__right">
                <span>🟢</span>
                <span>📍</span>
                <span>🔵</span>
                <span>🟣</span>
              </div>
            </div>
          </div>

          <div className="admin-footer__bottom">
            <span>BKK Kaung Pyae Co.Ltd</span>
            <span>Support ©</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRentalDetailPage;