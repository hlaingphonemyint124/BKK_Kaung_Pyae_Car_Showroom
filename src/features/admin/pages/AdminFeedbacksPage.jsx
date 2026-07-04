import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, MessageSquare, RefreshCw, Trash2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminMobileShell from "../components/AdminMobileShell";
import {
  deleteFeedback,
  getAdminFeedbacks,
  updateFeedbackStatus,
} from "../services/adminFeedbacksService";
import "../styles/admin.css";

const FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const getFeedbackStatus = (item) => {
  if (item.status) return item.status;
  return item.is_approved === true ? "approved" : "pending";
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCarName = (feedback) => {
  const name = [feedback.car_brand, feedback.car_model].filter(Boolean).join(" ");
  return name || "General feedback";
};

const normalizeFeedbacks = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.feedbacks)) return data.feedbacks;
  if (Array.isArray(data?.reviews)) return data.reviews;
  if (Array.isArray(data?.data?.feedbacks)) return data.data.feedbacks;
  if (Array.isArray(data?.data?.reviews)) return data.data.reviews;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const logFeedbackDebug = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

function FeedbackStatusBadge({ status }) {
  return (
    <span className={`feedback-status feedback-status--${status || "pending"}`}>
      {status || "pending"}
    </span>
  );
}

export default function AdminFeedbacksPage() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeStatus, setActiveStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminFeedbacks();
      logFeedbackDebug("ADMIN_FEEDBACKS_RESPONSE", data);
      const list = normalizeFeedbacks(data);
      logFeedbackDebug("ADMIN_FEEDBACKS_NORMALIZED", list);
      setFeedbacks(list);
    } catch (err) {
      setFeedbacks([]);
      setError(err?.response?.data?.error || "Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    return feedbacks.reduce((acc, item) => {
      const status = getFeedbackStatus(item);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [feedbacks]);

  const displayFeedbacks = useMemo(() => {
    return feedbacks.filter(
      (item) => getFeedbackStatus(item) === activeStatus
    );
  }, [feedbacks, activeStatus]);

  const runAction = async (id, action) => {
    setBusyId(id);
    setError("");

    try {
      await action();
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || "Feedback action failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminMobileShell pageClass="dash-page" containerClass="dash-container">
      <div className="admin-section dash-content feedback-admin-page">
        <div className="dash-header-row roles-page-header">
          <div className="roles-title-wrap">
            <button className="roles-back-btn" onClick={() => navigate("/admin")}>
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>

            <div>
              <h2 className="dash-title">Feedback</h2>
              <p className="dash-subtitle">Review customer comments before they appear publicly</p>
            </div>
          </div>

          <button className="roles-create-btn" onClick={() => load()}>
            <RefreshCw size={15} strokeWidth={2.5} />
            Refresh
          </button>
        </div>

        <div className="roles-tabs feedback-tabs">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`roles-tab${activeStatus === filter.value ? " roles-tab--active" : ""}`}
              onClick={() => setActiveStatus(filter.value)}
            >
              {filter.label}
              <span className="roles-tab__count">{counts[filter.value] ?? 0}</span>
            </button>
          ))}
        </div>

        {error && <p className="admin-state-message admin-state-message--error">{error}</p>}

        <div className="dash-panel feedback-table-panel">
          <div className="dash-panel__head">
            <MessageSquare size={15} strokeWidth={2.5} />
            <span>Customer Reviews</span>
          </div>

          {loading ? (
            <p className="dash-rank-empty">Loading...</p>
          ) : displayFeedbacks.length === 0 ? (
            <p className="dash-rank-empty">No {activeStatus} feedback.</p>
          ) : (
            <div className="feedback-table-wrap">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayFeedbacks.map((item) => {
                    const isBusy = busyId === item.id;

                    return (
                      <tr key={item.id}>
                        <td>{item.customer_name || item.name || "Anonymous"}</td>
                        <td>{getCarName(item)}</td>
                        <td>
                          <span className="feedback-rating">{"★".repeat(Number(item.stars) || 0)}</span>
                        </td>
                        <td className="feedback-comment">{item.message}</td>
                        <td><FeedbackStatusBadge status={getFeedbackStatus(item)} /></td>
                        <td>{formatDate(item.created_at)}</td>
                        <td>
                          <div className="feedback-actions">
                            <button
                              className="roles-btn roles-btn--promote"
                              onClick={() => runAction(item.id, () => updateFeedbackStatus(item.id, true))}
                              disabled={isBusy || getFeedbackStatus(item) === "approved"}
                            >
                              <CheckCircle2 size={14} />
                              Approve
                            </button>
                            <button
                              className="roles-btn roles-btn--warning"
                              onClick={() => runAction(item.id, () => updateFeedbackStatus(item.id, false))}
                              disabled={isBusy || getFeedbackStatus(item) === "rejected"}
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                            <button
                              className="roles-btn roles-btn--danger"
                              onClick={() => {
                                if (window.confirm("Delete this feedback?")) {
                                  runAction(item.id, () => deleteFeedback(item.id));
                                }
                              }}
                              disabled={isBusy}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminMobileShell>
  );
}
