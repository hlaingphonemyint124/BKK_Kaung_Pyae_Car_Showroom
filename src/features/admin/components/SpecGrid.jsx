import {
  Car,
  Fuel,
  Settings2,
  Palette,
  Gauge,
  Disc3,
  Users,
} from "lucide-react";

// Values match DB CHECK constraints (migration 012 + 015)
const SPEC_ITEMS = [
  {
    key: "type",
    label: "Type",
    icon: Car,
    color: "#e60000",
    type: "select",
    options: [
      { value: "Sedan",        label: "Sedan"        },
      { value: "Hatchback",    label: "Hatchback"    },
      { value: "SUV",          label: "SUV"          },
      { value: "Pickup Truck", label: "Pickup Truck" },
      { value: "Van / Minivan",label: "Van / Minivan"},
      { value: "Electric",     label: "Electric"     },
      { value: "Coupe",        label: "Coupe"        },
      { value: "Convertible",  label: "Convertible"  },
    ],
  },
  {
    key: "fuel",
    label: "Fuel",
    icon: Fuel,
    color: "#f59e0b",
    type: "select",
    options: [
      { value: "petrol",          label: "Petrol"         },
      { value: "diesel",          label: "Diesel"         },
      { value: "hybrid",          label: "Hybrid"         },
      { value: "electric",        label: "Electric"       },
      { value: "plug-in hybrid",  label: "Plug-in Hybrid" },
    ],
  },
  {
    key: "transmission",
    label: "Transmission",
    icon: Settings2,
    color: "#3b82f6",
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
    color: "#8b5cf6",
    type: "input",
    placeholder: "White",
  },
  {
    key: "engine",
    label: "Engine",
    icon: Gauge,
    color: "#10b981",
    type: "input",
    placeholder: "1.2L",
  },
  {
    key: "drive",
    label: "Drive",
    icon: Disc3,
    color: "#06b6d4",
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
    color: "#f43f5e",
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

// Fuel value → distinct icon color
const FUEL_COLORS = {
  petrol:          "#f59e0b",
  diesel:          "#78716c",
  hybrid:          "#14b8a6",
  electric:        "#3b82f6",
  "plug-in hybrid":"#8b5cf6",
};

function SpecGrid({ specs, onChange }) {
  return (
    <div className="admin-spec-grid">
      {SPEC_ITEMS.map((item) => {
        const Icon = item.icon;
        const value = specs[item.key] ?? "";

        const iconColor =
          item.key === "fuel" && value
            ? (FUEL_COLORS[value] ?? item.color)
            : item.color;

        return (
          <div key={item.key} className="admin-spec-item">
            <div className="admin-spec-item__icon" style={{ color: iconColor }}>
              <Icon size={22} strokeWidth={2} />
            </div>

            <div className="admin-spec-item__control">
              {item.type === "select" ? (
                <select
                  id={`spec-${item.key}`}
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
                  id={`spec-${item.key}`}
                  className="admin-spec-item__input"
                  type="text"
                  value={value}
                  placeholder={item.placeholder || item.label}
                  onChange={(e) => onChange(item.key, e.target.value)}
                />
              )}
            </div>

            <label htmlFor={`spec-${item.key}`} className="admin-spec-item__label">
              {item.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default SpecGrid;
