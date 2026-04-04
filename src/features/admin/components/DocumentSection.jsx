import React from "react";

function DocumentSection({
  lines = [],
  onChange,
  onAddRow,
  onDeleteRow,
  title = "Car Document Information",
}) {
  return (
    <div className="admin-document-section">
      {/* HEADER */}
      <div className="admin-document-section__header">
        {title}
      </div>

      {/* TABLE */}
      <div className="admin-document-section__table">

        {/* TABLE HEAD */}
        <div className="admin-document-section__row header">
          <div className="cell key">Key</div>
          <div className="cell value">Value</div>
          <div className="cell action"></div>
        </div>

        {/* ROWS */}
        {lines.map((line, index) => (
          <div key={index} className="admin-document-section__row">
            
            {/* KEY */}
            <input
              className="cell key input"
              value={line.key}
              placeholder="Key"
              onChange={(e) =>
                onChange(index, {
                  ...line,
                  key: e.target.value,
                })
              }
            />

            {/* VALUE */}
            <input
              className="cell value input"
              value={line.value}
              placeholder="Value"
              onChange={(e) =>
                onChange(index, {
                  ...line,
                  value: e.target.value,
                })
              }
            />

            {/* DELETE */}
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

      {/* ADD BUTTON */}
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

export default DocumentSection;