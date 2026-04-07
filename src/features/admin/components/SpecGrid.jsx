import {
  Fuel,
  Settings2,
  Palette,
  Gauge,
  Disc3,
  Users,
} from "lucide-react";

function SpecGrid({ specs, onChange }) {
  const items = [
    {
      key: "fuel",
      label: "Fuel",
      icon: Fuel,
      type: "select",
      options: ["Petrol", "Diesel", "Hybrid", "EV"],
    },
    {
      key: "transmission",
      label: "Transmission",
      icon: Settings2,
      type: "select",
      options: ["Auto", "Manual", "CVT"],
    },
    {
      key: "color",
      label: "Color",
      icon: Palette,
      type: "input",
      placeholder: "White",
    },
    {
      key: "engine",
      label: "Engine",
      icon: Gauge,
      type: "input",
      placeholder: "1.2L",
    },
    {
      key: "drive",
      label: "Drive",
      icon: Disc3,
      type: "select",
      options: ["FWD", "RWD", "AWD", "4WD"],
    },
    {
      key: "seats",
      label: "Seats",
      icon: Users,
      type: "select",
      options: ["2", "4", "5", "7", "8"],
    },
  ];

  return (
    <div className="admin-spec-grid">
      {items.map((item) => {
        const Icon = item.icon;
        const value = specs[item.key] || "";

        return (
          <div key={item.key} className="admin-spec-item">
            <div className="admin-spec-item__icon">
              <Icon size={22} strokeWidth={2} />
            </div>

            <div className="admin-spec-item__control">
              {item.type === "select" ? (
                <select
                  className="admin-spec-item__select"
                  value={value}
                  onChange={(e) => onChange(item.key, e.target.value)}
                >
                  <option value="">Select</option>
                  {item.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="admin-spec-item__input"
                  type="text"
                  value={value}
                  placeholder={item.placeholder || item.label}
                  onChange={(e) => onChange(item.key, e.target.value)}
                />
              )}
            </div>

            <div className="admin-spec-item__label">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export default SpecGrid;