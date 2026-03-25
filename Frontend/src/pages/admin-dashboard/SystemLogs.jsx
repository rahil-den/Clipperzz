import { useState, useEffect, useCallback } from "react";
import { FileText, Search, Filter, Download, Clock, User, Shield, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";
import { getLogs, clearLogs as apiClearLogs } from "../../services/api";

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const logsPerPage = 10;

    const fetchLogs = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = {
                type: typeFilter || undefined,
                limit: logsPerPage,
                skip: (currentPage - 1) * logsPerPage,
                // Search is currently handled client-side or needs backend support
            };
            const data = await getLogs(params);
            setLogs(data.logs);
            setTotalLogs(data.total);
        } catch (err) {
            console.error("[SystemLogs] Fetch error:", err);
            setError("Failed to fetch system logs.");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, typeFilter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleClearLogs = async () => {
        if (!window.confirm("Are you sure you want to clear all system logs? This action cannot be undone.")) return;
        try {
            await apiClearLogs();
            fetchLogs();
        } catch (err) {
            alert("Failed to clear logs.");
        }
    };

    const getActionTypeStyle = (type) => {
        const styles = {
            user: { bg: "bg-purple-100", text: "text-purple-700" },
            system: { bg: "bg-emerald-100", text: "text-emerald-700" },
            admin: { bg: "bg-orange-100", text: "text-orange-700" },
            content: { bg: "bg-gray-100", text: "text-gray-700" },
            payment: { bg: "bg-blue-100", text: "text-blue-700" },
        };
        return styles[type] || styles.user;
    };

    const totalPages = Math.ceil(totalLogs / logsPerPage);
    const startIndex = (currentPage - 1) * logsPerPage;
    
    // Simple client-side search filtering (can be moved to backend later)
    const displayedLogs = logs.filter(log => 
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.admin?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                            System Logs
                        </h1>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            SUPER ADMIN ONLY
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">Audit trail of all admin and super admin actions</p>
                </div>
                <div className="flex items-center gap-3">
                    <AdminButton variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleClearLogs}>
                        <Trash2 className="w-4 h-4" />
                        Clear All Logs
                    </AdminButton>
                    <AdminButton variant="outline">
                        <Download className="w-4 h-4" />
                        Export Logs
                    </AdminButton>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={fetchLogs} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by action, admin email, or target..."
                            className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                            className="h-10 px-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                            <option value="">All Types</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="system">System</option>
                            <option value="content">Content</option>
                            <option value="payment">Payment</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedLogs.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No logs found.
                                    </td>
                                </tr>
                            ) : (
                                displayedLogs.map((log) => {
                                    const typeStyle = getActionTypeStyle(log.type);
                                    return (
                                        <tr
                                            key={log._id}
                                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                         Tracy>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                                                        <FileText className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <p className="font-medium text-gray-900">{log.action}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {log.admin?.role === "superadmin" ? (
                                                        <Shield className="w-4 h-4 text-emerald-500" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <p className="text-sm text-gray-600">{log.admin?.email || "Unknown"}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600">{log.target}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", typeStyle.bg, typeStyle.text)}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, totalLogs)} of {totalLogs} logs
                    </p>
                    <div className="flex items-center gap-2">
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </AdminButton>
                        
                        <span className="text-sm text-gray-600 px-2 font-medium">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </AdminButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
