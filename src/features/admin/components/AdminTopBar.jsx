import React from "react";

function AdminTopBar() {
  return (
    <div className="admin-topbar">
      <div className="admin-title">BKK Kaung Pyae Auto</div>

      <div style={{ display: "flex", gap: "10px" }}>
        <span>EN 🇬🇧</span>
        <span>☰</span>
      </div>
    </div>
  );
}

export default AdminTopBar;