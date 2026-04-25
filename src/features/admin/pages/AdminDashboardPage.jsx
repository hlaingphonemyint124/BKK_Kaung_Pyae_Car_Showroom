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
  Download,
  BarChart2,
  Clock,
} from "lucide-react";
import AdminMobileShell from "../components/AdminMobileShell";
import { useAuth } from "../../../context/AuthContext";
import { getAdminCars } from "../services/adminCarService";
import "../styles/admin.css";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

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

        const available = cars.filter((c) => !isUnavailable(c));
        const unavailable = cars.filter(isUnavailable);

        setStats({
          total: cars.length,
          sale: cars.filter((c) => c.sale_price != null).length,
          rental: cars.filter((c) => c.rent_price_per_day != null).length,
          available: available.length,
          availableSale: available.filter((c) => c.sale_price != null).length,
          availableRental: available.filter((c) => c.rent_price_per_day != null).length,
          unavailable: unavailable.length,
          unavailableSale: unavailable.filter((c) => c.sale_price != null).length,
          unavailableRental: unavailable.filter((c) => c.rent_price_per_day != null).length,
          soldOut: cars.filter((c) => c.status === "sold").length,
          rentCount: cars.filter((c) => c.status === "rented").length,
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

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

function NavButton({ icon: Icon, label, onClick }) {
  return (
    <button className="dash-nav-btn" onClick={onClick}>
      <Icon size={16} strokeWidth={2.5} />
      <span>{label}</span>
      <Download size={14} className="dash-nav-btn__dl" />
    </button>
  );
}

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

  const navActions = [
    { icon: Plus,     label: "Add Cars",    onClick: () => navigate("/admin/buy/new") },
    { icon: Star,     label: "Best Seller", onClick: () => navigate("/admin/buy")     },
    { icon: Key,      label: "Most Rented", onClick: () => navigate("/admin/rental")  },
    { icon: Users,    label: "Roles",       onClick: () => navigate("/admin/roles")   },
    { icon: Settings, label: "Setting",     onClick: () => navigate("/admin/settings")},
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

        {/* BOTTOM SECTION — two columns on desktop */}
        <div className="dash-bottom">

          {/* QUICK ACTIONS */}
          <div className="dash-panel">
            <div className="dash-panel__head">
              <BarChart2 size={15} strokeWidth={2.5} />
              <span>Quick Actions</span>
            </div>
            <div className="dash-nav">
              {navActions.map(({ icon, label, onClick }) => (
                <NavButton key={label} icon={icon} label={label} onClick={onClick} />
              ))}
            </div>
          </div>

          {/* OVERVIEW PANEL (desktop only) */}
          <div className="dash-panel dash-panel--overview">
            <div className="dash-panel__head">
              <BarChart2 size={15} strokeWidth={2.5} />
              <span>Overview</span>
            </div>
            <div className="dash-overview">
              <div className="dash-overview__row">
                <span className="dash-overview__label">Total Inventory</span>
                <span className="dash-overview__bar-wrap">
                  <span
                    className="dash-overview__bar"
                    style={{ width: stats ? "100%" : "0%" }}
                  />
                </span>
                <span className="dash-overview__val">{val(stats?.total)}</span>
              </div>
              <div className="dash-overview__row">
                <span className="dash-overview__label">Available</span>
                <span className="dash-overview__bar-wrap">
                  <span
                    className="dash-overview__bar dash-overview__bar--green"
                    style={{
                      width: stats?.total
                        ? `${Math.round((stats.available / stats.total) * 100)}%`
                        : "0%",
                    }}
                  />
                </span>
                <span className="dash-overview__val">{val(stats?.available)}</span>
              </div>
              <div className="dash-overview__row">
                <span className="dash-overview__label">Not Available</span>
                <span className="dash-overview__bar-wrap">
                  <span
                    className="dash-overview__bar dash-overview__bar--red"
                    style={{
                      width: stats?.total
                        ? `${Math.round((stats.unavailable / stats.total) * 100)}%`
                        : "0%",
                    }}
                  />
                </span>
                <span className="dash-overview__val">{val(stats?.unavailable)}</span>
              </div>
              <div className="dash-overview__row">
                <span className="dash-overview__label">Sold Out</span>
                <span className="dash-overview__bar-wrap">
                  <span
                    className="dash-overview__bar dash-overview__bar--dark"
                    style={{
                      width: stats?.total
                        ? `${Math.round((stats.soldOut / stats.total) * 100)}%`
                        : "0%",
                    }}
                  />
                </span>
                <span className="dash-overview__val">{val(stats?.soldOut)}</span>
              </div>
              <div className="dash-overview__row">
                <span className="dash-overview__label">Currently Rented</span>
                <span className="dash-overview__bar-wrap">
                  <span
                    className="dash-overview__bar dash-overview__bar--blue"
                    style={{
                      width: stats?.total
                        ? `${Math.round((stats.rentCount / stats.total) * 100)}%`
                        : "0%",
                    }}
                  />
                </span>
                <span className="dash-overview__val">{val(stats?.rentCount)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminMobileShell>
  );
}

export default AdminDashboardPage;
