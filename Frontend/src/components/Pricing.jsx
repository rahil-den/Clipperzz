import { Check } from "lucide-react";
import { cn } from "../lib/utils";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "/forever",
        description: "Try Clipperzz with basic features",
        features: [
            { text: "5 clips per month", highlight: false },
            { text: "720p export quality", highlight: false },
            { text: "Clipperzz watermark", highlight: true },
            { text: "Standard processing", highlight: true },
            { text: "Basic subtitle styles", highlight: false },
        ],
        cta: "Get Started",
        featured: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/per month",
        description: "For creators who publish consistently",
        features: [
            { text: "Unlimited clips", highlight: false },
            { text: "4K export quality", highlight: false },
            { text: "No watermark", highlight: false },
            { text: "Priority processing", highlight: false },
            { text: "Custom subtitle styles", highlight: false },
            { text: "Brand presets", highlight: false },
            { text: "Analytics dashboard", highlight: false },
        ],
        cta: "Start Free Trial",
        featured: true,
    },
    {
        name: "Studio",
        price: "$99",
        period: "/per month",
        description: "For teams and agencies",
        features: [
            { text: "Everything in Pro", highlight: true },
            { text: "5 team members", highlight: true },
            { text: "Team collaboration", highlight: true },
            { text: "API access", highlight: true },
            { text: "Advanced analytics", highlight: true },
            { text: "Dedicated support", highlight: true },
            { text: "Custom integrations", highlight: true },
        ],
        cta: "Contact Sales",
        featured: false,
    },
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Start free. <span className="text-secondary">Upgrade</span> when you're ready to scale.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "relative bg-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1",
                                plan.featured
                                    ? "border-2 border-green-500 shadow-xl shadow-green-500/20"
                                    : "border border-border shadow-card hover:shadow-xl hover:border-primary/30"
                            )}
                        >
                            {/* Featured Badge */}
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="px-5 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-semibold text-white shadow-lg shadow-primary/30">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-foreground mb-1">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-secondary mb-5">
                                    {plan.description}
                                </p>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-bold text-foreground">
                                        {plan.price}
                                    </span>
                                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className={cn(
                                            "w-5 h-5 flex-shrink-0 mt-0.5",
                                            plan.featured ? "text-primary" : feature.highlight ? "text-secondary" : "text-muted-foreground"
                                        )} />
                                        <span className={cn(
                                            "text-sm",
                                            plan.featured ? "text-foreground" : feature.highlight ? "text-secondary" : "text-muted-foreground"
                                        )}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            {plan.featured ? (
                                <button className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-semibold text-sm shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]">
                                    {plan.cta}
                                </button>
                            ) : (
                                <button className="group w-full py-4 px-6 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-sm transition-all duration-300 hover:border-green-500 hover:text-green-600 hover:bg-green-50 hover:shadow-md active:scale-[0.98]">
                                    {plan.cta}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
