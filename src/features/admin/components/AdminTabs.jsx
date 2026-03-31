import React from "react";

function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <div className="admin-tabs">
      <div
        className={`admin-tab ${activeTab === "all" ? "active" : ""}`}
        onClick={() => setActiveTab("all")}
      >
        All
      </div>

      <div
        className={`admin-tab ${activeTab === "new" ? "active" : ""}`}
        onClick={() => setActiveTab("new")}
      >
        New Arrivals
      </div>

      <div
        className={`admin-tab ${activeTab === "best" ? "active" : ""}`}
        onClick={() => setActiveTab("best")}
      >
        Best Seller
      </div>
    </div>
  );
}

export default AdminTabs;       