import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car, Flag, AlertTriangle, Trophy, Plus, Star, Key, Users,
  Settings, Clock, Phone, MessageCircle, Globe, Camera, Mail,
  ChevronRight, ShoppingBag, TrendingUp,
} from "lucide-react";
import AdminMobileShell from "../components/AdminMobileShell";
import { useAuth } from "../../../context/AuthContext";
import { getAdminCars } from "../services/adminCarService";
import "../styles/admin.css";

/* ── Constants ── */
const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ORDINALS = ["1st","2nd","3rd","4th","5th"];
const DAYS     = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const HOURS    = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
});

const DEFAULT_SETTINGS = {
  openFrom: "Monday", openTo: "Sunday",
  openHour: "8 AM",  closeHour: "6 PM",
  status: "Auto (Open)",
  phone: "", lineId: "", facebook: "", instagram: "", gmail: "",
};

const CONTACT_FIELDS = [
  { key: "phone",     label: "Phone Number", Icon: Phone,         color: "#ef2b2d", placeholder: "+66 xx xxx xxxx" },
  { key: "lineId",    label: "Line ID",      Icon: MessageCircle, color: "#06c755", placeholder: "@lineid"          },
  { key: "facebook",  label: "Facebook",     Icon: Globe,         color: "#1877f2", placeholder: "facebook.com/…"   },
  { key: "instagram", label: "Instagram",    Icon: Camera,        color: "#e4405f", placeholder: "@instagram"       },
  { key: "gmail",     label: "Gmail",        Icon: Mail,          color: "#ea4335", placeholder: "email@gmail.com"  },
];

