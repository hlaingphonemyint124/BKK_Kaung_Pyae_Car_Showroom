import React from "react";
import "../styles/admin.css";

function AdminMobileShell({ children, pageClass, containerClass }) {
  return (
    <div className={`admin-page${pageClass ? ` ${pageClass}` : ""}`}>
      <div className={`admin-container${containerClass ? ` ${containerClass}` : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default AdminMobileShell;
