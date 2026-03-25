import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * ProtectedRoute - A wrapper for routes that require authentication and optional role-based access.
 * 
 * @param {React.ReactNode} children - The component to render if authorized.
 * @param {string[]} requiredRoles - Array of roles allowed to access this route (e.g., ["admin", "superadmin"]).
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Authenticating...</p>
            </div>
        );
    }

    // Not logged in -> Redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but role not allowed -> Redirect to user dashboard
    if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
        console.warn(`[ProtectedRoute] User role '${user?.role}' not in required roles:`, requiredRoles);
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
