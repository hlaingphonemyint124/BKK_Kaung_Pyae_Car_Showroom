import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AdminCarGrid from "../components/AdminCarGrid";
import AdminEditMenu from "../components/AdminEditMenu";
import useAdminCars from "../hooks/useAdminCars";

function AdminRentalPage() {
  const navigate = useNavigate();
  const {
    filteredCars,
    activeTab,
    setActiveTab,
    selectedCar,
    isMenuOpen,
    openMenu,
    closeMenu,
    clearCar,
    toggleMostRented,
    toggleAvailable,
  } = useAdminCars("rental");

  const handleAddClick = () => {
    console.log("Open add rental form");
  };

  const handleEdit = (car) => {
    navigate(`/admin/rental/${car.id}`);
    closeMenu();
  };

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

        <div className="admin-hero">
          <h1 className="admin-hero__title">Fast, Simple and Easy.</h1>
          <p className="admin-hero__subtitle">
            Shop Online. Pickup Today. It’s Fast, Simple and Easy.
          </p>
        </div>

        <div className="admin-filter-bar">
          <div className="admin-filter-bar__item">Filter</div>
          <div className="admin-filter-bar__item">Rental</div>
          <div className="admin-filter-bar__item">Search</div>
        </div>

        <div className="admin-tabs">
          <div
            className={`admin-tabs__item ${activeTab === "all" ? "admin-tabs__item--active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </div>
          <div
            className={`admin-tabs__item ${activeTab === "most-rented" ? "admin-tabs__item--active" : ""}`}
            onClick={() => setActiveTab("most-rented")}
          >
            Most Rented
          </div>
        </div>

        <AdminCarGrid
          cars={filteredCars}
          onAddClick={handleAddClick}
          onCardClick={openMenu}
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

      {isMenuOpen && (
        <AdminEditMenu
          car={selectedCar}
          onClose={closeMenu}
          onEdit={handleEdit}
          onClear={clearCar}
          onToggleMostRented={toggleMostRented}
          onToggleAvailable={toggleAvailable}
        />
      )}
    </div>
  );
}

export default AdminRentalPage;