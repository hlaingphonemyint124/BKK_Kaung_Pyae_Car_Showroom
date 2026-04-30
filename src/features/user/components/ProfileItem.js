import React from "react";
import { FaEdit } from "react-icons/fa";

function ProfileItem({
  label,
  icon,
  value,
  name,
  editing,
  onChange,
  onEditClick,
}) {
  return (
    <div className="info-group">
      <label className="info-label">{label}</label>

      <div className="info-row">
        <div className="info-icon-box">{icon}</div>

        <div className={`info-value editable-value ${editing ? "is-editing" : ""}`}>
          {editing ? (
            <input
              className="profile-edit-input"
              name={name}
              value={value || ""}
              onChange={(e) => onChange(name, e.target.value)}
              autoFocus
            />
          ) : (
            <span>{value || "Not added"}</span>
          )}

          {!editing && (
            <button className="edit-btn" type="button" onClick={onEditClick}>
              <FaEdit />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileItem;