function DocumentSection({ title = "Car Document Information", rows = 8 }) {
  return (
    <>
      <div className="admin-section-button">
        <button className="admin-section-button__inner">{title}</button>
      </div>

      <div className="admin-line-table">
        <div className="admin-line-table__box">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="admin-line-table__row" />
          ))}
        </div>
      </div>
    </>
  );
}

export default DocumentSection;