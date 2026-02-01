import { Calendar, Download } from "lucide-react";
import AnalyticsCards from "../../components/admin-dashboard-components/AnalyticsCards";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";

const Reports = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-500 mt-1">Platform analytics, growth trends, and usage metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Last 30 days
                    </div>
                    <AdminButton variant="outline">
                        <Download className="w-4 h-4" />
                        Export Report
                    </AdminButton>
                </div>
            </div>

            {/* Analytics Content */}
            <AnalyticsCards />
        </div>
    );
};

export default Reports;
