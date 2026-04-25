import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * ProtectedRoute — Server-verified auth guard.
 *
 * On every page load, AuthContext calls GET /api/auth/me to validate the
 * stored token. We show a spinner while that check runs (isLoading=true).
 * Once the check completes:
 *   - isAuthenticated=true  → render children
 *   - isAuthenticated=false → redirect to /login  (token missing / invalid / expired)
 *
 * NOTE: We deliberately do NOT use a synchronous localStorage check as a
 * fast-fail. That check can be trivially bypassed by anyone who manually
 * puts a fake value in localStorage. The only trustworthy signal is the
 * server-verified isAuthenticated flag set by initAuth().
 *
 * Role check: if requiredRoles is provided, the user's role must be in the
 * list — otherwise they are redirected to /dashboard (or /admin for admins).
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // ── Waiting for server to verify the token ────────────────────────────────
    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    background: "#f9fafb",
                    gap: "12px",
                }}
            >
                <Loader2
                    style={{
                        width: "40px",
                        height: "40px",
                        color: "#10b981",
                        animation: "spin 0.8s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500 }}>
                    Authenticating…
                </p>
            </div>
        );
    }

    // ── Server said: not authenticated (no token, invalid, or expired) ────────
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ── Role check ────────────────────────────────────────────────────────────
    if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
        console.warn(
            `[ProtectedRoute] Role '${user?.role}' not in requiredRoles:`,
            requiredRoles
        );
        const fallback =
            user?.role === "admin" || user?.role === "superadmin"
                ? "/admin"
                : "/dashboard";
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default ProtectedRoute;
