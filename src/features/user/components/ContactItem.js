import React from "react";

function ContactItem({ label, icon, value }) {
  return (
    <div className="info-group">
      <label className="info-label">{label}</label>
      <div className="info-row">
        <div className="info-icon-box">{icon}</div>
        <div className="info-value">{value}</div>
      </div>
    </div>
  );
}

export default ContactItem;