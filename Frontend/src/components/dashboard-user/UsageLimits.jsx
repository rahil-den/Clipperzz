import { TrendingUp, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect, useState, useRef } from "react";

const ProgressBar = ({ value, max, color = "emerald" }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    setTimeout(() => {
                        setAnimatedWidth((value / max) * 100);
                    }, 100);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, max]);

    const colorClasses = {
        emerald: "bg-emerald-400",
        green: "bg-emerald-400",
        orange: "bg-orange-400",
        purple: "bg-purple-400",
    };

    return (
        <div ref={ref} className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
                className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    colorClasses[color]
                )}
                style={{ width: `${animatedWidth}%` }}
            />
        </div>
    );
};

const UsageLimits = ({
    usage = 0,
    limit = 10,
    plan = "Free",
}) => {
    const monthlyUsagePercent = Math.round((usage / limit) * 100) || 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900">Usage & Limits</h2>
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                    <Zap className="w-3 h-3" />
                    {plan} Plan
                </span>
            </div>

            {/* Monthly Usage */}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Monthly Usage</span>
                        <span className="text-sm font-semibold text-gray-900">{monthlyUsagePercent}%</span>
                    </div>
                    <ProgressBar value={usage} max={limit} color="emerald" />
                </div>

                {/* Remaining Credits */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Videos Processed</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {usage} / {limit}
                        </span>
                    </div>
                    <ProgressBar value={usage} max={limit} color="green" />
                </div>
            </div>

            {/* Upgrade Button - Purple matching reference */}
            <div className="mt-5">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-md shadow-purple-200 transition-all duration-200 hover:shadow-lg active:scale-[0.98]">
                    <TrendingUp className="w-4 h-4" />
                    Upgrade Plan
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">Get unlimited clips with Pro Plus</p>
            </div>
        </div>
    );
};

export default UsageLimits;
