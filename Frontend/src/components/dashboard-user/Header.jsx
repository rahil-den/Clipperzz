import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Plus, ChevronDown, User, CreditCard, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const Header = ({ onCreateClip }) => {
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
        { id: 1, text: "Your clip is ready to download", time: "2 min ago", unread: true },
        { id: 2, text: "Video processing complete", time: "1 hour ago", unread: true },
        { id: 3, text: "New template available", time: "2 hours ago", unread: false },
    ];

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-4 font-['Satoshi',sans-serif]">
            <button
                onClick={onCreateClip}
                className="flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
                <Plus className="w-4 h-4" />
                Create Clip
            </button>

            <div className="relative" ref={notificationRef}>
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={cn(
                        "relative p-2 rounded-lg transition-all duration-200",
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
                        "absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right z-50",
                        showNotifications
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                    )}
                >
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
                                    notification.unread && "bg-emerald-50/50"
                                )}
                            >
                                <p className="text-sm text-gray-900">{notification.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100">
                        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                            View all notifications
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={cn(
                        "flex items-center gap-2 p-1.5 rounded-lg transition-all duration-200",
                        showUserMenu ? "bg-gray-100" : "hover:bg-gray-50"
                    )}
                >
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                        alt="User avatar"
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
                        "absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right z-50",
                        showUserMenu
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                    )}
                >
                    <div className="px-5 py-4 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{user?.email || ""}</p>
                    </div>
                    <div className="py-2">
                        <Link
                            to="/dashboard/settings"
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                        <Link
                            to="/dashboard/billing"
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                        >
                            <CreditCard className="w-4 h-4" />
                            Billing
                        </Link>
                    </div>
                    <div className="py-2 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
