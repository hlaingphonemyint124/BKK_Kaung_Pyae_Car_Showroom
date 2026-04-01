function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <div className="admin-tabs-bar">
      <button
        type="button"
        className={`admin-tabs-bar__item ${
          activeTab === "all" ? "admin-tabs-bar__item--active" : ""
        }`}
        onClick={() => setActiveTab("all")}
      >
        All
      </button>

      <button
        type="button"
        className={`admin-tabs-bar__item ${
          activeTab === "new-arrivals" ? "admin-tabs-bar__item--active" : ""
        }`}
        onClick={() => setActiveTab("new-arrivals")}
      >
        New Arrivals
      </button>

      <button
        type="button"
        className={`admin-tabs-bar__item ${
          activeTab === "popular-brands" ? "admin-tabs-bar__item--active" : ""
        }`}
        onClick={() => setActiveTab("popular-brands")}
      >
        Popular Brands
      </button>
    </div>
  );
}

export default AdminTabs;