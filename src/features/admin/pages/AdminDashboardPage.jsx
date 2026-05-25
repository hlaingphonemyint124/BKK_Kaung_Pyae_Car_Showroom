import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car, Flag, AlertTriangle, Trophy, Plus, Star, Key, Users,
  Clock,
  ChevronRight, ShoppingBag, TrendingUp,
} from "lucide-react";

import AdminMobileShell from "../components/AdminMobileShell";
import BusinessSettingsSection from "../dashboard/components/BusinessSettingsSection";
import { useAuth } from "../../../context/AuthContext";
import { getAdminCars } from "../services/adminCarService";
import { getUsers } from "../services/adminUsersService";
import "../styles/admin.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ORDINALS = ["1st","2nd","3rd","4th","5th"];

function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCars()
      .then((data) => {
        const cars = data?.cars || data?.data?.cars || data?.data || data?.rows || [];

        const isUnavailable = (car) =>
          ["rented", "sold", "maintenance", "reserved"].includes(car.status);

        const available = cars.filter((car) => !isUnavailable(car));
        const unavailable = cars.filter(isUnavailable);

        setStats({
          total: cars.length,
          sale: cars.filter((car) => car.sale_price != null).length,
          rental: cars.filter((car) => car.rent_price_per_day != null).length,
          available: available.length,
          availableSale: available.filter((car) => car.sale_price != null).length,
          availableRental: available.filter((car) => car.rent_price_per_day != null).length,
          unavailable: unavailable.length,
          unavailableSale: unavailable.filter((car) => car.sale_price != null).length,
          unavailableRental: unavailable.filter((car) => car.rent_price_per_day != null).length,
          soldOut: cars.filter((car) => car.status === "sold").length,
          rentCount: cars.filter((car) => car.status === "rented").length,
          soldCars: cars.filter((car) => car.status === "sold").slice(0, 5),
          rentedCars: cars.filter((car) => car.status === "rented").slice(0, 5),
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

function useEmployeesPreview() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getUsers()
      .then((data) => {
        const list = data?.users || data || [];
        setEmployees(list.filter((user) => user.role === "employee" && user.is_active));
      })
      .catch(() => setEmployees([]));
  }, []);

  return employees;
}

function getInitials(name, fallback = "A") {
  if (!name) return fallback;

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatCard({ icon: Icon, iconBg, accent, label, value, sub1, sub2, valueIsText, progress }) {
  return (
    <div className="dash-stat-card" style={{ "--card-accent": accent }}>
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
          <div
            className="dash-stat-card__progress-fill"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: accent || iconBg,
            }}
          />
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

function DashSectionHead({ label }) {
  return (
    <div className="dash-section-head">
      <div className="dash-section-head__bar" />
      <span className="dash-section-head__label">{label}</span>
      <div className="dash-section-head__rule" />
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
          {cars.map((car, index) => (
            <div key={car.id} className="dash-rank-row" onClick={() => navigate(`/admin/buy/${car.id}`)}>
              <span className="dash-rank-num" data-pos={index}>
                {ORDINALS[index]}
              </span>

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
          {cars.map((car, index) => (
            <div key={car.id} className="dash-rank-row" onClick={() => navigate(`/admin/rental/${car.id}`)}>
              <span className="dash-rank-num" data-pos={index}>
                {ORDINALS[index]}
              </span>

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
  const employees = useEmployeesPreview();

  const adminInitials = getInitials(user?.name || user?.email, "A");

  const previewEmployees = employees.slice(0, 4);
  const emptySlots = Math.max(0, 4 - previewEmployees.length);

  return (
    <div className="dash-panel">
      <PanelHead icon={Users} label="Team & Roles" accent="#8b5cf6" />

      <div className="dash-admin-row">
        <div className="dash-avatar">
          <span>{adminInitials}</span>
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
        {previewEmployees.map((employee) => {
          const initials = getInitials(employee.full_name || employee.email, "E");
          const displayName = employee.full_name?.split(" ")[0] || "Staff";

          return (
            <button
              key={employee.id}
              className="dash-emp-cell"
              type="button"
              onClick={() => navigate("/admin/roles")}
              title={employee.full_name || employee.email}
            >
              <div className="dash-emp-avatar dash-emp-avatar--filled">
                {initials}
              </div>
              <span className="dash-emp-name">{displayName}</span>
            </button>
          );
        })}

        {Array.from({ length: emptySlots }).map((_, index) => (
          <button
            key={`empty-${index}`}
            className="dash-emp-cell"
            type="button"
            onClick={() => navigate("/admin/roles")}
          >
            <div className="dash-emp-avatar">
              <Plus size={14} />
            </div>
            <span>Add</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, loading } = useDashboardStats();
  const { user } = useAuth();

  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const monthLabel = `${MONTHS[now.getMonth()]}. ${now.getFullYear()}`;

  const dateStr = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const val = (number) => (loading ? "—" : number ?? 0);

  const availPct =
    stats?.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0;

  const statCards = [
    {
      icon: Car,
      iconBg: "linear-gradient(135deg,#ef2b2d,#b91c1c)",
      accent: "#ef2b2d",
      label: "Total Fleet",
      value: val(stats?.total),
      sub1: `Sale ${val(stats?.sale)}`,
      sub2: `Rental ${val(stats?.rental)}`,
    },
    {
      icon: Flag,
      iconBg: "linear-gradient(135deg,#22c55e,#15803d)",
      accent: "#22c55e",
      label: "Available Now",
      value: val(stats?.available),
      sub1: `Sale ${val(stats?.availableSale)}`,
      sub2: `Rental ${val(stats?.availableRental)}`,
      progress: availPct,
    },
    {
      icon: AlertTriangle,
      iconBg: "linear-gradient(135deg,#f59e0b,#b45309)",
      accent: "#f59e0b",
      label: "Unavailable",
      value: val(stats?.unavailable),
      sub1: `Sale ${val(stats?.unavailableSale)}`,
      sub2: `Rental ${val(stats?.unavailableRental)}`,
    },
    {
      icon: Trophy,
      iconBg: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
      accent: "#8b5cf6",
      label: "This Month",
      value: monthLabel,
      valueIsText: true,
      sub1: `Sold ${val(stats?.soldOut)}`,
      sub2: `Rented ${val(stats?.rentCount)}`,
    },
  ];

  return (
    <AdminMobileShell pageClass="dash-page" containerClass="dash-container">
      <div className="dash-content">
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

        <DashSectionHead label="Performance Overview" />

        <div className="dash-stats-grid">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <DashSectionHead label="Fleet Management" />

        <div className="dash-main-grid">
          <div className="dash-col-main">
            <AddCarsSection />

            <div className="dash-lists-row">
              <SoldSection cars={stats?.soldCars ?? []} loading={loading} />
              <RentedSection cars={stats?.rentedCars ?? []} loading={loading} />
            </div>
          </div>

          <div className="dash-col-side">
            <RolesSection user={user} />
          </div>
        </div>

        <DashSectionHead label="Business Settings" />

        <BusinessSettingsSection />
      </div>
    </AdminMobileShell>
  );
}