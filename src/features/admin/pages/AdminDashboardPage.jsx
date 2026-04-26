import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Flag,
  AlertTriangle,
  Trophy,
  Plus,
  Star,
  Key,
  Users,
  Settings,
  Clock,
  Phone,
  MessageCircle,
  Globe,
  Camera,
  Mail,
} from "lucide-react";
import AdminMobileShell from "../components/AdminMobileShell";
import { useAuth } from "../../../context/AuthContext";
import { getAdminCars } from "../services/adminCarService";
import "../styles/admin.css";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th"];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
});

const DEFAULT_SETTINGS = {
  openFrom: "Monday",
  openTo: "Sunday",
  openHour: "8 AM",
  closeHour: "6 PM",
  status: "Auto (Open)",
  phone: "",
  lineId: "",
  facebook: "",
  instagram: "",
  gmail: "",
};

function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCars()
      .then((data) => {
        const cars =
          data?.cars || data?.data?.cars || data?.data || data?.rows || [];

        const isUnavailable = (car) =>
          ["rented", "sold", "maintenance", "reserved"].includes(car.status);

        const available   = cars.filter((c) => !isUnavailable(c));
        const unavailable = cars.filter(isUnavailable);
        const soldCars    = cars.filter((c) => c.status === "sold").slice(0, 5);
        const rentedCars  = cars.filter((c) => c.status === "rented").slice(0, 3);

        setStats({
          total:             cars.length,
          sale:              cars.filter((c) => c.sale_price != null).length,
          rental:            cars.filter((c) => c.rent_price_per_day != null).length,
          available:         available.length,
          availableSale:     available.filter((c) => c.sale_price != null).length,
          availableRental:   available.filter((c) => c.rent_price_per_day != null).length,
          unavailable:       unavailable.length,
          unavailableSale:   unavailable.filter((c) => c.sale_price != null).length,
          unavailableRental: unavailable.filter((c) => c.rent_price_per_day != null).length,
          soldOut:           cars.filter((c) => c.status === "sold").length,
          rentCount:         cars.filter((c) => c.status === "rented").length,
          soldCars,
          rentedCars,
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

/* ── Shared sub-components ── */

function StatCard({ icon: Icon, iconColor, label, value, sub1, sub2, valueIsText }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-card__badge" style={{ background: iconColor || "#ef2b2d" }}>
        <Icon size={14} color="#fff" strokeWidth={2.5} />
      </div>
      <p className="dash-stat-card__label">{label}</p>
      <p className={valueIsText ? "dash-stat-card__value--text" : "dash-stat-card__value"}>
        {value}
      </p>
      {sub1 && <p className="dash-stat-card__sub">{sub1}</p>}
      {sub2 && <p className="dash-stat-card__sub">{sub2}</p>}
    </div>
  );
}

function PanelHead({ icon: Icon, label }) {
  return (
    <div className="dash-panel__head">
      <Icon size={15} strokeWidth={2.5} />
      <span>{label}</span>
    </div>
  );
}

/* ── Dashboard sections ── */

function AddCarsSection() {
  const navigate = useNavigate();
  return (
    <div className="dash-panel">
      <PanelHead icon={Plus} label="Add Cars" />
      <div className="dash-add-btns">
        <button className="dash-add-btn" onClick={() => navigate("/admin/buy/new")}>
          + Add For Sale
        </button>
        <button className="dash-add-btn" onClick={() => navigate("/admin/rental/new")}>
          + Add For Rental
        </button>
      </div>
    </div>
  );
}

function SoldSection({ cars, loading }) {
  const navigate = useNavigate();
  return (
    <div className="dash-panel">
      <PanelHead icon={Star} label="Sold" />
      {loading ? (
        <p className="dash-rank-empty">Loading…</p>
      ) : cars.length === 0 ? (
        <p className="dash-rank-empty">No sold cars yet.</p>
      ) : (
        <div className="dash-rank-list">
          {cars.map((car, i) => (
            <div
              key={car.id}
              className="dash-rank-row"
              onClick={() => navigate(`/admin/buy/${car.id}`)}
            >
              <span className="dash-rank-num">{ORDINALS[i]}</span>
              <span className="dash-rank-name">{car.brand} {car.model}</span>
              <span className="dash-rank-right">{car.brand}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RentedSection({ cars, loading }) {
  const navigate = useNavigate();
  return (
    <div className="dash-panel">
      <PanelHead icon={Key} label="Rented" />
      {loading ? (
        <p className="dash-rank-empty">Loading…</p>
      ) : cars.length === 0 ? (
        <p className="dash-rank-empty">No rented cars yet.</p>
      ) : (
        <div className="dash-rank-list">
          {cars.map((car, i) => (
            <div
              key={car.id}
              className="dash-rank-row"
              onClick={() => navigate(`/admin/rental/${car.id}`)}
            >
              <span className="dash-rank-num">{ORDINALS[i]}</span>
              <span className="dash-rank-name">{car.brand} {car.model}</span>
              <span className="dash-rank-right">
                {car.rent_price_per_day
                  ? `${Number(car.rent_price_per_day).toLocaleString()} THB/day`
                  : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RolesSection({ user }) {
  const navigate = useNavigate();
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <div className="dash-panel">
      <PanelHead icon={Users} label="Roles" />

      {/* Admin row */}
      <div className="dash-admin-row">
        <div className="dash-avatar">
          <span style={{ fontSize: 15, fontWeight: 700, color: "#ef2b2d" }}>{initials}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
            {user?.name || user?.email || "Admin"}
          </div>
          {user?.email && (
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{user.email}</div>
          )}
        </div>
        <span className="dash-admin-badge">Admin</span>
      </div>

      {/* Employee sub-section */}
      <div className="dash-roles-sub">
        <span>Employee</span>
        <button className="dash-roles-add" onClick={() => navigate("/admin/roles")}>+</button>
      </div>
      <div className="dash-emp-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="dash-emp-cell">
            <div className="dash-emp-avatar">+</div>
            <span>Add</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CONTACT_FIELDS = [
  { key: "phone",     label: "Phone Number", Icon: Phone,          color: "#ef2b2d", placeholder: "+66 xx xxx xxxx" },
  { key: "lineId",    label: "Line ID",      Icon: MessageCircle,  color: "#06c755", placeholder: "@lineid"         },
  { key: "facebook",  label: "Facebook",     Icon: Globe,          color: "#1877f2", placeholder: "facebook.com/…"  },
  { key: "instagram", label: "Instagram",    Icon: Camera,         color: "#e4405f", placeholder: "@instagram"      },
  { key: "gmail",     label: "Gmail",        Icon: Mail,           color: "#ea4335", placeholder: "email@gmail.com" },
];

function SettingSection() {
  const [form, setForm] = useState(() => {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("bizSettings") || "{}") };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const update = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    localStorage.setItem("bizSettings", JSON.stringify(next));
  };

  return (
    <div className="dash-panel">
      <PanelHead icon={Settings} label="Setting" />
      <div className="dash-setting-title">BKK Kaung Pyae</div>

      {/* Open Days */}
      <div className="dash-field">
        <label className="dash-field__label">Open Days</label>
        <div className="dash-days-row">
          <select value={form.openFrom} onChange={(e) => update("openFrom", e.target.value)}>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <span className="dash-days-sep">to</span>
          <select value={form.openTo} onChange={(e) => update("openTo", e.target.value)}>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Open Hours */}
      <div className="dash-field">
        <label className="dash-field__label">Open Hours</label>
        <div className="dash-days-row">
          <select value={form.openHour} onChange={(e) => update("openHour", e.target.value)}>
            {HOURS.map((h) => <option key={h}>{h}</option>)}
          </select>
          <span className="dash-days-sep">to</span>
          <select value={form.closeHour} onChange={(e) => update("closeHour", e.target.value)}>
            {HOURS.map((h) => <option key={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Status */}
      <div className="dash-field">
        <label className="dash-field__label">Status</label>
        <select value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option>Auto (Open)</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Contact fields */}
      {CONTACT_FIELDS.map(({ key, label, Icon, color, placeholder }) => (
        <div key={key} className="dash-field">
          <label className="dash-field__label">{label}</label>
          <div className="dash-field-row">
            <div className="dash-field-icon" style={{ background: color + "18" }}>
              <Icon size={16} color={color} strokeWidth={2} />
            </div>
            <input
              type="text"
              value={form[key]}
              placeholder={placeholder}
              onChange={(e) => update(key, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ── */

function AdminDashboardPage() {
  const { stats, loading } = useDashboardStats();
  const { user } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const monthLabel = `${MONTHS[now.getMonth()]}. ${now.getFullYear()}`;
  const val = (n) => (loading ? "—" : (n ?? 0));

  const statCards = [
    {
      icon: Car, label: "Total Cars",
      value: val(stats?.total),
      sub1: `Sale – ${val(stats?.sale)}`,
      sub2: `Rental – ${val(stats?.rental)}`,
    },
    {
      icon: Flag, label: "Available",
      value: val(stats?.available),
      sub1: `Sale – ${val(stats?.availableSale)}`,
      sub2: `Rental – ${val(stats?.availableRental)}`,
    },
    {
      icon: AlertTriangle, label: "Not Available",
      value: val(stats?.unavailable),
      sub1: `Sale – ${val(stats?.unavailableSale)}`,
      sub2: `Rental – ${val(stats?.unavailableRental)}`,
    },
    {
      icon: Trophy, iconColor: "#d4a017", label: "Monthly Score",
      value: monthLabel, valueIsText: true,
      sub1: `Sold Out – ${val(stats?.soldOut)}`,
      sub2: `Rent count – ${val(stats?.rentCount)}`,
    },
  ];

  return (
    <AdminMobileShell pageClass="dash-page" containerClass="dash-container">
      <div className="admin-section dash-content">

        {/* HEADER ROW */}
        <div className="dash-header-row">
          <div>
            <h2 className="dash-title">Admin Dashboard</h2>
            <p className="dash-subtitle">
              Welcome back, {user?.name || user?.email || "Admin"}
            </p>
          </div>
          <div className="dash-header-meta">
            <Clock size={13} />
            <span>{now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="dash-stats-grid">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* CONTENT PANELS */}
        <div className="dash-sections">
          <AddCarsSection />
          <SoldSection   cars={stats?.soldCars   ?? []} loading={loading} />
          <RentedSection cars={stats?.rentedCars ?? []} loading={loading} />
          <RolesSection  user={user} />
          <SettingSection />
        </div>

      </div>
    </AdminMobileShell>
  );
}

export default AdminDashboardPage;
