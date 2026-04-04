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
      <button
        type="button"
        className={`admin-filterbar__item ${
          isFilterOpen ? "admin-filterbar__item--active" : ""
        }`}
        onClick={onFilterClick}
      >
        <span>Filter</span>
        <FaChevronDown size={11} />
      </button>

      <button
        type="button"
        className="admin-filterbar__item admin-filterbar__item--mode"
        onClick={onModeClick}
      >
        <span>{mode}</span>
        <FaExchangeAlt size={11} />
        <span className="admin-filterbar__mode-hint">
          Switch to {nextMode}
        </span>
      </button>

      <button
        type="button"
        className={`admin-filterbar__item ${
          isSearchOpen ? "admin-filterbar__item--active" : ""
        }`}
        onClick={onSearchClick}
      >
        <span>Search</span>
        <FaSearch size={11} />
      </button>
    </div>
  );
}

export default AdminFilterBar;