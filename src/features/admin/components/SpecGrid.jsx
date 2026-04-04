function SpecGrid({ specs, onChange }) {
  const items = [
    { key: "fuel", label: "Fuel", icon: "⛽" },
    { key: "transmission", label: "Transmission", icon: "H" },
    { key: "color", label: "Color", icon: "🎨" },
    { key: "engine", label: "Engine", icon: "🔧" },
    { key: "drive", label: "Drive", icon: "⚙️" },
    { key: "seats", label: "Seats", icon: "👥" },
  ];

  return (
    <div className="admin-spec-grid">
      {items.map((item) => (
        <div key={item.key} className="admin-spec-item">
          <div className="admin-spec-item__icon">{item.icon}</div>

          <input
            className="admin-spec-item__input"
            value={specs[item.key] || ""}
            placeholder={item.label}
            onChange={(e) => onChange(item.key, e.target.value)}
          />

          <div className="admin-spec-item__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default SpecGrid;