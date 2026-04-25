import { useState } from "react";
import { ChevronDown } from "lucide-react";

function DocumentSection({
  lines = [],
  onChange,
  onAddRow,
  onDeleteRow,
  title = "Car Document Information",
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  addButtonLabel = "+ Add Row",
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
              <div className="cell key">Key</div>
              <div className="cell value">Value</div>
              <div className="cell action"></div>
            </div>

            {lines.map((line, index) => (
              <div key={line.id ?? index} className="admin-document-section__row">
                <input
                  className="cell key input"
                  value={line.key}
                  placeholder={keyPlaceholder}
                  onChange={(e) =>
                    onChange(index, { ...line, key: e.target.value })
                  }
                />
                <input
                  className="cell value input"
                  value={line.value}
                  placeholder={valuePlaceholder}
                  onChange={(e) =>
                    onChange(index, { ...line, value: e.target.value })
                  }
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
            {addButtonLabel}
          </button>
        </>
      )}
    </div>
  );
}

export default DocumentSection;
