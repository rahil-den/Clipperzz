import { useState } from "react";
import { FileText, Search, Filter, Download, Clock, User, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";

const mockLogs = [
    { id: 1, action: "User suspended", admin: "john.admin@clipperz.io", target: "mike@example.com", timestamp: "Jan 15, 2024 14:32", type: "user" },
    { id: 2, action: "Pricing updated", admin: "super@clipperz.io", target: "Pro Monthly: $29 → $35", timestamp: "Jan 15, 2024 12:15", type: "system" },
    { id: 3, action: "Admin created", admin: "super@clipperz.io", target: "sarah.m@clipperz.io", timestamp: "Jan 14, 2024 16:45", type: "admin" },
    { id: 4, action: "Clip deleted", admin: "john.admin@clipperz.io", target: "Clip #4521", timestamp: "Jan 14, 2024 11:20", type: "content" },
    { id: 5, action: "Feature flag toggled", admin: "super@clipperz.io", target: "Beta Features: ON", timestamp: "Jan 13, 2024 09:30", type: "system" },
    { id: 6, action: "User role changed", admin: "sarah.m@clipperz.io", target: "alex@example.com → Premium", timestamp: "Jan 12, 2024 15:10", type: "user" },
    { id: 7, action: "Maintenance mode enabled", admin: "super@clipperz.io", target: "Platform-wide", timestamp: "Jan 11, 2024 23:00", type: "system" },
];

const SystemLogs = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5;

    const totalPages = Math.ceil(mockLogs.length / logsPerPage);
    const startIndex = (currentPage - 1) * logsPerPage;
    const displayedLogs = mockLogs.slice(startIndex, startIndex + logsPerPage);

    const getActionTypeStyle = (type) => {
        const styles = {
            user: { bg: "bg-purple-100", text: "text-purple-700" },
            system: { bg: "bg-emerald-100", text: "text-emerald-700" },
            admin: { bg: "bg-orange-100", text: "text-orange-700" },
            content: { bg: "bg-gray-100", text: "text-gray-700" },
        };
        return styles[type] || styles.user;
    };

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
                <AdminButton variant="outline">
                    <Download className="w-4 h-4" />
                    Export Logs
                </AdminButton>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by action, admin, or target..."
                            className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="h-10 px-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                            <option value="">All Actions</option>
                            <option value="user">User Actions</option>
                            <option value="admin">Admin Actions</option>
                            <option value="system">System Actions</option>
                            <option value="content">Content Actions</option>
                        </select>
                        <select className="h-10 px-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                            <option value="">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
                            {displayedLogs.map((log) => {
                                const typeStyle = getActionTypeStyle(log.type);
                                return (
                                    <tr
                                        key={log.id}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                    >
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
                                                {log.admin.includes("super") ? (
                                                    <Shield className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <User className="w-4 h-4 text-gray-400" />
                                                )}
                                                <p className="text-sm text-gray-600">{log.admin}</p>
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
                                                {log.timestamp}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, mockLogs.length)} of {mockLogs.length} logs
                    </p>
                    <div className="flex items-center gap-2">
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </AdminButton>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <AdminButton
                                key={page}
                                variant={page === currentPage ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </AdminButton>
                        ))}
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
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
