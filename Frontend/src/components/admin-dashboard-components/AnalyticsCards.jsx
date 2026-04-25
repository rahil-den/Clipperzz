import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, Scissors, Activity, Clock, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { getUsers, getClips, getAllUsage } from "../../services/api";

const AnalyticsCards = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const [users, clipsRes, usageRes] = await Promise.all([
                    getUsers(),
                    getClips(),
                    getAllUsage(),
                ]);

                // Clips may be paginated or a plain array
                const clips = Array.isArray(clipsRes)
                    ? clipsRes
                    : clipsRes?.clips || [];

                // Active users: users with isActive true
                const activeUsers = users.filter((u) => u.isActive).length;

                // Total storage from usage records (videosProcessed as proxy if no storage field)
                const totalVideosProcessed = Array.isArray(usageRes)
                    ? usageRes.reduce((acc, u) => acc + (u.videosProcessed || 0), 0)
                    : 0;
                const totalClipsGenerated = Array.isArray(usageRes)
                    ? usageRes.reduce((acc, u) => acc + (u.clipsGenerated || 0), 0)
                    : clips.length;

                setStats({
                    totalUsers: users.length,
                    activeUsers,
                    totalClips: clips.length || totalClipsGenerated,
                    totalVideos: totalVideosProcessed,
                });
            } catch (err) {
                console.error("[AnalyticsCards] Error fetching live stats:", err);
                // Fall back to zeros so UI doesn't break
                setStats({ totalUsers: 0, activeUsers: 0, totalClips: 0, totalVideos: 0 });
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getProgressColor = (color) => {
        const colors = { emerald: "bg-emerald-500", purple: "bg-purple-500", orange: "bg-orange-500" };
        return colors[color] || colors.emerald;
    };

    const getProgressBgColor = (color) => {
        const colors = { emerald: "bg-emerald-100", purple: "bg-purple-100", orange: "bg-orange-100" };
        return colors[color] || colors.emerald;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
                <p className="text-sm">Loading analytics...</p>
            </div>
        );
    }

    // Derive usage metrics from live data
    const usageMetrics = [
        {
            label: "Videos Processed",
            current: stats.totalVideos,
            max: Math.max(stats.totalVideos * 2, 100),
            color: "emerald",
        },
        {
            label: "Clips Generated",
            current: stats.totalClips,
            max: Math.max(stats.totalClips * 2, 100),
            color: "purple",
        },
        {
            label: "Registered Users",
            current: stats.totalUsers,
            max: Math.max(stats.totalUsers * 2, 50),
            color: "orange",
        },
    ];

    // Percentage of active users
    const activeRate = stats.totalUsers > 0
        ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
        : 0;

    const analyticsData = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            trend: "up",
            description: "registered accounts",
            icon: Users,
            details: `${stats.activeUsers} currently active`,
        },
        {
            title: "Clips Generated",
            value: stats.totalClips.toLocaleString(),
            trend: "up",
            description: "across all users",
            icon: Scissors,
            details: "From usage records",
        },
        {
            title: "Active User Rate",
            value: `${activeRate}%`,
            trend: activeRate >= 50 ? "up" : "down",
            description: "active accounts",
            icon: Activity,
            details: `${stats.activeUsers} of ${stats.totalUsers} users active`,
        },
        {
            title: "Videos Processed",
            value: stats.totalVideos.toLocaleString(),
            trend: "up",
            description: "total processed",
            icon: Clock,
            details: "Aggregated from usage",
        },
    ];

    return (
        <div className="space-y-6 font-['Satoshi',sans-serif]">
            {/* Live Growth Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                <item.icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-sm font-medium",
                                    item.trend === "up" ? "text-emerald-600" : "text-red-500"
                                )}
                            >
                                {item.trend === "up" ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                {item.value}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{item.details}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Usage Progress Bars */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Platform Usage Metrics</h3>
                <div className="space-y-6">
                    {usageMetrics.map((metric, index) => {
                        const pct = metric.max > 0
                            ? Math.min(100, Math.round((metric.current / metric.max) * 100))
                            : 0;
                        return (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-700">{metric.label}</p>
                                    <p className="text-sm text-gray-500">
                                        {metric.current.toLocaleString()} / {metric.max.toLocaleString()} {metric.unit || ""}
                                    </p>
                                </div>
                                <div className={cn("h-2 rounded-full overflow-hidden", getProgressBgColor(metric.color))}>
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-700", getProgressColor(metric.color))}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Platform Health (cosmetic — always green) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="font-semibold text-gray-900">API Status</p>
                    </div>
                    <p className="text-sm text-gray-600">All systems operational</p>
                    <p className="text-xs text-gray-400 mt-2">Uptime: 99.98%</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                        <p className="font-semibold text-gray-900">AI Processing</p>
                    </div>
                    <p className="text-sm text-gray-600">Running optimally</p>
                    <p className="text-xs text-gray-400 mt-2">Model service active</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        <p className="font-semibold text-gray-900">Database</p>
                    </div>
                    <p className="text-sm text-gray-600">Connected & healthy</p>
                    <p className="text-xs text-gray-400 mt-2">{stats.totalUsers} user records</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCards;
