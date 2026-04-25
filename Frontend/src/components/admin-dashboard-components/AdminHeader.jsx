import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, User, LogOut, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "../../lib/utils";
import RoleBadge from "./RoleBadge";
import { useAuth } from "../../context/AuthContext";

const AdminHeader = ({ isSuperAdmin = false, onToggleRole }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();          // clears token from localStorage + resets AuthContext state
        navigate("/login"); // redirect to login page
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications = [
        { id: 1, text: "New user registration: john@example.com", time: "2 min ago", unread: true },
        { id: 2, text: "Payment received: $29.00 from alex@test.com", time: "15 min ago", unread: true },
        { id: 3, text: "User flagged a clip for review", time: "1 hour ago", unread: false },
        { id: 4, text: "System backup completed", time: "3 hours ago", unread: false },
    ];

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 font-['Satoshi',sans-serif]">
            {/* Search Bar */}
            <div className="flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users, clips, transactions..."
                        className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Role Toggle */}
                {onToggleRole && (
                    <button
                        onClick={onToggleRole}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-150"
                        title="Toggle Admin/Super Admin view"
                    >
                        {isSuperAdmin ? (
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                            {isSuperAdmin ? "Super Admin" : "Admin"}
                        </span>
                    </button>
                )}

                {/* Admin Badge (when no toggle) */}
                {!onToggleRole && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">
                            {isSuperAdmin ? "Super Admin" : "Admin"}
                        </span>
                    </div>
                )}

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={cn(
                            "relative p-2 rounded-lg transition-all duration-150",
                            showNotifications ? "bg-gray-100" : "hover:bg-gray-50"
                        )}
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
                        )}
                    </button>

                    <div
                        className={cn(
                            "absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right z-50",
                            showNotifications
                                ? "opacity-100 scale-100 pointer-events-auto"
                                : "opacity-0 scale-95 pointer-events-none"
                        )}
                    >
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="max-h-[320px] overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-0",
                                        notification.unread && "bg-emerald-50/30"
                                    )}
                                >
                                    <p className="text-sm text-gray-900">{notification.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                                View all notifications
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={cn(
                            "flex items-center gap-2 p-1.5 rounded-lg transition-all duration-150",
                            showUserMenu ? "bg-gray-100" : "hover:bg-gray-50"
                        )}
                    >
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                            alt="Admin avatar"
                            className="w-8 h-8 rounded-full bg-gray-100"
                        />
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 text-gray-500 transition-transform duration-200",
                                showUserMenu && "rotate-180"
                            )}
                        />
                    </button>

                    <div
                        className={cn(
                            "absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right z-50",
                            showUserMenu
                                ? "opacity-100 scale-100 pointer-events-auto"
                                : "opacity-0 scale-95 pointer-events-none"
                        )}
                    >
                        <div className="px-5 py-4 border-b border-gray-100">
                            <p className="font-semibold text-gray-900">{user?.name || "Admin"}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{user?.email || ""}</p>
                            <div className="mt-2">
                                <RoleBadge role={user?.role || (isSuperAdmin ? "superadmin" : "admin")} />
                            </div>
                        </div>
                        <div className="py-2">
                            <button
                                onClick={() => {
                                    navigate("/admin/settings");
                                    setShowUserMenu(false);
                                }}
                                className="flex items-center gap-3 w-full px-5 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150"
                            >
                                <User className="w-4 h-4" />
                                Profile Settings
                            </button>
                        </div>
                        <div className="py-2 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
