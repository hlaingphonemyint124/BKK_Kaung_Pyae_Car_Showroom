import React from "react";

function RentalTermsSection({
  lines = [],
  onChange,
  onAddRow,
  onDeleteRow,
  title = "Car Rental Terms and Conditions",
}) {
  return (
    <div className="admin-document-section">
      <div className="admin-document-section__header">
        {title}
      </div>

      <div className="admin-document-section__table">
        <div className="admin-document-section__row header">
          <div className="cell key">No.</div>
          <div className="cell value">Rental Term</div>
          <div className="cell action"></div>
        </div>

        {lines.map((line, index) => (
          <div key={index} className="admin-document-section__row">
            <div className="cell key">{index + 1}</div>

            <input
              className="cell value input"
              value={line}
              placeholder="Enter rental term..."
              onChange={(e) => onChange(index, e.target.value)}
            />

            <button
              type="button"
              className="cell action delete-btn"
              onClick={() => onDeleteRow(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="admin-document-section__add"
        onClick={onAddRow}
      >
        + Add Row
      </button>
    </div>
  );
}

export default RentalTermsSection;