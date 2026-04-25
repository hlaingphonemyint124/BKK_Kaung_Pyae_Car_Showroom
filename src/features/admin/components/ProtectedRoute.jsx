import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "../styles/admin.css";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

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

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
