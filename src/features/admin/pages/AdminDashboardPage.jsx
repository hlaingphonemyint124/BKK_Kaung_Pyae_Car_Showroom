import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, Key, Users, Clock, Plus,
  ChevronRight, CheckCircle2, XCircle, TrendingUp,
  Car, Bookmark, Wrench, MessageSquare,
} from "lucide-react";

import AdminMobileShell from "../components/AdminMobileShell";
import BusinessSettingsSection from "../dashboard/components/BusinessSettingsSection";
import { useAuth } from "../../../context/AuthContext";
import "../styles/admin.css";
import { MONTHS } from "../dashboard/constants/dashboardConstants";
import useDashboardStats from "../dashboard/hooks/useDashboardStats";
import useEmployeesPreview from "../dashboard/hooks/useEmployeesPreview";
import getInitials from "../dashboard/utils/getInitials";
import DashSectionHead from "../dashboard/components/DashSectionHead";

/* ─── Availability Card ─────────────────────────────────── */
function AvailCard({ icon: Icon, label, value, accent, sub, loading }) {
  return (
    <div className="dash-avail-card" style={{ "--avail-accent": accent }}>
      <div className="dash-avail-card__val">
        {loading ? <span className="dash-skeleton dash-skeleton--num" /> : value ?? 0}
      </div>
      <div className="dash-avail-card__label">{label}</div>
      {sub && <div className="dash-avail-card__sub">{sub}</div>}
      <div className="dash-avail-card__icon">
        <Icon size={18} strokeWidth={2} />
      </div>
    </div>
  );
}

/* ─── Performance Card ──────────────────────────────────── */
function PerfCard({ icon: Icon, label, value, accent, description, loading }) {
  return (
    <div className="dash-perf-card" style={{ "--perf-accent": accent }}>
      <div className="dash-perf-card__left">
        <div className="dash-perf-card__icon">
          <Icon size={22} strokeWidth={2} />
        </div>
        <div>
          <div className="dash-perf-card__label">{label}</div>
          <div className="dash-perf-card__desc">{description}</div>
        </div>
      </div>
      <div className="dash-perf-card__val">
        {loading ? <span className="dash-skeleton dash-skeleton--num" /> : value ?? 0}
      </div>
    </div>
  );
}

