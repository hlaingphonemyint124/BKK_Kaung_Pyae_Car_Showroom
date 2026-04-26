import { useEffect, useState } from "react";
import { UserCheck, UserPlus, UserX, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMobileShell from "../components/AdminMobileShell";
import { useAuth } from "../../../context/AuthContext";
import {
  getUsers,
  promoteToEmployee,
  demoteToClient,
  createUser,
} from "../services/adminUsersService";
import "../styles/admin.css";

const TABS = ["Employees", "Clients"];

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div className="roles-avatar">
      <span>{initials}</span>
    </div>
  );
}

function UserRow({ user, onPromote, onDeactivate, promoting, deactivating }) {
  const isEmployee = user.role === "employee";
  return (
    <div className="roles-user-row">
      <Avatar name={user.full_name} />
      <div className="roles-user-info">
        <div className="roles-user-name">{user.full_name}</div>
        <div className="roles-user-email">{user.email}</div>
      </div>
      <div className="roles-user-actions">
        {isEmployee ? (
          <button
            className="roles-btn roles-btn--danger"
            onClick={() => onDeactivate(user.id)}
            disabled={deactivating === user.id}
          >
            <UserX size={14} strokeWidth={2.5} />
            {deactivating === user.id ? "…" : "To Client"}
          </button>
        ) : (
          <button
            className="roles-btn roles-btn--promote"
            onClick={() => onPromote(user.id)}
            disabled={promoting === user.id}
          >
            <UserCheck size={14} strokeWidth={2.5} />
            {promoting === user.id ? "…" : "Make Employee"}
          </button>
        )}
      </div>
    </div>
  );
}

function CreateUserModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) return;
    setBusy(true);
    setError(null);
    try {
      await onCreate(form);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create user");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="roles-modal-overlay" onClick={onClose}>
      <div className="roles-modal" onClick={(e) => e.stopPropagation()}>
        <div className="roles-modal__head">
          <UserPlus size={16} strokeWidth={2.5} />
          <span>New Employee</span>
          <button className="roles-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="roles-modal__form">
          {[
            { key: "full_name", label: "Full Name", type: "text",     placeholder: "John Doe"        },
            { key: "email",     label: "Email",     type: "email",    placeholder: "john@email.com"  },
            { key: "password",  label: "Password",  type: "password", placeholder: "Min 8 chars"     },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="roles-modal__field">
              <label className="roles-modal__label">{label}</label>
              <input
                className="roles-modal__input"
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="roles-modal__field">
            <label className="roles-modal__label">Role</label>
            <select
              className="roles-modal__input"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              <option value="employee">Employee</option>
            </select>
          </div>

          {error && <p className="roles-modal__error">{error}</p>}

          <button className="roles-modal__submit" type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminRolesPage() {
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Employees");
  const [promoting, setPromoting] = useState(null);
  const [deactivating, setDeactivating] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => {
    setLoading(true);
    getUsers()
      .then((data) => setUsers(data.users ?? data ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const employees = users.filter((u) => u.role === "employee" && u.is_active);
  const clients   = users.filter((u) => u.role === "client"   && u.is_active);
  const displayed = activeTab === "Employees" ? employees : clients;

  const handlePromote = async (id) => {
    setPromoting(id);
    try {
      await promoteToEmployee(id);
      load();
    } catch {
      // no-op
    } finally {
      setPromoting(null);
    }
  };

  const handleDeactivate = async (id) => {
    setDeactivating(id);
    try {
      await demoteToClient(id);
      load();
    } catch {
      // no-op
    } finally {
      setDeactivating(null);
    }
  };

  const handleCreate = async (payload) => {
    await createUser(payload);
    load();
  };

  return (
    <AdminMobileShell pageClass="dash-page" containerClass="dash-container">
      <div className="admin-section dash-content">

        {/* Header */}
        <div className="dash-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="roles-back-btn" onClick={() => navigate("/admin")}>
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <div>
              <h2 className="dash-title">Roles</h2>
              <p className="dash-subtitle">Manage team members &amp; permissions</p>
            </div>
          </div>
          <button className="roles-create-btn" onClick={() => setShowCreate(true)}>
            <UserPlus size={15} strokeWidth={2.5} />
            Add Employee
          </button>
        </div>

        {/* Admin card */}
        <div className="dash-panel roles-admin-card">
          <div className="dash-panel__head">
            <Users size={15} strokeWidth={2.5} />
            <span>Admin</span>
          </div>
          <div className="dash-admin-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
            <div className="dash-avatar">
              <span style={{ fontSize: 15, fontWeight: 700, color: "#ef2b2d" }}>
                {me?.name
                  ? me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                  : "A"}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
                {me?.name || me?.email || "Admin"}
              </div>
              {me?.email && (
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{me.email}</div>
              )}
            </div>
            <span className="dash-admin-badge">Admin</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="roles-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`roles-tab${activeTab === t ? " roles-tab--active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
              <span className="roles-tab__count">
                {t === "Employees" ? employees.length : clients.length}
              </span>
            </button>
          ))}
        </div>

        {/* Users list */}
        <div className="dash-panel">
          {loading ? (
            <p className="dash-rank-empty">Loading…</p>
          ) : displayed.length === 0 ? (
            <p className="dash-rank-empty">
              {activeTab === "Employees" ? "No employees yet." : "No client users found."}
            </p>
          ) : (
            <div className="roles-user-list">
              {displayed.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  onPromote={handlePromote}
                  onDeactivate={handleDeactivate}
                  promoting={promoting}
                  deactivating={deactivating}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </AdminMobileShell>
  );
}
