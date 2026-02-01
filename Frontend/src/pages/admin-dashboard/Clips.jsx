import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import ClipsTable from "../../components/admin-dashboard-components/ClipsTable";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";

const Clips = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        Clips Management
                    </h1>
                    <p className="text-gray-500 mt-1">View and manage all generated clips across the platform</p>
                </div>
                <AdminButton variant="outline">
                    <Download className="w-4 h-4" />
                    Export Data
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
                            placeholder="Search by clip title or user..."
                            className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="h-10 px-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150">
                            <option value="">All Status</option>
                            <option value="ready">Ready</option>
                            <option value="processing">Processing</option>
                            <option value="failed">Failed</option>
                            <option value="flagged">Flagged</option>
                        </select>
                        <select className="h-10 px-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150">
                            <option value="">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        <AdminButton variant="ghost" size="icon">
                            <Filter className="w-4 h-4" />
                        </AdminButton>
                    </div>
                </div>
            </div>

            {/* Clips Table */}
            <ClipsTable />
        </div>
    );
};

export default Clips;
