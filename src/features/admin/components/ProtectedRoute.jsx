import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "../styles/admin.css";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-page">
        <div
          className="admin-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
          }}
        >
          <p style={{ color: "#888", fontSize: 14 }}>Checking access...</p>
        </div>
      </div>
    );
  }

  // 🔥 Key Fix: preserve where user came from
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;