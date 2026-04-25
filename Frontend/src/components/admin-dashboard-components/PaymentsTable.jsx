import { useState, useEffect } from "react";
import {
    DollarSign, TrendingUp, CreditCard, FileText,
    ChevronLeft, ChevronRight, Download, Loader2, RefreshCw, AlertCircle, Zap
} from "lucide-react";
import { cn } from "../../lib/utils";
import AdminStatCard from "./AdminStatCard";
import { AdminButton } from "./AdminButton";
import { getAllSubscriptions, syncAllSubscriptions } from "../../services/api";


// ── Helpers ───────────────────────────────────────────────────────────────────

const PLAN_PRICE = { starter: 0, pro: 29, enterprise: 99 };

const getPlanLabel = (plan) => {
    const labels = { starter: "Starter", pro: "Pro", enterprise: "Enterprise" };
    return labels[plan] || plan || "—";
};

const getPlanBadgeClass = (plan) => {
    const styles = {
        starter: "bg-gray-100 text-gray-700",
        pro: "bg-purple-100 text-purple-700",
        enterprise: "bg-orange-100 text-orange-700",
    };
    return styles[plan] || "bg-gray-100 text-gray-600";
};

const getStatusBadge = (status) => {
    const styles = {
        active: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Active" },
        cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
        expired: { bg: "bg-gray-100", text: "text-gray-600", label: "Expired" },
    };
    const s = styles[status] || styles.active;
    return (
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", s.bg, s.text)}>
            {s.label}
        </span>
    );
};

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
};

// ── Component ─────────────────────────────────────────────────────────────────

const PaymentsTable = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading]   = useState(true);
    const [isSyncing, setIsSyncing]   = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [error, setError]           = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await getAllSubscriptions();
            setSubscriptions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("[PaymentsTable] Error fetching subscriptions:", err);
            setError("Failed to load subscription data.");
        } finally {
            setIsLoading(false);
        }
    };

    // Pull real plan/amount for every Stripe customer directly from Stripe API.
    // Fixes stale $0 / "starter" records that predate webhook support.
    const handleSyncAll = async () => {
        setIsSyncing(true);
        setSyncResult(null);
        try {
            const result = await syncAllSubscriptions();
            setSyncResult(result);
            // Reload the table so updated amounts show immediately
            await fetchSubscriptions();
        } catch (err) {
            console.error("[PaymentsTable] Sync error:", err);
            setSyncResult({ error: true });
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    // ── Derived stats from real data ──────────────────────────────────────────
    const paidSubs = subscriptions.filter((s) => s.plan !== "starter");
    const activeSubs = subscriptions.filter((s) => s.status === "active");
    const totalRevenue = subscriptions.reduce(
        (acc, s) => acc + (PLAN_PRICE[s.plan] || 0), 0
    );

    // Subscriptions started this calendar month
    const now = new Date();
    const thisMonthRevenue = subscriptions
        .filter((s) => {
            if (!s.startDate) return false;
            const d = new Date(s.startDate);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((acc, s) => acc + (PLAN_PRICE[s.plan] || 0), 0);

    // Breakdown by plan
    const proCount = subscriptions.filter((s) => s.plan === "pro").length;
    const enterpriseCount = subscriptions.filter((s) => s.plan === "enterprise").length;
    const starterCount = subscriptions.filter((s) => s.plan === "starter").length;

    // Pagination
    const totalPages = Math.max(1, Math.ceil(subscriptions.length / perPage));
    const startIdx = (currentPage - 1) * perPage;
    const paginated = subscriptions.slice(startIdx, startIdx + perPage);

    // ── Export CSV ────────────────────────────────────────────────────────────
    const handleExport = () => {
        const rows = [
            ["User", "Email", "Plan", "Amount", "Start Date", "Status"],
            ...subscriptions.map((s) => [
                s.user?.name || "—",
                s.user?.email || "—",
                getPlanLabel(s.plan),
                `$${PLAN_PRICE[s.plan] || 0}`,
                formatDate(s.startDate),
                s.status,
            ]),
        ];
        const csv = rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subscriptions_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
                <p className="text-gray-500 text-sm font-medium">Loading payment data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
                <AdminButton onClick={fetchSubscriptions} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </AdminButton>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-['Satoshi',sans-serif]">

            {/* Revenue Stats — live data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatCard
                    icon={DollarSign}
                    value={`$${totalRevenue.toLocaleString()}`}
                    label="Total Revenue (MRR)"
                    variant="emerald"
                />
                <AdminStatCard
                    icon={TrendingUp}
                    value={`$${thisMonthRevenue.toLocaleString()}`}
                    label="This Month"
                    variant="purple"
                />
                <AdminStatCard
                    icon={CreditCard}
                    value={activeSubs.length.toLocaleString()}
                    label="Active Subscriptions"
                    variant="orange"
                />
            </div>

            {/* Subscription Breakdown — live data */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-gray-700">{starterCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Starter (Free)</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-600">{proCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Pro ($29/mo)</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                        <p className="text-2xl font-bold text-orange-600">{enterpriseCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Enterprise ($99/mo)</p>
                    </div>
                </div>
            </div>

            {/* Subscriptions Table — real rows */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Subscription History</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{subscriptions.length} total records</p>
                        {syncResult && !syncResult.error && (
                            <p className="text-xs text-emerald-600 mt-1 font-medium">
                                ✓ Synced {syncResult.synced} records from Stripe
                            </p>
                        )}
                        {syncResult?.error && (
                            <p className="text-xs text-red-500 mt-1">Sync failed — check Stripe key</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={handleSyncAll}
                            disabled={isSyncing || isLoading}
                            title="Pull real plan & amount from Stripe API for every user"
                        >
                            {isSyncing
                                ? <><Loader2 className="w-4 h-4 animate-spin" />Syncing…</>
                                : <><Zap className="w-4 h-4 text-amber-500" />Sync from Stripe</>
                            }
                        </AdminButton>
                        <AdminButton variant="ghost" size="sm" onClick={fetchSubscriptions} disabled={isLoading}>
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </AdminButton>
                        <AdminButton variant="outline" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                            Export CSV
                        </AdminButton>
                    </div>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <CreditCard className="w-10 h-10 mb-3 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">No subscription records yet</p>
                        <p className="text-xs text-gray-400 mt-1">Records will appear when users subscribe</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stripe ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((sub) => (
                                    <tr
                                        key={sub._id}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{sub.user?.name || "—"}</p>
                                            <p className="text-sm text-gray-500">{sub.user?.email || "—"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium",
                                                getPlanBadgeClass(sub.plan)
                                            )}>
                                                {getPlanLabel(sub.plan)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">
                                                ${sub.amount ?? PLAN_PRICE[sub.plan] ?? 0}<span className="text-gray-400 text-xs font-normal">/mo</span>
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{formatDate(sub.startDate)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{formatDate(sub.endDate)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(sub.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {sub.stripeSubscriptionId ? (
                                                <span
                                                    className="text-xs text-gray-400 font-mono"
                                                    title={sub.stripeSubscriptionId}
                                                >
                                                    {sub.stripeSubscriptionId.slice(0, 12)}…
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-300">No Stripe ID</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {subscriptions.length > perPage && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {startIdx + 1}–{Math.min(startIdx + perPage, subscriptions.length)} of {subscriptions.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <AdminButton
                                variant="outline" size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                                variant="outline" size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </AdminButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentsTable;
