import { useEffect, useState } from "react";
import {
  Settings,
  Phone,
  MessageCircle,
  Globe,
  Camera,
  Mail,
  MapPin,
} from "lucide-react";
import { FaViber } from "react-icons/fa";
import {
  getAdminDealerContact,
  updateAdminDealerContact,
} from "../../../user/service/contactService";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HOURS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
});

const DEFAULT_FORM = {
  showroom_name: "BKK Kaung Pyae",
  open_day_from: "Monday",
  open_day_to: "Sunday",
  open_time_from: "8 AM",
  open_time_to: "6 PM",
  status: "open",
  phone_number: "",
  line_contact: "",
  facebook_url: "",
  instagram_url: "",
  gmail: "",
  viber_contact: "",
  wechat_contact: "",
  map_url: "",
};

const CONTACT_FIELDS = [
  {
    key: "phone_number",
    label: "Phone Number",
    Icon: Phone,
    color: "#ef2b2d",
    placeholder: "+66 xx xxx xxxx",
  },
  {
    key: "line_contact",
    label: "Line",
    Icon: MessageCircle,
    color: "#06c755",
    placeholder: "@lineid or Line link",
  },
  {
    key: "facebook_url",
    label: "Facebook",
    Icon: Globe,
    color: "#1877f2",
    placeholder: "https://facebook.com/...",
  },
  {
    key: "instagram_url",
    label: "Instagram",
    Icon: Camera,
    color: "#e4405f",
    placeholder: "https://instagram.com/...",
  },
  {
    key: "gmail",
    label: "Gmail",
    Icon: Mail,
    color: "#ea4335",
    placeholder: "email@gmail.com",
  },
  {
    key: "viber_contact",
    label: "Viber",
    Icon: FaViber,
    color: "#7360f2",
    placeholder: "Viber phone/link",
  },
  {
    key: "map_url",
    label: "Google Map",
    Icon: MapPin,
    color: "#ef2b2d",
    placeholder: "https://maps.google.com/...",
  },
];

function BusinessSettingsSection() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getAdminDealerContact();
        const contact = data.contact || data;

        setForm({
          ...DEFAULT_FORM,
          ...contact,
        });
      } catch (error) {
        console.error("Failed to load business settings:", error);
        setMessage("Failed to load business settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      await updateAdminDealerContact(form);

      setMessage("Business settings updated successfully.");
    } catch (error) {
      console.error("Failed to update business settings:", error);
      setMessage(error.response?.data?.error || "Failed to update settings.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  if (loading) {
    return (
      <div className="dash-panel dash-setting-panel">
        <p className="dash-list-empty">Loading business settings...</p>
      </div>
    );
  }

  return (
    <div className="dash-panel dash-setting-panel">
      <div className="dash-panel__head">
        <div className="dash-panel__head-icon" style={{ color: "#6b7280" }}>
          <Settings size={16} strokeWidth={2.2} />
        </div>

        <span className="dash-panel__head-label">Business Settings</span>

        {message && <span className="dash-saved-badge">{message}</span>}
      </div>

      <input
        className="dash-setting-name"
        value={form.showroom_name}
        onChange={(event) => update("showroom_name", event.target.value)}
        placeholder="Showroom Name"
      />

      <div className="dash-setting-body">
        <div className="dash-setting-col">
          <div className="dash-setting-group">
            <label className="dash-field__label">Open Days</label>

            <div className="dash-days-row">
              <select
                value={form.open_day_from}
                onChange={(event) =>
                  update("open_day_from", event.target.value)
                }
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <span className="dash-days-sep">→</span>

              <select
                value={form.open_day_to}
                onChange={(event) =>
                  update("open_day_to", event.target.value)
                }
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dash-setting-group">
            <label className="dash-field__label">Open Hours</label>

            <div className="dash-days-row">
              <select
                value={form.open_time_from}
                onChange={(event) =>
                  update("open_time_from", event.target.value)
                }
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>

              <span className="dash-days-sep">→</span>

              <select
                value={form.open_time_to}
                onChange={(event) =>
                  update("open_time_to", event.target.value)
                }
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dash-setting-group">
            <label className="dash-field__label">Status</label>

            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div className="dash-setting-divider-v" />

        <div className="dash-setting-col">
          <div className="dash-field__label" style={{ marginBottom: 12 }}>
            Contact Info
          </div>

          {CONTACT_FIELDS.map(({ key, Icon, color, placeholder }) => (
            <div key={key} className="dash-contact-row">
              <div
                className="dash-contact-icon"
                style={{ background: `${color}22`, color }}
              >
                <Icon size={14} />
              </div>

              <input
                type="text"
                value={form[key] || ""}
                placeholder={placeholder}
                onChange={(event) => update(key, event.target.value)}
                className="dash-contact-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="dash-setting-actions">
        <button
          type="button"
          className="dash-setting-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Business Settings"}
        </button>
      </div>
    </div>
  );
}

export default BusinessSettingsSection;