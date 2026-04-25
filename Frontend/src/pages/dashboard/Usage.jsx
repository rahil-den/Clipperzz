import { useEffect, useState, useRef } from "react";
import { 
  BarChart3, 
  Clock, 
  Video, 
  Scissors, 
  History, 
  TrendingUp, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  ArrowUpRight 
} from "lucide-react";
import { getMyUsage } from "../../services/api";
import { cn } from "../../lib/utils";

const UsageCard = ({ icon: Icon, label, value, total, unit, color = "emerald" }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);
    const percentage = Math.round((value / total) * 100) || 0;
    const remaining = 100 - percentage;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    setTimeout(() => setAnimatedWidth(percentage), 100);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [percentage]);

    const colors = {
        emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-500" },
        orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600", bar: "bg-orange-500" },
        purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", bar: "bg-purple-500" },
        blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", bar: "bg-blue-500" },
    };

    const style = colors[color] || colors.emerald;

    return (
        <div ref={ref} className="bg-white rounded-2xl border border-gray-100 p-5 font-['Satoshi',sans-serif]">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", style.icon)}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-400">/ {total} {unit}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", style.bar)}
                    style={{ width: `${animatedWidth}%` }}
                />
            </div>
            <p className="text-xs text-gray-400">{remaining}% remaining</p>
        </div>
    );
};

const Usage = () => {
    const [usageData, setUsageData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsage = async () => {
            setIsLoading(true);
            try {
                // Assuming getAllUsage returns an array of usage records for the user or the admin
                // For a regular user, it might return just their usage.
                const data = await getMyUsage();
                // If it's an array, take the first one; otherwise use the object
                const usage = Array.isArray(data) ? data[0] : data;
                setUsageData(usage || {});
            } catch (err) {
                console.error("[Usage.jsx] Error fetching usage:", err);
                setError("Failed to load usage statistics.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsage();
    }, []);

    const stats = [
        {
            label: "Monthly Limit",
            value: usageData?.videosProcessed || 0,
            limit: usageData?.monthlyLimit || 10,
            icon: Video,
            color: "emerald",
            unit: "videos"
        },
        {
            label: "Clips Generated",
            value: usageData?.clipsGenerated || 0,
            limit: 100, // Default limit if not in DB
            icon: Scissors,
            color: "purple",
            unit: "clips"
        },
        {
            label: "Account Status",
            value: "Active",
            total: "Pro",
            icon: BarChart3,
            color: "blue",
            unit: ""
        },
    ];

    const recentActivity = usageData?.recentActivity || [
        { id: 1, action: "Video Processed", item: "Podcast Ep #45", date: "2 hours ago" },
        { id: 2, action: "Clips Generated", item: "Marketing Recap", date: "5 hours ago" },
        { id: 3, action: "Video Exported", item: "Product Demo", date: "1 day ago" },
        { id: 4, action: "Transcription", item: "Strategy Meeting", date: "2 days ago" },
    ];

    const weeklyData = [
        { day: "Mon", value: 12 },
        { day: "Tue", value: 8 },
        { day: "Wed", value: 24 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 32 },
        { day: "Sat", value: 18 },
        { day: "Sun", value: 6 },
    ];

    const maxValue = Math.max(...weeklyData.map((d) => d.value));

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Usage & Billing</h1>
                    <p className="text-gray-500 mt-1">Track your consumption and limits</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    Pro Plan
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading usage statistics...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 px-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-500 font-medium mb-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="text-emerald-500 hover:text-emerald-600 font-medium underline"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <UsageCard
                                key={index}
                                icon={stat.icon}
                                label={stat.label}
                                value={stat.value}
                                total={stat.limit}
                                unit={stat.unit}
                                color={stat.color}
                            />
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-6">Weekly Activity</h3>
                            <div className="flex items-end justify-between gap-2 h-24">
                                {weeklyData.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                        <span className="text-[10px] text-gray-500">{item.value}</span>
                                        <div
                                            className={cn(
                                                "w-full rounded-t-lg transition-all duration-500",
                                                item.value > 0 ? "bg-emerald-500" : "bg-gray-200"
                                            )}
                                            style={{ height: `${item.value > 0 ? (item.value / maxValue) * 60 + 10 : 4}px` }}
                                        />
                                        <span className="text-xs text-gray-400">{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                                <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View All</button>
                            </div>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:ring-1 hover:ring-gray-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                                                <History className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                                                <p className="text-xs text-gray-500">{activity.item}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">{activity.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div
                className="rounded-2xl border p-6 flex items-center justify-between"
                style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                    borderColor: "rgba(168, 85, 247, 0.2)"
                }}
            >
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Need more capacity?</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Upgrade to Pro for unlimited clips and priority processing.
                    </p>
                </div>
                <button className="flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-purple-200">
                    Upgrade Plan
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Usage;
