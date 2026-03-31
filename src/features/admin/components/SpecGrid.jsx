function SpecGrid({ specs = [] }) {
  return (
    <div className="admin-spec-grid">
      {specs.map((item) => (
        <div className="admin-spec-item" key={item.label}>
          <div className="admin-spec-item__icon">{item.icon}</div>
          <div className="admin-spec-item__label">{item.label}</div>
          <div className="admin-spec-item__value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export default SpecGrid;