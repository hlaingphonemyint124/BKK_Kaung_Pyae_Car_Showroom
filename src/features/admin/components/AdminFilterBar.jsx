import React from "react";
import { FaChevronDown, FaSearch, FaExchangeAlt } from "react-icons/fa";
import "../styles/admin.css";

function AdminFilterBar({
  mode,
  onFilterClick,
  onModeClick,
  onSearchClick,
  isFilterOpen,
  isSearchOpen,
}) {
  const nextMode = mode === "Buy" ? "Rental" : "Buy";

  return (
    <div className="admin-filterbar">
      {/* FILTER */}
      <button
        type="button"
        className={`admin-filterbar__item ${
          isFilterOpen ? "admin-filterbar__item--active" : ""
        }`}
        onClick={onFilterClick}
      >
        <span className="admin-filterbar__label">Filter</span>
        <FaChevronDown className="admin-filterbar__icon" />
      </button>

      {/* MODE SWITCH */}
      <button
        type="button"
        className="admin-filterbar__item admin-filterbar__item--mode"
        onClick={onModeClick}
      >
        <span className="admin-filterbar__mode-main">
          <span>{mode}</span>
          <FaExchangeAlt className="admin-filterbar__icon admin-filterbar__icon--mode" />
        </span>
        <span className="admin-filterbar__mode-hint">
          Switch to {nextMode}
        </span>
      </button>

      {/* SEARCH */}
      <button
        type="button"
        className={`admin-filterbar__item ${
          isSearchOpen ? "admin-filterbar__item--active" : ""
        }`}
        onClick={onSearchClick}
      >
        <span className="admin-filterbar__label">Search</span>
        <FaSearch className="admin-filterbar__icon" />
      </button>
    </div>
  );
}

export default AdminFilterBar;