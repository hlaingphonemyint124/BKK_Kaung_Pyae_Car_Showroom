function DocumentSection({ lines = [], onChange, title = "Car Document Information" }) {
  return (
    <div className="admin-document-section">
      <div className="admin-document-section__header">{title}</div>

      <div className="admin-document-section__table">
        {lines.map((line, index) => (
          <div key={index} className="admin-document-section__row">
            <div className="admin-document-section__cell admin-document-section__cell--left" />
            <input
              className="admin-document-section__cell admin-document-section__input"
              value={line}
              placeholder=""
              onChange={(e) => onChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentSection;