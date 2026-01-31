import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Video,
    Scissors,
    BarChart3,
    Layout,
    CreditCard,
    Settings,
    TrendingUp,
    Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Videos", icon: Video, path: "/dashboard/videos" },
    { label: "Clips", icon: Scissors, path: "/dashboard/clips" },
    { label: "Usage", icon: BarChart3, path: "/dashboard/usage" },
    { label: "Templates", icon: Layout, path: "/dashboard/templates" },
    { label: "Billing", icon: CreditCard, path: "/dashboard/billing" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const Sidebar = () => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-100 flex flex-col z-40 font-['Satoshi',sans-serif]">
            <div className="h-16 flex items-center px-5 border-b border-gray-100">
                <NavLink to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Clipperz</span>
                </NavLink>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/dashboard"}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "text-gray-900 bg-gray-50"
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
            </nav>

            <div
                className="mx-4 mb-5 p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                    borderColor: "rgba(168, 85, 247, 0.2)",
                }}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                        <Zap className="w-5 h-5 text-purple-500" />
                    </div>
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">Pro Plan</p>
                <p className="text-sm text-gray-500 mb-4">12 clips remaining</p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-medium rounded-2xl shadow-md shadow-purple-200 transition-all duration-200 hover:shadow-lg active:scale-[0.98]">
                    <TrendingUp className="w-4 h-4" />
                    Upgrade Plan
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
