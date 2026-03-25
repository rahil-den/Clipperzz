import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Check, Clock, AlertCircle, MoreHorizontal, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { getVideos } from "../../services/api";

const statusConfig = {
    completed: {
        icon: Check,
        label: "Completed",
        className: "bg-emerald-50 text-emerald-600",
        dotColor: "bg-emerald-500",
    },
    pending: {
        icon: Clock,
        label: "Pending",
        className: "bg-yellow-50 text-yellow-600",
        dotColor: "bg-yellow-500",
    },
    processing: {
        icon: RefreshCw,
        label: "Processing",
        className: "bg-orange-50 text-orange-600",
        dotColor: "bg-orange-500",
    },
    failed: {
        icon: AlertCircle,
        label: "Failed",
        className: "bg-red-50 text-red-600",
        dotColor: "bg-red-500",
    },
};

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentVideos = async () => {
            setIsLoading(true);
            try {
                const data = await getVideos();
                const videos = Array.isArray(data) ? data : (data.videos || []);
                // Take the 5 most recent
                setActivities(videos.slice(0, 5));
            } catch (err) {
                console.error("[RecentActivity.jsx] Error fetching recent videos:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecentVideos();
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden font-['Satoshi',sans-serif] h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <Link
                    to="/dashboard/videos"
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                    View all
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50">
                            <th className="px-6 py-3">Video Title</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                        <span className="text-xs text-gray-400">Loading activity...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : activities.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-400">
                                    No recent activity
                                </td>
                            </tr>
                        ) : (
                            activities.map((activity, index) => {
                                const status = statusConfig[activity.status] || statusConfig.processing;
                                const StatusIcon = status.icon;

                                return (
                                    <tr
                                        key={activity._id}
                                        className={cn(
                                            "hover:bg-gray-50/50 transition-colors cursor-pointer group",
                                            index !== activities.length - 1 && "border-b border-gray-50"
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                {activity.title}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                                    status.className
                                                )}
                                            >
                                                <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)} />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-nowrap">
                                            <span className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivity;
