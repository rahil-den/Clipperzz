import { useState } from "react";
import { Play, Pause, RefreshCw, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";

const mockJobs = [
    { id: "JOB-001", type: "clip_generation", user: "alex@example.com", status: "processing", progress: 65, started: "2 min ago", eta: "~1 min" },
    { id: "JOB-002", type: "video_upload", user: "sarah@gmail.com", status: "queued", progress: 0, started: "5 min ago", eta: "~3 min" },
    { id: "JOB-003", type: "clip_generation", user: "mike@test.com", status: "completed", progress: 100, started: "10 min ago", completed: "8 min ago" },
    { id: "JOB-004", type: "export", user: "emily@example.com", status: "failed", progress: 45, started: "15 min ago", error: "Memory limit exceeded" },
    { id: "JOB-005", type: "clip_generation", user: "john@company.com", status: "queued", progress: 0, started: "20 min ago", eta: "~5 min" },
];

const queueStats = {
    total: 42,
    processing: 8,
    queued: 28,
    completed: 156,
    failed: 6,
};

const JobsQueue = () => {
    const [filter, setFilter] = useState("all");

    const getStatusIcon = (status) => {
        const icons = {
            processing: <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />,
            queued: <Clock className="w-4 h-4 text-orange-500" />,
            completed: <CheckCircle className="w-4 h-4 text-emerald-500" />,
            failed: <XCircle className="w-4 h-4 text-red-500" />,
        };
        return icons[status];
    };

    const getStatusStyle = (status) => {
        const styles = {
            processing: { bg: "bg-purple-100", text: "text-purple-700" },
            queued: { bg: "bg-orange-100", text: "text-orange-700" },
            completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
            failed: { bg: "bg-red-100", text: "text-red-700" },
        };
        return styles[status];
    };

    const filteredJobs = filter === "all" ? mockJobs : mockJobs.filter(j => j.status === filter);

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        Jobs & Queue
                    </h1>
                    <p className="text-gray-500 mt-1">Monitor and manage background processing jobs</p>
                </div>
                <div className="flex items-center gap-3">
                    <AdminButton variant="outline">
                        <Pause className="w-4 h-4" />
                        Pause Queue
                    </AdminButton>
                    <AdminButton>
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </AdminButton>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500 mb-1">Total in Queue</p>
                    <p className="text-2xl font-bold text-gray-900">{queueStats.total}</p>
                </div>
                <div className="bg-white rounded-2xl border border-purple-100 p-4">
                    <p className="text-sm text-purple-600 mb-1">Processing</p>
                    <p className="text-2xl font-bold text-purple-700">{queueStats.processing}</p>
                </div>
                <div className="bg-white rounded-2xl border border-orange-100 p-4">
                    <p className="text-sm text-orange-600 mb-1">Queued</p>
                    <p className="text-2xl font-bold text-orange-700">{queueStats.queued}</p>
                </div>
                <div className="bg-white rounded-2xl border border-emerald-100 p-4">
                    <p className="text-sm text-emerald-600 mb-1">Completed Today</p>
                    <p className="text-2xl font-bold text-emerald-700">{queueStats.completed}</p>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-4">
                    <p className="text-sm text-red-600 mb-1">Failed</p>
                    <p className="text-2xl font-bold text-red-700">{queueStats.failed}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {["all", "processing", "queued", "completed", "failed"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 capitalize",
                            filter === status
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job ID</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Started</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredJobs.map((job) => {
                            const statusStyle = getStatusStyle(job.status);
                            return (
                                <tr key={job.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-gray-900">{job.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 capitalize">{job.type.replace("_", " ")}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{job.user}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(job.status)}
                                            <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", statusStyle.bg, statusStyle.text)}>
                                                {job.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-24">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-500">{job.progress}%</span>
                                                {job.eta && <span className="text-gray-400">{job.eta}</span>}
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-300",
                                                        job.status === "failed" ? "bg-red-500" :
                                                            job.status === "completed" ? "bg-emerald-500" :
                                                                "bg-purple-500"
                                                    )}
                                                    style={{ width: `${job.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{job.started}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            {job.status === "processing" && (
                                                <AdminButton variant="ghost" size="icon" title="Pause">
                                                    <Pause className="w-4 h-4" />
                                                </AdminButton>
                                            )}
                                            {job.status === "queued" && (
                                                <AdminButton variant="ghost" size="icon" title="Start Now">
                                                    <Play className="w-4 h-4 text-emerald-500" />
                                                </AdminButton>
                                            )}
                                            {job.status === "failed" && (
                                                <AdminButton variant="ghost" size="icon" title="Retry">
                                                    <RefreshCw className="w-4 h-4 text-orange-500" />
                                                </AdminButton>
                                            )}
                                            <AdminButton variant="ghost" size="icon" title="Cancel">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </AdminButton>
                                        </div>
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

export default JobsQueue;
