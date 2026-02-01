import { useState } from "react";
import { CreditCard, Check, ArrowUpRight, Download, FileText, X } from "lucide-react";
import { cn } from "../../lib/utils";

const Billing = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const plans = [
        {
            name: "Starter",
            subtitle: "For getting started",
            price: 0,
            features: ["5 videos/month", "15 clips/month", "720p export", "Basic templates"],
            isCurrent: false,
            isPopular: false,
        },
        {
            name: "Pro",
            subtitle: "For growing creators",
            price: 29,
            features: ["25 videos/month", "200 clips/month", "1080p export", "All templates", "Priority processing", "Remove watermark"],
            isCurrent: true,
            isPopular: true,
        },
        {
            name: "Enterprise",
            subtitle: "For teams & agencies",
            price: 99,
            features: ["Unlimited videos", "Unlimited clips", "4K export", "Custom templates", "API access", "Dedicated support", "Team collaboration"],
            isCurrent: false,
            isPopular: false,
        },
    ];

    const invoices = [
        { id: "INV-2024-001", date: "Jan 15, 2024", amount: "$29.00", status: "Paid" },
        { id: "INV-2023-012", date: "Dec 15, 2023", amount: "$29.00", status: "Paid" },
        { id: "INV-2023-011", date: "Nov 15, 2023", amount: "$29.00", status: "Paid" },
        { id: "INV-2023-010", date: "Oct 15, 2023", amount: "$29.00", status: "Paid" },
    ];

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
                            <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                Active
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">$29 /month • Renews on February 15, 2024</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                        Cancel Subscription
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl transition-colors shadow-md shadow-purple-200">
                        Upgrade Plan
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
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
                                className={cn(
                                    "w-full py-2.5 text-sm font-medium rounded-2xl transition-all duration-200",
                                    plan.isCurrent
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 text-gray-700 hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-200 active:scale-[0.98]"
                                )}
                                disabled={plan.isCurrent}
                            >
                                {plan.isCurrent ? "Current Plan" : plan.name === "Starter" ? "Downgrade" : "Upgrade"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl">
                            VISA
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-xs text-gray-500">Expires 12/2025</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUpdateModal(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                        Update
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                            <th className="pb-3 font-normal">Invoice</th>
                            <th className="pb-3 font-normal">Date</th>
                            <th className="pb-3 font-normal">Amount</th>
                            <th className="pb-3 font-normal">Status</th>
                            <th className="pb-3 font-normal text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, index) => (
                            <tr
                                key={invoice.id}
                                className={cn(
                                    "text-sm",
                                    index !== invoices.length - 1 && "border-b border-gray-50"
                                )}
                            >
                                <td className="py-4">
                                    <span className="font-medium text-emerald-600">{invoice.id}</span>
                                </td>
                                <td className="py-4 text-gray-500">{invoice.date}</td>
                                <td className="py-4 font-medium text-gray-900">{invoice.amount}</td>
                                <td className="py-4">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:bg-emerald-100 hover:text-gray-900 rounded-xl transition-all ml-auto">
                                        <Download className="w-4 h-4" />
                                        PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showUpdateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Update Payment Method</h3>
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                                    <input
                                        type="text"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        placeholder="123"
                                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const cardData = {
                                            cardNumber: cardNumber,
                                            expiry: expiry,
                                            cvv: cvv ? "***" : "",
                                            updatedAt: new Date().toISOString(),
                                        };
                                        console.log("[Billing.jsx] Payment Method Updated:", cardData);
                                        alert("Payment method updated successfully!");
                                        setShowUpdateModal(false);
                                    }}
                                    className="flex-1 py-3 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl transition-colors"
                                >
                                    Save Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
