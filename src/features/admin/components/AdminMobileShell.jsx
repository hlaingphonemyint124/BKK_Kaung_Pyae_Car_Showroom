import React from "react";
import "../styles/admin.css";

function AdminMobileShell({ children }) {
  return (
    <div className="admin-page">
      <div className="admin-container">{children}</div>
    </div>
  );
}

export default AdminMobileShell;