/* ── Data hook ── */
function useDashboardStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCars()
      .then((data) => {
        const cars = data?.cars || data?.data?.cars || data?.data || data?.rows || [];
        const isUnavailable = (c) =>
          ["rented","sold","maintenance","reserved"].includes(c.status);

        const available   = cars.filter((c) => !isUnavailable(c));
        const unavailable = cars.filter(isUnavailable);

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
          soldCars:          cars.filter((c) => c.status === "sold").slice(0, 5),
          rentedCars:        cars.filter((c) => c.status === "rented").slice(0, 5),
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

/* ── Sub-components ── */

function StatCard({ icon: Icon, iconBg, label, value, sub1, sub2, valueIsText, progress }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-card__top">
        <div className="dash-stat-card__icon" style={{ background: iconBg }}>
          <Icon size={16} strokeWidth={2.2} color="#fff" />
        </div>
        <TrendingUp size={13} className="dash-stat-card__trend" />
      </div>
      <p className={valueIsText ? "dash-stat-card__val--text" : "dash-stat-card__val"}>
        {value}
      </p>
      <p className="dash-stat-card__label">{label}</p>
      {progress !== undefined && (
        <div className="dash-stat-card__progress">
          <div className="dash-stat-card__progress-fill" style={{ width: `${Math.min(progress, 100)}%`, background: iconBg }} />
        </div>
      )}
      {(sub1 || sub2) && (
        <div className="dash-stat-card__subs">
          {sub1 && <span className="dash-stat-card__sub">{sub1}</span>}
          {sub2 && <span className="dash-stat-card__sub">{sub2}</span>}
        </div>
      )}
    </div>
  );
}

function PanelHead({ icon: Icon, label, accent }) {
  return (
    <div className="dash-panel__head">
      <div className="dash-panel__head-icon" style={{ color: accent || "#ef2b2d" }}>
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <span className="dash-panel__head-label">{label}</span>
    </div>
  );
}

function AddCarsSection() {
  const navigate = useNavigate();
  return (
    <div className="dash-panel">
      <PanelHead icon={Plus} label="Quick Actions" />
      <div className="dash-add-grid">
        <button className="dash-add-card dash-add-card--sale" onClick={() => navigate("/admin/buy/new")}>
          <div className="dash-add-card__icon">
            <ShoppingBag size={20} />
          </div>
          <div className="dash-add-card__text">
            <span className="dash-add-card__title">Add For Sale</span>
            <span className="dash-add-card__sub">List a sale car</span>
          </div>
          <ChevronRight size={16} className="dash-add-card__arrow" />
        </button>
        <button className="dash-add-card dash-add-card--rent" onClick={() => navigate("/admin/rental/new")}>
          <div className="dash-add-card__icon">
            <Key size={20} />
          </div>
          <div className="dash-add-card__text">
            <span className="dash-add-card__title">Add For Rental</span>
            <span className="dash-add-card__sub">List a rental car</span>
          </div>
          <ChevronRight size={16} className="dash-add-card__arrow" />
        </button>
      </div>
    </div>
  );
}

function SoldSection({ cars, loading }) {
  const navigate = useNavigate();
  return (
    <div className="dash-panel dash-panel--list">
      <PanelHead icon={Star} label="Recently Sold" accent="#f59e0b" />
      {loading ? (
        <div className="dash-list-empty">Loading…</div>
      ) : cars.length === 0 ? (
        <div className="dash-list-empty">No sold cars yet.</div>
      ) : (
        <div className="dash-rank-list">
          {cars.map((car, i) => (
            <div key={car.id} className="dash-rank-row" onClick={() => navigate(`/admin/buy/${car.id}`)}>
              <span className="dash-rank-num" data-pos={i}>{ORDINALS[i]}</span>
              <div className="dash-rank-info">
                <span className="dash-rank-name">{car.brand} {car.model}</span>
                <span className="dash-rank-meta">{car.year || "—"}</span>
              </div>
              <span className="dash-rank-badge sold">Sold</span>
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
    <div className="dash-panel dash-panel--list">
      <PanelHead icon={Key} label="Currently Rented" accent="#3b82f6" />
      {loading ? (
        <div className="dash-list-empty">Loading…</div>
      ) : cars.length === 0 ? (
        <div className="dash-list-empty">No rented cars yet.</div>
      ) : (
        <div className="dash-rank-list">
          {cars.map((car, i) => (
            <div key={car.id} className="dash-rank-row" onClick={() => navigate(`/admin/rental/${car.id}`)}>
              <span className="dash-rank-num" data-pos={i}>{ORDINALS[i]}</span>
              <div className="dash-rank-info">
                <span className="dash-rank-name">{car.brand} {car.model}</span>
                <span className="dash-rank-meta">
                  {car.rent_price_per_day
                    ? `${Number(car.rent_price_per_day).toLocaleString()} THB/day`
                    : "—"}
                </span>
              </div>
              <span className="dash-rank-badge rent">Active</span>
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
      <PanelHead icon={Users} label="Team & Roles" accent="#8b5cf6" />

      <div className="dash-admin-row">
        <div className="dash-avatar">
          <span>{initials}</span>
        </div>
        <div className="dash-admin-info">
          <div className="dash-admin-name">{user?.name || user?.email || "Admin"}</div>
          {user?.email && <div className="dash-admin-email">{user.email}</div>}
        </div>
        <span className="dash-role-badge dash-role-badge--admin">Admin</span>
      </div>

      <div className="dash-roles-sub">
        <span>Employees</span>
        <button className="dash-roles-add" onClick={() => navigate("/admin/roles")}>
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="dash-emp-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="dash-emp-cell" onClick={() => navigate("/admin/roles")}>
            <div className="dash-emp-avatar">
              <Plus size={14} />
            </div>
            <span>Add</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingSection() {
  const [form, setForm] = useState(() => {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("bizSettings") || "{}") };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    localStorage.setItem("bizSettings", JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="dash-panel">
      <div className="dash-panel__head">
        <div className="dash-panel__head-icon" style={{ color: "#6b7280" }}>
          <Settings size={16} strokeWidth={2.2} />
        </div>
        <span className="dash-panel__head-label">Business Settings</span>
        {saved && <span className="dash-saved-badge">Saved ✓</span>}
      </div>

      <div className="dash-setting-name">BKK Kaung Pyae</div>

      <div className="dash-setting-group">
        <label className="dash-field__label">Open Days</label>
        <div className="dash-days-row">
          <select value={form.openFrom} onChange={(e) => update("openFrom", e.target.value)}>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <span className="dash-days-sep">→</span>
          <select value={form.openTo} onChange={(e) => update("openTo", e.target.value)}>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="dash-setting-group">
        <label className="dash-field__label">Open Hours</label>
        <div className="dash-days-row">
          <select value={form.openHour} onChange={(e) => update("openHour", e.target.value)}>
            {HOURS.map((h) => <option key={h}>{h}</option>)}
          </select>
          <span className="dash-days-sep">→</span>
          <select value={form.closeHour} onChange={(e) => update("closeHour", e.target.value)}>
            {HOURS.map((h) => <option key={h}>{h}</option>)}
          </select>
        </div>
      </div>

      <div className="dash-setting-group">
        <label className="dash-field__label">Status</label>
        <select value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option>Auto (Open)</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
      </div>

      <div className="dash-setting-divider" />

      <div className="dash-field__label" style={{ marginBottom: 10 }}>Contact Info</div>
      {CONTACT_FIELDS.map(({ key, label, Icon, color, placeholder }) => (
        <div key={key} className="dash-contact-row">
          <div className="dash-contact-icon" style={{ background: color + "22", color }}>
            <Icon size={14} strokeWidth={2} />
          </div>
          <input
            type="text"
            value={form[key]}
            placeholder={placeholder}
            onChange={(e) => update(key, e.target.value)}
            className="dash-contact-input"
          />
        </div>
      ))}
    </div>
  );
}

/* ── Page ── */
function AdminDashboardPage() {
  const { stats, loading } = useDashboardStats();
  const { user }           = useAuth();

  const now       = new Date();
  const hour      = now.getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const monthLabel = `${MONTHS[now.getMonth()]}. ${now.getFullYear()}`;
  const dateStr   = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const val       = (n) => (loading ? "—" : (n ?? 0));

  const availPct = stats?.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0;

  const statCards = [
    {
      icon: Car, iconBg: "linear-gradient(135deg,#ef2b2d,#b91c1c)",
      label: "Total Cars",
      value: val(stats?.total),
      sub1: `Sale ${val(stats?.sale)}`,
      sub2: `Rental ${val(stats?.rental)}`,
    },
    {
      icon: Flag, iconBg: "linear-gradient(135deg,#22c55e,#15803d)",
      label: "Available",
      value: val(stats?.available),
      sub1: `Sale ${val(stats?.availableSale)}`,
      sub2: `Rental ${val(stats?.availableRental)}`,
      progress: availPct,
    },
    {
      icon: AlertTriangle, iconBg: "linear-gradient(135deg,#f59e0b,#b45309)",
      label: "Not Available",
      value: val(stats?.unavailable),
      sub1: `Sale ${val(stats?.unavailableSale)}`,
      sub2: `Rental ${val(stats?.unavailableRental)}`,
    },
    {
      icon: Trophy, iconBg: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
      label: "Monthly Score",
      value: monthLabel, valueIsText: true,
      sub1: `Sold ${val(stats?.soldOut)}`,
      sub2: `Rented ${val(stats?.rentCount)}`,
    },
  ];

  return (
    <AdminMobileShell pageClass="dash-page" containerClass="dash-container">
      <div className="dash-content">

        {/* ── HEADER ── */}
        <div className="dash-header">
          <div className="dash-header__left">
            <div className="dash-header__avatar">
              {(user?.name || user?.email || "A")[0].toUpperCase()}
            </div>
            <div>
              <p className="dash-header__greeting">{greeting},</p>
              <h1 className="dash-header__name">
                {user?.name || user?.email?.split("@")[0] || "Admin"}
              </h1>
            </div>
          </div>
          <div className="dash-header__right">
            <div className="dash-date-chip">
              <Clock size={12} />
              <span>{dateStr}</span>
            </div>
            <div className="dash-status-chip">
              <span className="dash-status-dot" />
              Online
            </div>
          </div>
        </div>

        {/* ── STATS GRID ── */}
        <div className="dash-stats-grid">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="dash-main-grid">

          {/* LEFT COLUMN */}
          <div className="dash-col-main">
            <AddCarsSection />
            <div className="dash-lists-row">
              <SoldSection   cars={stats?.soldCars   ?? []} loading={loading} />
              <RentedSection cars={stats?.rentedCars ?? []} loading={loading} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="dash-col-side">
            <RolesSection user={user} />
            <SettingSection />
          </div>

        </div>

      </div>
    </AdminMobileShell>
  );
}

export default AdminDashboardPage;
