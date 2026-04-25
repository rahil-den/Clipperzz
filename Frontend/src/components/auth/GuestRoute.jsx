import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * GuestRoute — Only allows access for unauthenticated users.
 *
 * If the user IS authenticated (verified by the server), they are redirected
 * away from public pages like /login, /signup, /forgot-password.
 * Admins go to /admin; regular users go to /dashboard.
 *
 * Fast-fail: if there is NO token at all we know instantly the user is a
 * guest — render children immediately without waiting for any async check.
 */
const GuestRoute = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Fast-fail: no token → definitively a guest, show the page now
    const hasToken = Boolean(localStorage.getItem("token"));
    if (!hasToken && !isAuthenticated) {
        return children;
    }

    // Token exists but server hasn't validated it yet — wait
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
                    Loading…
                </p>
            </div>
        );
    }

    // Server confirmed: user is logged in → send to the right place
    if (isAuthenticated) {
        const redirectTo =
            user?.role === "admin" || user?.role === "superadmin"
                ? "/admin"
                : "/dashboard";
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default GuestRoute;
