import { useState } from "react";
import { DollarSign, TrendingUp, CreditCard, FileText, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn } from "../../lib/utils";
import AdminStatCard from "./AdminStatCard";
import { AdminButton } from "./AdminButton";

const mockTransactions = [
    { id: 1, user: "Alex Johnson", email: "alex@example.com", plan: "Pro Monthly", amount: 29, date: "Jan 15, 2024", status: "completed" },
    { id: 2, user: "Sarah Wilson", email: "sarah@gmail.com", plan: "Pro Annual", amount: 290, date: "Jan 14, 2024", status: "completed" },
    { id: 3, user: "Mike Chen", email: "mike@example.com", plan: "Pro Monthly", amount: 29, date: "Jan 13, 2024", status: "completed" },
    { id: 4, user: "Emily Brown", email: "emily@test.com", plan: "Pro Monthly", amount: 29, date: "Jan 12, 2024", status: "refunded" },
    { id: 5, user: "David Lee", email: "david@example.com", plan: "Enterprise", amount: 99, date: "Jan 11, 2024", status: "completed" },
    { id: 6, user: "Lisa Wang", email: "lisa@gmail.com", plan: "Pro Annual", amount: 290, date: "Jan 10, 2024", status: "pending" },
];

const PaymentsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;

    const totalPages = Math.ceil(mockTransactions.length / transactionsPerPage);
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const displayedTransactions = mockTransactions.slice(startIndex, startIndex + transactionsPerPage);

    const revenueStats = [
        { icon: DollarSign, value: "$12,450", label: "Total Revenue", change: "18%", variant: "emerald" },
        { icon: TrendingUp, value: "$2,340", label: "This Month", change: "12%", variant: "purple" },
        { icon: CreditCard, value: "156", label: "Active Subscriptions", variant: "orange" },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            completed: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed" },
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
            refunded: { bg: "bg-red-100", text: "text-red-700", label: "Refunded" },
        };
        const style = styles[status] || styles.completed;
        return (
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", style.bg, style.text)}>
                {style.label}
            </span>
        );
    };

    const getPlanBadge = (plan) => {
        const styles = {
            "Pro Monthly": "bg-purple-100 text-purple-700",
            "Pro Annual": "bg-emerald-100 text-emerald-700",
            "Enterprise": "bg-orange-100 text-orange-700",
        };
        return (
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", styles[plan] || "bg-gray-100 text-gray-700")}>
                {plan}
            </span>
        );
    };

    return (
        <div className="space-y-6 font-['Satoshi',sans-serif]">
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {revenueStats.map((stat, index) => (
                    <AdminStatCard key={index} {...stat} />
                ))}
            </div>

            {/* Subscription Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-600">89</p>
                        <p className="text-sm text-gray-500 mt-1">Pro Monthly</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-xl">
                        <p className="text-2xl font-bold text-emerald-600">52</p>
                        <p className="text-sm text-gray-500 mt-1">Pro Annual</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                        <p className="text-2xl font-bold text-orange-600">15</p>
                        <p className="text-sm text-gray-500 mt-1">Enterprise</p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Transaction History</h3>
                    <AdminButton variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                        Export
                    </AdminButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.user}</p>
                                            <p className="text-sm text-gray-500">{transaction.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getPlanBadge(transaction.plan)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900">${transaction.amount}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">{transaction.date}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
                                            <FileText className="w-4 h-4 inline mr-1" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(startIndex + transactionsPerPage, mockTransactions.length)} of {mockTransactions.length} transactions
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

export default PaymentsTable;
