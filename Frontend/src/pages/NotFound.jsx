import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, LayoutDashboard, ArrowLeft, Frown } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const dashboardPath =
        user?.role === "admin" || user?.role === "superadmin"
            ? "/admin"
            : "/dashboard";

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Satoshi', sans-serif",
                background: "linear-gradient(135deg, #f9fafb 0%, #f0fdf4 50%, #f9fafb 100%)",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative blobs */}
            <div style={{
                position: "fixed", top: "-200px", left: "-200px",
                width: "500px", height: "500px",
                background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
                borderRadius: "50%", pointerEvents: "none",
            }} />
            <div style={{
                position: "fixed", bottom: "-200px", right: "-200px",
                width: "500px", height: "500px",
                background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
                borderRadius: "50%", pointerEvents: "none",
            }} />

            {/* Card */}
            <div style={{
                background: "white",
                borderRadius: "32px",
                padding: "56px 48px",
                maxWidth: "480px",
                width: "100%",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.06)",
                position: "relative",
                zIndex: 1,
            }}>
                {/* 404 number */}
                <div style={{
                    fontSize: "96px",
                    fontWeight: "900",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #6366f1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "8px",
                    letterSpacing: "-4px",
                }}>
                    404
                </div>

                {/* Icon */}
                <div style={{
                    width: "64px", height: "64px",
                    background: "linear-gradient(135deg, #ecfdf5 0%, #ede9fe 100%)",
                    borderRadius: "20px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px",
                    border: "1px solid rgba(16,185,129,0.15)",
                }}>
                    <Frown size={32} style={{ color: "#10b981" }} />
                </div>

                <h1 style={{
                    fontSize: "24px", fontWeight: "700",
                    color: "#111827", marginBottom: "12px",
                }}>
                    Page Not Found
                </h1>
                <p style={{
                    fontSize: "15px", color: "#6b7280",
                    lineHeight: "1.6", marginBottom: "36px",
                }}>
                    Oops! The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: "8px", padding: "13px 20px",
                            background: "white", color: "#374151",
                            border: "1.5px solid #e5e7eb", borderRadius: "14px",
                            fontSize: "14px", fontWeight: "600", cursor: "pointer",
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; e.target.style.borderColor = "#d1d5db"; }}
                        onMouseLeave={(e) => { e.target.style.background = "white"; e.target.style.borderColor = "#e5e7eb"; }}
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: "8px", padding: "13px 20px",
                            background: "#111827", color: "white",
                            border: "none", borderRadius: "14px",
                            fontSize: "14px", fontWeight: "600", cursor: "pointer",
                            transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => { e.target.style.background = "#1f2937"; }}
                        onMouseLeave={(e) => { e.target.style.background = "#111827"; }}
                    >
                        <Home size={16} />
                        Go to Home
                    </button>

                    {isAuthenticated && (
                        <button
                            onClick={() => navigate(dashboardPath)}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                gap: "8px", padding: "13px 20px",
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                color: "white", border: "none", borderRadius: "14px",
                                fontSize: "14px", fontWeight: "600", cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 6px 16px rgba(16,185,129,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.3)";
                            }}
                        >
                            <LayoutDashboard size={16} />
                            Go to Dashboard
                        </button>
                    )}
                </div>

                {/* Footer hint */}
                <p style={{
                    fontSize: "12px", color: "#9ca3af",
                    marginTop: "28px",
                }}>
                    Error 404 · Page unavailable
                </p>
            </div>
        </div>
    );
};

export default NotFound;