/* ─── Activity List ─────────────────────────────────────── */
function ActivityList({ title, icon: Icon, accent, cars, loading, onItemClick, badge, priceKey }) {
  return (
    <div className="dash-panel dash-activity-panel">
      <div className="dash-activity-head">
        <div className="dash-activity-head__icon" style={{ background: `${accent}18`, color: accent }}>
          <Icon size={15} strokeWidth={2.2} />
        </div>
        <span className="dash-activity-head__title">{title}</span>
        <span className="dash-activity-head__count" style={{ background: `${accent}14`, color: accent }}>
          {loading ? "…" : cars.length}
        </span>
      </div>

      {loading ? (
        <div className="dash-activity-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dash-activity-row dash-activity-row--skeleton">
              <span className="dash-skeleton dash-skeleton--thumb" />
              <div className="dash-activity-info">
                <span className="dash-skeleton dash-skeleton--line" />
                <span className="dash-skeleton dash-skeleton--line dash-skeleton--short" />
              </div>
            </div>
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="dash-activity-empty">No records yet</div>
      ) : (
        <div className="dash-activity-list">
          {cars.map((car) => (
            <button
              key={car.id}
              type="button"
              className="dash-activity-row"
              onClick={() => onItemClick(car.id)}
            >
              <div className="dash-activity-thumb">
                {car.image
                  ? <img src={car.image} alt={`${car.brand} ${car.model}`} />
                  : <Car size={18} />}
              </div>
              <div className="dash-activity-info">
                <span className="dash-activity-name">{car.brand} {car.model}</span>
                <span className="dash-activity-meta">
                  {car.year ? `${car.year} · ` : ""}
                  {car[priceKey]
                    ? `${Number(car[priceKey]).toLocaleString()} THB${priceKey === "rent_price_per_day" ? "/day" : ""}`
                    : "—"}
                </span>
              </div>
              <span className="dash-activity-badge" style={{ background: `${accent}14`, color: accent }}>
                {badge}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Quick Actions ─────────────────────────────────────── */
function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="dash-panel">
      <div className="dash-panel__head">
        <div className="dash-panel__head-icon"><Plus size={15} /></div>
        <span className="dash-panel__head-label">Quick Actions</span>
      </div>
      <div className="dash-add-grid">
        <button className="dash-add-card dash-add-card--sale" type="button"
          onClick={() => navigate("/admin/buy/new")}>
          <div className="dash-add-card__icon"><ShoppingBag size={20} /></div>
          <div className="dash-add-card__text">
            <span className="dash-add-card__title">Add For Sale</span>
            <span className="dash-add-card__sub">List a sale vehicle</span>
          </div>
          <ChevronRight size={16} className="dash-add-card__arrow" />
        </button>
        <button className="dash-add-card dash-add-card--rent" type="button"
          onClick={() => navigate("/admin/rental/new")}>
          <div className="dash-add-card__icon"><Key size={20} /></div>
          <div className="dash-add-card__text">
            <span className="dash-add-card__title">Add For Rental</span>
            <span className="dash-add-card__sub">List a rental vehicle</span>
          </div>
          <ChevronRight size={16} className="dash-add-card__arrow" />
        </button>
        <button className="dash-add-card dash-add-card--feedback" type="button"
          onClick={() => navigate("/admin/feedback")}>
          <div className="dash-add-card__icon"><MessageSquare size={20} /></div>
          <div className="dash-add-card__text">
            <span className="dash-add-card__title">Review Feedback</span>
            <span className="dash-add-card__sub">Approve customer reviews</span>
          </div>
          <ChevronRight size={16} className="dash-add-card__arrow" />
        </button>
      </div>
    </div>
  );
}

/* ─── Team Section ──────────────────────────────────────── */
function TeamSection({ user }) {
  const navigate = useNavigate();
  const employees = useEmployeesPreview();
  const adminInitials = getInitials(user?.full_name || user?.name || user?.email, "A");
  const preview = employees.slice(0, 4);
  const emptySlots = Math.max(0, 4 - preview.length);

  return (
    <div className="dash-panel">
      <div className="dash-panel__head">
        <div className="dash-panel__head-icon" style={{ color: "#8b5cf6" }}>
          <Users size={15} />
        </div>
        <span className="dash-panel__head-label">Team & Roles</span>
        <button className="dash-team-manage-btn" type="button"
          onClick={() => navigate("/admin/roles")}>
          Manage
        </button>
      </div>

      <div className="dash-admin-row">
        <div className="dash-avatar"><span>{adminInitials}</span></div>
        <div className="dash-admin-info">
          <div className="dash-admin-name">
            {user?.full_name || user?.name || user?.email?.split("@")[0] || "Admin"}
          </div>
          {user?.email && <div className="dash-admin-email">{user.email}</div>}
        </div>
        <span className="dash-role-badge dash-role-badge--admin">Admin</span>
      </div>

      <div className="dash-roles-sub">
        <span>Employees</span>
        <button className="dash-roles-add" type="button" onClick={() => navigate("/admin/roles")}>
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="dash-emp-grid">
        {preview.map((emp) => (
          <button key={emp.id} className="dash-emp-cell" type="button"
            onClick={() => navigate("/admin/roles")} title={emp.full_name || emp.email}>
            <div className="dash-emp-avatar dash-emp-avatar--filled">
              {getInitials(emp.full_name || emp.email, "E")}
            </div>
            <span className="dash-emp-name">
              {emp.full_name?.split(" ")[0] || "Staff"}
            </span>
          </button>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <button key={`e-${i}`} className="dash-emp-cell" type="button"
            onClick={() => navigate("/admin/roles")}>
            <div className="dash-emp-avatar"><Plus size={14} /></div>
            <span>Add</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();
  const { user } = useAuth();

  const now      = new Date();
  const hour     = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const dateStr  = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const v = (n) => (loading ? null : n ?? 0);

  // ── Row 1: Sale (listing_type === "sale") ─────────────────
  // ── Row 2: Rental (listing_type === "rent") ───────────────
  const availCards = [
    {
      icon: CheckCircle2,
      label: "Available Sale",
      value: v(stats?.availableSale),
      accent: "#e60000",
      sub: "Ready to sell",
    },
    {
      icon: Bookmark,
      label: "Reserved Sale",
      value: v(stats?.reservedSale),
      accent: "#f59e0b",
      sub: "On hold",
    },
    {
      icon: XCircle,
      label: "Sold",
      value: v(stats?.soldSale),
      accent: "#6b7280",
      sub: "Completed sales",
    },
    {
      icon: CheckCircle2,
      label: "Available Rental",
      value: v(stats?.availableRental),
      accent: "#3b82f6",
      sub: "Ready to rent",
    },
    {
      icon: Wrench,
      label: "Unavailable Rental",
      value: v(stats?.unavailableRental),
      accent: "#f97316",
      sub: "Rented or maintenance",
    },
    {
      icon: Key,
      label: "Total Rental Cars",
      value: v(stats?.totalRental),
      accent: "#8b5cf6",
      sub: "All rental vehicles",
    },
  ];

  return (
    <AdminMobileShell pageClass="dash-page" containerClass="dash-container">
      <div className="dash-content">

        {/* ── Header ── */}
        <div className="dash-header">
          <div className="dash-header__left">
            <div className="dash-header__avatar">
              {(user?.full_name || user?.name || user?.email || "A")[0].toUpperCase()}
            </div>
            <div>
              <p className="dash-header__greeting">{greeting},</p>
              <h1 className="dash-header__name">
                {user?.full_name || user?.name || user?.email?.split("@")[0] || "Admin"}
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

        {/* ── Fleet Overview — 6 cards (3 sale + 3 rental) ── */}
        <DashSectionHead label="Fleet Overview" />
        <div className="dash-avail-grid">
          {availCards.map((c) => (
            <AvailCard key={c.label} {...c} loading={loading} />
          ))}
        </div>

        {/* ── Performance ── */}
        <DashSectionHead label={`Performance · ${monthLabel}`} />
        <div className="dash-perf-grid">
          <PerfCard
            icon={TrendingUp}
            label="Total Sold"
            value={v(stats?.soldTotal)}
            accent="#e60000"
            description="listing_type = sale · status = sold"
            loading={loading}
          />
          <PerfCard
            icon={Key}
            label="Active Rentals"
            value={v(stats?.rentedTotal)}
            accent="#3b82f6"
            description="listing_type = rent · status = rented"
            loading={loading}
          />
        </div>

        {/* ── Activity Lists ── */}
        <DashSectionHead label="Activity" />
        <div className="dash-activity-grid">
          <ActivityList
            title="Sold Cars"
            icon={ShoppingBag}
            accent="#e60000"
            cars={stats?.soldCars ?? []}
            loading={loading}
            badge="Sold"
            priceKey="sale_price"
            onItemClick={(id) => navigate(`/admin/buy/${id}`)}
          />
          <ActivityList
            title="Rented Cars"
            icon={Key}
            accent="#3b82f6"
            cars={stats?.rentedCars ?? []}
            loading={loading}
            badge="Rented"
            priceKey="rent_price_per_day"
            onItemClick={(id) => navigate(`/admin/rental/${id}`)}
          />
        </div>

        {/* ── Management ── */}
        <DashSectionHead label="Management" />
        <div className="dash-mgmt-grid">
          <QuickActions />
          <TeamSection user={user} />
        </div>

        {/* ── Business Settings ── */}
        <DashSectionHead label="Business Settings" />
        <BusinessSettingsSection />

      </div>
    </AdminMobileShell>
  );
}
