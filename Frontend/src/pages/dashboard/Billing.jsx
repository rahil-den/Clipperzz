import { useState, useEffect } from "react";
import { CreditCard, Check, ArrowUpRight, FileText, Loader2, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import { getMySubscription, createStripeCheckoutSession, createStripePortalSession } from "../../services/api";

const Billing = () => {
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStripeLoading, setIsStripeLoading] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            setIsLoading(true);
            try {
                const data = await getMySubscription();
                setSubscription(data);
            } catch (err) {
                console.error("[Billing.jsx] Error fetching subscription:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubscription();
    }, []);

    const plans = [
        {
            name: "Starter",
            subtitle: "For getting started",
            price: 0,
            features: ["5 videos/month", "15 clips/month", "720p export", "Basic templates"],
            isCurrent: subscription?.plan === "starter",
            isPopular: false,
        },
        {
            name: "Pro",
            subtitle: "For growing creators",
            price: 29,
            features: ["25 videos/month", "200 clips/month", "1080p export", "All templates", "Priority processing", "Remove watermark"],
            isCurrent: subscription?.plan === "pro",
            isPopular: true,
        },
        {
            name: "Enterprise",
            subtitle: "For teams & agencies",
            price: 99,
            features: ["Unlimited videos", "Unlimited clips", "4K export", "Custom templates", "API access", "Dedicated support", "Team collaboration"],
            isCurrent: subscription?.plan === "enterprise",
            isPopular: false,
        },
    ];

    const handleUpgrade = async (planName) => {
        const plan = planName.toLowerCase();
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
            alert("Could not load billing portal. Either you are not a premium customer yet, or setup is incomplete.");
        } finally {
            setIsStripeLoading(false);
        }
    };

    if (isLoading) {
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

            <div
                className="rounded-2xl border p-5 flex items-center justify-between"
                style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)",
                    borderColor: "rgba(16, 185, 129, 0.2)",
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : "Free"} Plan
                            </h3>
                            <span className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-full",
                                subscription?.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            )}>
                                {subscription?.status === "active" ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            {subscription?.plan === "pro" ? "$29" : subscription?.plan === "enterprise" ? "$99" : "$0"} /month • 
                            {subscription?.nextBillingDate ? ` Renews on ${new Date(subscription.nextBillingDate).toLocaleDateString()}` : " No renewal date set"}
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
                    {(subscription?.plan === "starter" || !subscription) && (
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

            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
                <div className="grid md:grid-cols-3 gap-5">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "bg-white rounded-2xl border-2 p-6 relative transition-all duration-300 hover:shadow-lg",
                                plan.isPopular ? "border-purple-400 shadow-lg" : "border-gray-100"
                            )}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
                                    Most Popular
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
                                onClick={() => handleUpgrade(plan.name)}
                                className={cn(
                                    "w-full py-2.5 text-sm font-medium rounded-2xl transition-all duration-200",
                                    plan.isCurrent
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 text-gray-700 hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-200 active:scale-[0.98]"
                                )}
                                disabled={plan.isCurrent || isStripeLoading}
                            >
                                {plan.isCurrent ? "Current Plan" : plan.name === "Starter" ? "Downgrade in Portal" : "Upgrade via Stripe"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment & Invoices</h3>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="text-gray-900 font-medium mb-2">Manage your billing details securely via Stripe</h4>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm">
                        Update your payment methods, download previous invoices, and view billing history in the customer portal.
                    </p>
                    <button
                        onClick={handleManageBilling}
                        disabled={isStripeLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
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
