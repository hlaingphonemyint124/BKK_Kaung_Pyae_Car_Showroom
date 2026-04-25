import { useState } from "react";
import { ChevronDown } from "lucide-react";

// lines: Array of { id: string|null, text: string }
function RentalTermsSection({
  lines = [],
  onChange,
  onAddRow,
  onDeleteRow,
  title = "Car Rental Terms and Conditions",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="admin-document-section">
      <button
        type="button"
        className="admin-document-section__header admin-document-section__header--toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={`admin-document-section__chevron${isOpen ? " admin-document-section__chevron--open" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="admin-document-section__table">
            <div className="admin-document-section__row header">
              <div className="cell key">No.</div>
              <div className="cell value">Rental Term</div>
              <div className="cell action"></div>
            </div>

            {lines.map((line, index) => (
              <div key={line.id ?? index} className="admin-document-section__row">
                <div className="cell key">{index + 1}</div>
                <input
                  className="cell value input"
                  value={line.text}
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
        </>
      )}
    </div>
  );
}

export default RentalTermsSection;
