import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RefreshCw, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";
import { getAllJobs, updateJobStatus, deleteJob as apiDeleteJob } from "../../services/api";

const JobsQueue = () => {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({ total: 0, processing: 0, queued: 0, completed: 0, failed: 0 });
    const [filter, setFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getAllJobs();
            setJobs(data);
            
            // Calculate stats
            const newStats = data.reduce((acc, job) => {
                acc.total++;
                acc[job.status]++;
                // Also count completed today (simplified for now)
                if (job.status === "completed") acc.completed++;
                return acc;
            }, { total: 0, processing: 0, queued: 0, completed: 0, failed: 0 });
            setStats(newStats);
        } catch (err) {
            console.error("[JobsQueue] Fetch error:", err);
            setError("Failed to fetch jobs. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
        // Optional: poll every 30 seconds
        const interval = setInterval(fetchJobs, 30000);
        return () => clearInterval(interval);
    }, [fetchJobs]);

    const handleAction = async (id, action) => {
        try {
            if (action === "delete") {
                await apiDeleteJob(id);
            } else {
                await updateJobStatus(id, { status: action });
            }
            fetchJobs();
        } catch (err) {
            console.error(`[JobsQueue] Action ${action} error:`, err);
            alert(`Failed to ${action} job.`);
        }
    };

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
        return styles[status] || styles.queued;
    };

    const filteredJobs = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

    const formatTime = (date) => {
        if (!date) return "--";
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000 / 60); // minutes
        if (diff < 1) return "Just now";
        if (diff < 60) return `${diff} min ago`;
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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
                    <AdminButton variant="outline" disabled={isLoading}>
                        <Pause className="w-4 h-4" />
                        Pause Queue
                    </AdminButton>
                    <AdminButton onClick={fetchJobs} disabled={isLoading}>
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Refresh
                    </AdminButton>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={fetchJobs} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500 mb-1">Total in Queue</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl border border-purple-100 p-4">
                    <p className="text-sm text-purple-600 mb-1">Processing</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.processing}</p>
                </div>
                <div className="bg-white rounded-2xl border border-orange-100 p-4">
                    <p className="text-sm text-orange-600 mb-1">Queued</p>
                    <p className="text-2xl font-bold text-orange-700">{stats.queued}</p>
                </div>
                <div className="bg-white rounded-2xl border border-emerald-100 p-4">
                    <p className="text-sm text-emerald-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-emerald-700">{stats.completed}</p>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-4">
                    <p className="text-sm text-red-600 mb-1">Failed</p>
                    <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
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
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative">
                {isLoading && jobs.length === 0 && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                )}
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
                        {filteredJobs.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No jobs found matching the filter.
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => {
                                const statusStyle = getStatusStyle(job.status);
                                return (
                                    <tr key={job._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-gray-900">...{job._id.slice(-8)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 capitalize">{job.type.replace("_", " ")}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{job.user?.email || "Unknown User"}</span>
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
                                            <span className="text-sm text-gray-500">{formatTime(job.startedAt)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {job.status === "processing" && (
                                                    <AdminButton variant="ghost" size="icon" title="Pause" onClick={() => handleAction(job._id, "queued")}>
                                                        <Pause className="w-4 h-4" />
                                                    </AdminButton>
                                                )}
                                                {job.status === "queued" && (
                                                    <AdminButton variant="ghost" size="icon" title="Start Now" onClick={() => handleAction(job._id, "processing")}>
                                                        <Play className="w-4 h-4 text-emerald-500" />
                                                    </AdminButton>
                                                )}
                                                {job.status === "failed" && (
                                                    <AdminButton variant="ghost" size="icon" title="Retry" onClick={() => handleAction(job._id, "queued")}>
                                                        <RefreshCw className="w-4 h-4 text-orange-500" />
                                                    </AdminButton>
                                                )}
                                                <AdminButton variant="ghost" size="icon" title="Delete" onClick={() => handleAction(job._id, "delete")}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </AdminButton>
                                            </div>
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

export default JobsQueue;
