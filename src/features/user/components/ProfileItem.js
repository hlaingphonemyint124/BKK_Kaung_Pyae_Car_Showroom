import React from "react";
import { FaEdit } from "react-icons/fa";

function ProfileItem({ label, icon, value }) {
  return (
    <div className="info-group">
      <label className="info-label">{label}</label>
      <div className="info-row">
        <div className="info-icon-box">{icon}</div>
        <div className="info-value editable-value">
          <span>{value}</span>
          <button className="edit-btn" type="button">
            <FaEdit />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileItem;