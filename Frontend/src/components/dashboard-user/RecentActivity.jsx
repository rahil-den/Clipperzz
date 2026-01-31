import { Link } from "react-router-dom";
import { ExternalLink, Check, Clock, AlertCircle, MoreHorizontal, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

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

const RecentActivity = ({ activities = [] }) => {
    const defaultActivities = [
        {
            id: 1,
            title: "How to Build a SaaS in 2024 - Complet...",
            clips: 8,
            status: "completed",
            date: "2 hours ago",
        },
        {
            id: 2,
            title: "Top 10 AI Tools for Content Creators",
            clips: 5,
            status: "completed",
            date: "Yesterday",
        },
        {
            id: 3,
            title: "The Future of Short Form Video Content",
            clips: "—",
            status: "processing",
            date: "Just now",
        },
        {
            id: 4,
            title: "Podcast Episode #42 - Marketing Strate...",
            clips: "—",
            status: "pending",
            date: "5 min ago",
        },
    ];

    const displayActivities = activities.length > 0 ? activities : defaultActivities;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden font-['Satoshi',sans-serif]">
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
                            <th className="px-6 py-3">Clips</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayActivities.map((activity, index) => {
                            const status = statusConfig[activity.status];
                            const StatusIcon = status.icon;

                            return (
                                <tr
                                    key={activity.id}
                                    className={cn(
                                        "hover:bg-gray-50/50 transition-colors cursor-pointer group",
                                        index !== displayActivities.length - 1 && "border-b border-gray-50"
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                            {activity.title}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{activity.clips}</span>
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
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{activity.date}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivity;
