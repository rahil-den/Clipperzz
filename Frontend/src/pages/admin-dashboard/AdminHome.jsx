import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Users, Scissors, DollarSign, Activity, Server, ArrowRight, Clock, TrendingUp, Loader2, MessageSquare } from "lucide-react";
import AdminStatCard from "../../components/admin-dashboard-components/AdminStatCard";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { getUsers, getClips, getAllUsage, getLogs, getAllReports } from "../../services/api";

const AdminHome = () => {
    const { isSuperAdmin } = useOutletContext();
    const [statsData, setStatsData] = useState({
        totalUsers: 0,
        activeUsers: 0,
        clipsGenerated: 0,
        pendingReports: 0,
        adminActions: 0
    });
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const quickLinks = [
        { label: "User Management", path: "/admin/users", icon: Users, color: "emerald" },
        { label: "Clips Overview", path: "/admin/clips", icon: Scissors, color: "purple" },
        { label: "User Reports", path: "/admin/reports", icon: MessageSquare, color: "orange" },
    ];

    useEffect(() => {
        const fetchAdminStats = async () => {
            setIsLoading(true);
            try {
                const [users, clips, usage, logsData, reports] = await Promise.all([
                    getUsers(),
                    getClips(),
                    getAllUsage(),
                    getLogs({ limit: 5 }),
                    getAllReports()
                ]);

                setStatsData({
                    totalUsers: users.length || 0,
                    activeUsers: users.filter(u => u.status === "active").length || 0,
                    clipsGenerated: clips.length || (clips.clips?.length || 0),
                    pendingReports: reports.filter(r => r.status !== "resolved").length || 0,
                    adminActions: logsData.total || 0
                });

                setActivities(logsData.logs.map(log => ({
                    id: log._id,
                    action: log.action,
                    user: log.admin?.email || "System",
                    time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: log.type
                })));
            } catch (err) {
                console.error("[AdminHome.jsx] Error fetching admin stats:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAdminStats();
    }, []);

    const stats = [
        { icon: Users, value: statsData.totalUsers.toLocaleString(), label: "Total Users", variant: "emerald" },
        { icon: Activity, value: statsData.activeUsers.toLocaleString(), label: "Active Users", variant: "purple" },
        { icon: Scissors, value: statsData.clipsGenerated.toLocaleString(), label: "Clips Generated", variant: "orange" },
        { icon: MessageSquare, value: statsData.pendingReports.toLocaleString(), label: "Pending Reports", variant: "emerald" },
        { icon: Server, value: statsData.adminActions.toLocaleString(), label: "Admin Actions", variant: "gray" },
    ];

    const getActivityIcon = (type) => {
        const icons = {
            user: <Users className="w-4 h-4 text-emerald-500" />,
            payment: <DollarSign className="w-4 h-4 text-purple-500" />,
            clip: <Scissors className="w-4 h-4 text-orange-500" />,
            admin: <Activity className="w-4 h-4 text-gray-500" />,
            upgrade: <TrendingUp className="w-4 h-4 text-emerald-500" />,
            auth: <Activity className="w-4 h-4 text-blue-500" />,
            system: <Server className="w-4 h-4 text-gray-500" />,
        };
        return icons[type] || icons.user;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading admin overview...</p>
            </div>
        );
    }

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
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50`}>
                                            <link.icon className={`w-5 h-5 text-emerald-500`} />
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
                            <h2 className="font-semibold text-gray-900">Recent System Activity</h2>
                            <Link to="/admin/logs">
                                <AdminButton variant="ghost" size="sm">
                                    View All
                                </AdminButton>
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {activities.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">No recent activity detected.</div>
                            ) : (
                                activities.map((activity) => (
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
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                            <Clock className="w-4 h-4" />
                                            {activity.time}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
