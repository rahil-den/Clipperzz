import { TrendingUp, TrendingDown, Users, Scissors, Activity, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

const analyticsData = [
    {
        title: "User Growth",
        value: "+24%",
        trend: "up",
        description: "vs last month",
        icon: Users,
        details: "1,234 new users this month",
    },
    {
        title: "Clip Generation",
        value: "+18%",
        trend: "up",
        description: "vs last month",
        icon: Scissors,
        details: "8,456 clips generated",
    },
    {
        title: "Platform Usage",
        value: "92%",
        trend: "up",
        description: "active rate",
        icon: Activity,
        details: "Peak hours: 2PM - 6PM",
    },
    {
        title: "Avg. Processing",
        value: "2.3s",
        trend: "down",
        description: "per clip",
        icon: Clock,
        details: "15% faster than last week",
    },
];

const usageMetrics = [
    { label: "Videos Uploaded", current: 2340, max: 5000, color: "emerald" },
    { label: "Storage Used", current: 156, max: 500, unit: "GB", color: "purple" },
    { label: "API Calls", current: 45000, max: 100000, color: "orange" },
];

const AnalyticsCards = () => {
    const getProgressColor = (color) => {
        const colors = {
            emerald: "bg-emerald-500",
            purple: "bg-purple-500",
            orange: "bg-orange-500",
        };
        return colors[color] || colors.emerald;
    };

    const getProgressBgColor = (color) => {
        const colors = {
            emerald: "bg-emerald-100",
            purple: "bg-purple-100",
            orange: "bg-orange-100",
        };
        return colors[color] || colors.emerald;
    };

    return (
        <div className="space-y-6 font-['Satoshi',sans-serif]">
            {/* Growth Trend Cards */}
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

            {/* Usage Metrics */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Platform Usage Metrics</h3>
                <div className="space-y-6">
                    {usageMetrics.map((metric, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-700">{metric.label}</p>
                                <p className="text-sm text-gray-500">
                                    {metric.current.toLocaleString()} / {metric.max.toLocaleString()} {metric.unit || ""}
                                </p>
                            </div>
                            <div className={cn("h-2 rounded-full overflow-hidden", getProgressBgColor(metric.color))}>
                                <div
                                    className={cn("h-full rounded-full transition-all duration-500", getProgressColor(metric.color))}
                                    style={{ width: `${(metric.current / metric.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Health */}
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
                    <p className="text-xs text-gray-400 mt-2">Queue: 12 jobs</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        <p className="font-semibold text-gray-900">Storage</p>
                    </div>
                    <p className="text-sm text-gray-600">31% capacity used</p>
                    <p className="text-xs text-gray-400 mt-2">344 GB available</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCards;
