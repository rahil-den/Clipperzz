import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    CreditCard, Check, ArrowUpRight, Loader2, ExternalLink,
    CalendarClock, BadgeCheck, CheckCircle2, XCircle, History, RefreshCw,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
    getMySubscription,
    getMySubscriptionHistory,
    syncMySubscription,
    createStripeCheckoutSession,
    createStripePortalSession,
} from "../../services/api";

// ── Helpers ──────────────────────────────────────────────────────────────────
const PLAN_PRICE = { starter: 0, pro: 29, enterprise: 99 };

const formatDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
          })
        : "—";

const getPlanBadge = (plan) => {
    const styles = {
        starter: "bg-gray-100 text-gray-600",
        pro: "bg-purple-100 text-purple-700",
        enterprise: "bg-orange-100 text-orange-700",
    };
    return styles[plan] || "bg-gray-100 text-gray-600";
};

const getStatusBadge = (status) => {
    const styles = {
        active: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
        expired: "bg-gray-100 text-gray-500",
    };
    return styles[status] || "bg-gray-100 text-gray-500";
};

// ── Component ─────────────────────────────────────────────────────────────────
const Billing = () => {
    const [subscription, setSubscription] = useState(null);
    const [history, setHistory]           = useState([]);
    const [isLoading, setIsLoading]       = useState(true);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [isStripeLoading, setIsStripeLoading]   = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const pollRef  = useRef(null);

    const paymentSuccess  = searchParams.get("success")  === "true";
    const paymentCanceled = searchParams.get("canceled") === "true";

    // ── Fetch current subscription from DB ───────────────────────────────────
    const fetchSubscription = async () => {
        setIsLoading(true);
        try {
            const data = await getMySubscription();
            setSubscription(data);
            return data;
        } catch {
            setSubscription(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // ── Fetch billing history from DB ────────────────────────────────────────
    const fetchHistory = async () => {
        setIsHistoryLoading(true);
        try {
            const data = await getMySubscriptionHistory();
            setHistory(Array.isArray(data) ? data : []);
        } catch {
            setHistory([]);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    // ── Sync after Stripe payment (webhook-independent) ──────────────────────
    // Calls POST /stripe/sync-subscription which queries Stripe's API directly
    // and writes the real plan/amount to our DB immediately — no webhook wait.
    const syncAfterPayment = async () => {
        try {
            const result = await syncMySubscription();
            if (result?.subscription) {
                // Update UI immediately from the sync response
                setSubscription(result.subscription);
                setIsLoading(false);
            } else {
                // Fallback: re-read from DB
                await fetchSubscription();
            }
        } catch (err) {
            console.warn("[Billing] Sync endpoint failed, falling back to poll:", err);
            setIsLoading(false);
            // Poll DB up to 8× in case webhook fires shortly after
            let attempts = 0;
            const poll = async () => {
                attempts++;
                const data = await fetchSubscription();
                if ((data?.plan && data.plan !== "starter") || attempts >= 8) return;
                pollRef.current = setTimeout(poll, 2000);
            };
            pollRef.current = setTimeout(poll, 2000);
        } finally {
            await fetchHistory();
            navigate("/dashboard/billing", { replace: true });
        }
    };

    useEffect(() => {
        if (paymentSuccess) {
            setIsLoading(true);
            // 800ms so user sees the "Payment successful" banner before sync
            setTimeout(() => syncAfterPayment(), 800);
        } else {
            fetchSubscription();
        }
        fetchHistory();

        return () => {
            if (pollRef.current) clearTimeout(pollRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Plans config ─────────────────────────────────────────────────────────
    const currentPlan = subscription?.plan || "starter";

    const plans = [
        {
            name: "Starter",
            subtitle: "For getting started",
            price: 0,
            features: ["5 videos/month", "15 clips/month", "720p export", "Basic templates"],
            isCurrent: currentPlan === "starter",
            isPopular: false,
        },
        {
            name: "Pro",
            subtitle: "For growing creators",
            price: 29,
            features: ["25 videos/month", "200 clips/month", "1080p export", "All templates", "Priority processing", "Remove watermark"],
            isCurrent: currentPlan === "pro",
            isPopular: true,
        },
        {
            name: "Enterprise",
            subtitle: "For teams & agencies",
            price: 99,
            features: ["Unlimited videos", "Unlimited clips", "4K export", "Custom templates", "API access", "Dedicated support", "Team collaboration"],
            isCurrent: currentPlan === "enterprise",
            isPopular: false,
        },
    ];

    // ── Stripe actions ────────────────────────────────────────────────────────
    const handleUpgrade = async (planName) => {
        const plan = planName.toLowerCase();
        if (plan === "starter") return;
        try {
            setIsStripeLoading(true);
            const data = await createStripeCheckoutSession(plan);
            if (data.url) window.location.href = data.url;
        } catch (error) {
            console.error("Failed to start checkout:", error);
            alert("Failed to connect to billing provider. Please verify your Stripe setup.");
        } finally {
            setIsStripeLoading(false);
        }
    };

    const handleManageBilling = async () => {
        try {
            setIsStripeLoading(true);
            const data = await createStripePortalSession();
            if (data.url) window.location.href = data.url;
        } catch (error) {
            console.error("Failed to start portal:", error);
            alert("Could not load billing portal. You must have an active paid subscription first.");
        } finally {
            setIsStripeLoading(false);
        }
    };

    // ── Loading state ─────────────────────────────────────────────────────────
    if (isLoading && !paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading billing details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-['Satoshi',sans-serif]">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
                <p className="text-gray-500 mt-1">Manage your subscription and payment methods</p>
            </div>

            {/* ── Payment success banner ──────────────────────────────────── */}
            {paymentSuccess && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-emerald-800">Payment successful! 🎉</p>
                        <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1.5">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Activating your subscription — updating your plan now…
                        </p>
                    </div>
                </div>
            )}

            {/* ── Payment canceled banner ─────────────────────────────────── */}
            {paymentCanceled && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                    <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <p className="text-sm font-medium text-orange-700">Payment was canceled. No charges were made.</p>
                </div>
            )}

            {/* ── Current plan banner ─────────────────────────────────────── */}
            <div
                className="rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.03) 100%)",
                    borderColor: "rgba(16,185,129,0.2)",
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                {currentPlan} Plan
                            </h3>
                            <span className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-full",
                                subscription?.status === "active"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-gray-100 text-gray-500"
                            )}>
                                {subscription?.status === "active" ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            ${PLAN_PRICE[currentPlan] ?? 0}/month
                            {subscription?.endDate
                                ? ` • Renews on ${formatDate(subscription.endDate)}`
                                : subscription?.nextBillingDate
                                ? ` • Renews on ${formatDate(subscription.nextBillingDate)}`
                                : ""}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleManageBilling}
                        disabled={isStripeLoading}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Manage Billing
                    </button>
                    {(currentPlan === "starter" || !subscription) && (
                        <button
                            onClick={() => handleUpgrade("pro")}
                            disabled={isStripeLoading}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl transition-colors shadow-md shadow-purple-200 disabled:opacity-50"
                        >
                            {isStripeLoading ? "Loading..." : "Upgrade Plan"}
                            {!isStripeLoading && <ArrowUpRight className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Available Plans ─────────────────────────────────────────── */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
                <div className="grid md:grid-cols-3 gap-5">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "bg-white rounded-2xl border-2 p-6 relative transition-all duration-300 hover:shadow-lg",
                                plan.isPopular ? "border-purple-400 shadow-lg" : "border-gray-100",
                                plan.isCurrent && "ring-2 ring-emerald-400 border-emerald-200"
                            )}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
                                    Most Popular
                                </div>
                            )}
                            {plan.isCurrent && (
                                <div className="absolute -top-3 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-md flex items-center gap-1">
                                    <BadgeCheck className="w-3 h-3" /> Current
                                </div>
                            )}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{plan.subtitle}</p>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-500"> /month</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => !plan.isCurrent && handleUpgrade(plan.name)}
                                className={cn(
                                    "w-full py-2.5 text-sm font-medium rounded-2xl transition-all duration-200",
                                    plan.isCurrent
                                        ? "bg-emerald-50 text-emerald-600 cursor-default border border-emerald-200"
                                        : plan.name === "Starter"
                                        ? "bg-gray-100 text-gray-400 cursor-default"
                                        : "bg-gray-100 text-gray-700 hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-200 active:scale-[0.98]"
                                )}
                                disabled={plan.isCurrent || isStripeLoading || plan.name === "Starter"}
                            >
                                {plan.isCurrent
                                    ? "✓ Current Plan"
                                    : plan.name === "Starter"
                                    ? "Free Plan"
                                    : isStripeLoading
                                    ? "Loading..."
                                    : `Upgrade to ${plan.name}`}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Subscription Details ────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <CalendarClock className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>
                </div>
                {subscription ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Plan</p>
                            <p className="text-base font-bold text-gray-900 capitalize">{subscription.plan || "Starter"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                                subscription.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            )}>
                                <BadgeCheck className="w-3.5 h-3.5" />
                                {subscription.status
                                    ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
                                    : "Inactive"}
                            </span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Start Date</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(subscription.startDate)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">
                                {subscription.status === "active" ? "Renews On" : "Expired On"}
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatDate(subscription.endDate || subscription.nextBillingDate)}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">No active subscription</p>
                            <p className="text-xs text-gray-400 mt-0.5">Upgrade to a paid plan to see billing details here.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Billing History Table ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                    </div>
                    <button
                        onClick={fetchHistory}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                </div>

                {isHistoryLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                            <History className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No billing history yet</p>
                        <p className="text-xs text-gray-400 mt-1">Your subscription records will appear here once you subscribe.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((row) => (
                                    <tr
                                        key={row._id}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(row.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                                getPlanBadge(row.plan)
                                            )}>
                                                {row.plan || "Starter"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ${row.amount ?? PLAN_PRICE[row.plan] ?? 0}
                                                <span className="text-xs font-normal text-gray-400">/mo</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(row.startDate)}
                                            {row.endDate && <> — {formatDate(row.endDate)}</>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                                getStatusBadge(row.status)
                                            )}>
                                                {row.status || "active"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Stripe Portal CTA */}
                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Need invoices or want to update your payment method?</p>
                        <p className="text-xs text-gray-400 mt-0.5">Manage your billing details securely via the Stripe customer portal.</p>
                    </div>
                    <button
                        onClick={handleManageBilling}
                        disabled={isStripeLoading}
                        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open Stripe Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Billing;
