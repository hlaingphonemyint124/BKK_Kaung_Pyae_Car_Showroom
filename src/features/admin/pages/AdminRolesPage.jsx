import { useEffect, useState } from "react";
import {
  UserCheck,
  UserPlus,
  UserX,
  Users,
  ChevronLeft,
  ShieldOff,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMobileShell from "../components/AdminMobileShell";
import { useAuth } from "../../../context/AuthContext";
import {
  getUsers,
  promoteToEmployee,
  demoteToClient,
  createUser,
  deactivateUser,
  reactivateUser,
  hardDeleteUser,
} from "../services/adminUsersService";
import "../styles/admin.css";

const TABS = ["Employees", "Clients", "Inactive"];

function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="roles-avatar">
      <span>{initials}</span>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  dangerText,
  confirmLabel,
  onClose,
  onConfirm,
  requireDeleteText = false,
}) {
  const [typed, setTyped] = useState("");
  const canConfirm = requireDeleteText ? typed === "DELETE" : true;

  return (
    <div className="roles-modal-overlay" onClick={onClose}>
      <div className="roles-modal roles-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="roles-modal__head">
          <Trash2 size={16} strokeWidth={2.5} />
          <span>{title}</span>
          <button className="roles-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="roles-confirm-body">
          <p className="roles-confirm-message">{message}</p>
          {dangerText && <p className="roles-confirm-danger">{dangerText}</p>}

          {requireDeleteText && (
            <div className="roles-modal__field">
              <label className="roles-modal__label">Type DELETE to confirm</label>
              <input
                className="roles-modal__input"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          )}

          <div className="roles-confirm-actions">
            <button className="roles-confirm-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="roles-confirm-submit"
              onClick={onConfirm}
              disabled={!canConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRow({
  user,
  onPromote,
  onDemote,
  onDeactivate,
  onReactivate,
  onHardDelete,
  busyId,
}) {
  const isEmployee = user.role === "employee";
  const isClient = user.role === "client";
  const isInactive = !user.is_active;
  const isBusy = busyId === user.id;

  return (
    <div className={`roles-user-row${isInactive ? " roles-user-row--inactive" : ""}`}>
      <Avatar name={user.full_name} />

      <div className="roles-user-info">
        <div className="roles-user-name">{user.full_name}</div>
        <div className="roles-user-email">{user.email}</div>

        <div className="roles-user-meta">
          <span className={`roles-status-badge ${isInactive ? "inactive" : "active"}`}>
            {isInactive ? "Inactive" : "Active"}
          </span>
          <span className="roles-role-badge">{user.role}</span>
        </div>
      </div>

      <div className="roles-user-actions">
        {isInactive ? (
          <>
            <button
              className="roles-btn roles-btn--promote"
              onClick={() => onReactivate(user)}
              disabled={isBusy}
            >
              <RefreshCw size={14} strokeWidth={2.5} />
              {isBusy ? "…" : "Reactivate"}
            </button>

            <button
              className="roles-btn roles-btn--hard"
              onClick={() => onHardDelete(user)}
              disabled={isBusy}
            >
              <Trash2 size={14} strokeWidth={2.5} />
              Hard Delete
            </button>
          </>
        ) : (
          <>
            {isEmployee && (
              <button
                className="roles-btn roles-btn--warning"
                onClick={() => onDemote(user)}
                disabled={isBusy}
              >
                <ShieldOff size={14} strokeWidth={2.5} />
                {isBusy ? "…" : "To Client"}
              </button>
            )}

            {isClient && (
              <button
                className="roles-btn roles-btn--promote"
                onClick={() => onPromote(user)}
                disabled={isBusy}
              >
                <UserCheck size={14} strokeWidth={2.5} />
                {isBusy ? "…" : "Make Employee"}
              </button>
            )}

            <button
              className="roles-btn roles-btn--danger"
              onClick={() => onDeactivate(user)}
              disabled={isBusy}
            >
              <UserX size={14} strokeWidth={2.5} />
              Deactivate
            </button>
          </>
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

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
          <button className="roles-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="roles-modal__form">
          <div className="roles-modal__field">
            <label className="roles-modal__label">Full Name</label>
            <input
              className="roles-modal__input"
              type="text"
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              required
            />
          </div>

          <div className="roles-modal__field">
            <label className="roles-modal__label">Email</label>
            <input
              className="roles-modal__input"
              type="email"
              placeholder="john@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>

          <div className="roles-modal__field">
            <label className="roles-modal__label">Password</label>
            <input
              className="roles-modal__input"
              type="password"
              placeholder="Min 8 chars"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
            />
          </div>

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
  const [busyId, setBusyId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const data = await getUsers();
      setUsers(data.users ?? data ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const employees = users.filter((u) => u.role === "employee" && u.is_active);
  const clients = users.filter((u) => u.role === "client" && u.is_active);
  const inactive = users.filter((u) => !u.is_active);

  const displayed =
    activeTab === "Employees"
      ? employees
      : activeTab === "Clients"
      ? clients
      : inactive;

  const getTabCount = (tab) => {
    if (tab === "Employees") return employees.length;
    if (tab === "Clients") return clients.length;
    return inactive.length;
  };

  const runAction = async (user, action) => {
    setBusyId(user.id);

    try {
      await action();
      await load();
    } finally {
      setBusyId(null);
      setConfirmAction(null);
    }
  };

  const handlePromote = (user) => {
    setConfirmAction({
      type: "promote",
      user,
      title: "Make Employee?",
      message: `${user.full_name} will receive employee access to the admin system.`,
      confirmLabel: "Make Employee",
      onConfirm: () => runAction(user, () => promoteToEmployee(user.id)),
    });
  };

  const handleDemote = (user) => {
    setConfirmAction({
      type: "demote",
      user,
      title: "Remove Employee Role?",
      message: `${user.full_name} will become a normal client and lose employee permissions.`,
      confirmLabel: "To Client",
      onConfirm: () => runAction(user, () => demoteToClient(user.id)),
    });
  };

  const handleDeactivate = (user) => {
    setConfirmAction({
      type: "deactivate",
      user,
      title: "Deactivate Account?",
      message: `${user.full_name} will no longer be able to log in.`,
      dangerText: "You can reactivate this account later.",
      confirmLabel: "Deactivate",
      onConfirm: () => runAction(user, () => deactivateUser(user.id)),
    });
  };

  const handleReactivate = (user) => {
    setConfirmAction({
      type: "reactivate",
      user,
      title: "Reactivate Account?",
      message: `${user.full_name} will be able to log in again.`,
      confirmLabel: "Reactivate",
      onConfirm: () => runAction(user, () => reactivateUser(user.id)),
    });
  };

  const handleHardDelete = (user) => {
    setConfirmAction({
      type: "hard-delete",
      user,
      title: "Permanently Delete Account?",
      message: `${user.full_name} will be permanently removed from the database.`,
      dangerText: "This action cannot be undone.",
      confirmLabel: "Hard Delete",
      requireDeleteText: true,
      onConfirm: () => runAction(user, () => hardDeleteUser(user.id)),
    });
  };

  const handleCreate = async (payload) => {
    await createUser(payload);
    await load();
  };

  return (
    <AdminMobileShell pageClass="dash-page" containerClass="dash-container">
      <div className="admin-section dash-content">
        <div className="dash-header-row roles-page-header">
          <div className="roles-title-wrap">
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

        <div className="dash-panel roles-admin-card">
          <div className="dash-panel__head">
            <Users size={15} strokeWidth={2.5} />
            <span>Admin</span>
          </div>

          <div className="dash-admin-row roles-admin-current">
            <div className="dash-avatar">
              <span>
                {me?.name
                  ? me.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "A"}
              </span>
            </div>

            <div className="roles-user-info">
              <div className="roles-user-name">{me?.name || me?.email || "Admin"}</div>
              {me?.email && <div className="roles-user-email">{me.email}</div>}
            </div>

            <span className="dash-admin-badge">Admin</span>
          </div>
        </div>

        <div className="roles-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`roles-tab${activeTab === tab ? " roles-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="roles-tab__count">{getTabCount(tab)}</span>
            </button>
          ))}
        </div>

        <div className="dash-panel">
          {loading ? (
            <p className="dash-rank-empty">Loading…</p>
          ) : displayed.length === 0 ? (
            <p className="dash-rank-empty">
              {activeTab === "Employees"
                ? "No employees yet."
                : activeTab === "Clients"
                ? "No client users found."
                : "No inactive accounts."}
            </p>
          ) : (
            <div className="roles-user-list">
              {displayed.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onPromote={handlePromote}
                  onDemote={handleDemote}
                  onDeactivate={handleDeactivate}
                  onReactivate={handleReactivate}
                  onHardDelete={handleHardDelete}
                  busyId={busyId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateUserModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}

      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          dangerText={confirmAction.dangerText}
          confirmLabel={confirmAction.confirmLabel}
          requireDeleteText={confirmAction.requireDeleteText}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmAction.onConfirm}
        />
      )}
    </AdminMobileShell>
  );
}