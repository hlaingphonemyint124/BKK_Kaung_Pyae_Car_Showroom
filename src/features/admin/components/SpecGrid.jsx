import {
  Fuel,
  Settings2,
  Palette,
  Gauge,
  Disc3,
  Users,
} from "lucide-react";

// Values match DB CHECK constraints (migration 012)
const SPEC_ITEMS = [
  {
    key: "fuel",
    label: "Fuel",
    icon: Fuel,
    type: "select",
    options: [
      { value: "petrol",       label: "Petrol"        },
      { value: "diesel",       label: "Diesel"        },
      { value: "hybrid",       label: "Hybrid"        },
      { value: "electric",     label: "Electric"      },
      { value: "plug-in hybrid", label: "Plug-in Hybrid" },
    ],
  },
  {
    key: "transmission",
    label: "Transmission",
    icon: Settings2,
    type: "select",
    options: [
      { value: "automatic", label: "Automatic" },
      { value: "manual",    label: "Manual"    },
      { value: "cvt",       label: "CVT"       },
    ],
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
    options: [
      { value: "fwd", label: "FWD" },
      { value: "rwd", label: "RWD" },
      { value: "awd", label: "AWD" },
      { value: "4wd", label: "4WD" },
    ],
  },
  {
    key: "seats",
    label: "Seats",
    icon: Users,
    type: "select",
    options: [
      { value: "2", label: "2" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
    ],
  },
];

function SpecGrid({ specs, onChange }) {
  return (
    <div className="admin-spec-grid">
      {SPEC_ITEMS.map((item) => {
        const Icon = item.icon;
        const value = specs[item.key] ?? "";

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
                  {item.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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
