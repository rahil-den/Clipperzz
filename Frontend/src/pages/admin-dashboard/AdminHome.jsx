import { useOutletContext, Link } from "react-router-dom";
import { Users, Scissors, DollarSign, Activity, Server, ArrowRight, Clock, TrendingUp } from "lucide-react";
import AdminStatCard from "../../components/admin-dashboard-components/AdminStatCard";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";

const recentActivity = [
    { id: 1, action: "New user registered", user: "alex@example.com", time: "2 min ago", type: "user" },
    { id: 2, action: "Payment received", user: "sarah@gmail.com", amount: "$29.00", time: "15 min ago", type: "payment" },
    { id: 3, action: "Clip flagged for review", user: "mike@example.com", time: "1 hour ago", type: "clip" },
    { id: 4, action: "Admin login", user: "admin@clipperz.io", time: "2 hours ago", type: "admin" },
    { id: 5, action: "User upgraded to Pro", user: "emily@test.com", time: "3 hours ago", type: "upgrade" },
];

const quickLinks = [
    { label: "User Management", path: "/admin/users", icon: Users, color: "emerald" },
    { label: "Clips Overview", path: "/admin/clips", icon: Scissors, color: "purple" },
    { label: "View Reports", path: "/admin/reports", icon: TrendingUp, color: "orange" },
];

const AdminHome = () => {
    const { isSuperAdmin } = useOutletContext();

    const stats = [
        { icon: Users, value: "1,234", label: "Total Users", change: "12%", variant: "emerald" },
        { icon: Activity, value: "892", label: "Active Users", change: "8%", variant: "purple" },
        { icon: Scissors, value: "8,456", label: "Clips Generated", change: "23%", variant: "orange" },
        { icon: DollarSign, value: "$12,450", label: "Revenue", change: "18%", variant: "emerald" },
        { icon: Server, value: "42%", label: "System Load", variant: "gray" },
    ];

    const getActivityIcon = (type) => {
        const icons = {
            user: <Users className="w-4 h-4 text-emerald-500" />,
            payment: <DollarSign className="w-4 h-4 text-purple-500" />,
            clip: <Scissors className="w-4 h-4 text-orange-500" />,
            admin: <Activity className="w-4 h-4 text-gray-500" />,
            upgrade: <TrendingUp className="w-4 h-4 text-emerald-500" />,
        };
        return icons[type] || icons.user;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1 text-base">
                    {isSuperAdmin ? "Super Admin access enabled • Full system control" : "Welcome to the admin panel"}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {stats.map((stat, index) => (
                    <AdminStatCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Links & Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Links */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-150 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${link.color}-100`}>
                                            <link.icon className={`w-5 h-5 text-${link.color}-500`} />
                                        </div>
                                        <span className="font-medium text-gray-700">{link.label}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-150" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                            <AdminButton variant="ghost" size="sm">
                                View All
                            </AdminButton>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-150"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-sm text-gray-500">
                                                {activity.user}
                                                {activity.amount && <span className="text-emerald-600 ml-2">{activity.amount}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
