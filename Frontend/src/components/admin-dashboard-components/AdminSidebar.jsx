import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Scissors,
    CreditCard,
    BarChart3,
    Settings,
    ShieldCheck,
    Sliders,
    FileText,
    Infinity,
    Server,
    MessageSquareWarning,
    Layers,
    KeyRound,
} from "lucide-react";
import { cn } from "../../lib/utils";

const adminNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Clips", icon: Scissors, path: "/admin/clips" },
    { label: "Payments", icon: CreditCard, path: "/admin/payments" },
    { label: "Reports", icon: BarChart3, path: "/admin/reports" },
    { label: "User Reports", icon: MessageSquareWarning, path: "/admin/user-reports" },
    { label: "Jobs & Queue", icon: Layers, path: "/admin/jobs-queue" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const superAdminNavItems = [
    { label: "Admin Management", icon: ShieldCheck, path: "/admin/admin-management" },
    { label: "Roles & Access", icon: KeyRound, path: "/admin/roles-access" },
    { label: "Platform Settings", icon: Sliders, path: "/admin/platform-settings" },
    { label: "System Logs", icon: FileText, path: "/admin/system-logs" },
    { label: "Super Tools", icon: Infinity, path: "/admin/super-tools" },
];

const AdminSidebar = ({ isSuperAdmin = false }) => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-100 flex flex-col z-40 font-['Satoshi',sans-serif]">
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-gray-100">
                <NavLink to="/admin" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">Clipperz</span>
                        <span className="text-[10px] text-emerald-600 font-medium -mt-0.5">
                            {isSuperAdmin ? "Super Admin" : "Admin Panel"}
                        </span>
                    </div>
                </NavLink>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {/* Main admin items */}
                {adminNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                                isActive
                                    ? "text-gray-900 bg-emerald-50"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-emerald-500" : "text-gray-400"
                                    )}
                                />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Super Admin Section */}
                {isSuperAdmin && (
                    <>
                        <div className="pt-4 pb-2">
                            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Super Admin
                            </p>
                        </div>
                        {superAdminNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                                        isActive
                                            ? "text-gray-900 bg-emerald-50"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={cn(
                                                "w-5 h-5 transition-colors",
                                                isActive ? "text-emerald-500" : "text-gray-400"
                                            )}
                                        />
                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </>
                )}
            </nav>

            {/* System Info Card */}
            <div
                className="mx-4 mb-5 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md"
                style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)",
                    borderColor: "rgba(16, 185, 129, 0.15)",
                }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Server className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">System Status</p>
                        <p className="text-xs text-emerald-600">All systems operational</p>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-500/10">
                    <p className="text-[10px] text-gray-400">Version 1.0.0 • Last updated today</p>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
