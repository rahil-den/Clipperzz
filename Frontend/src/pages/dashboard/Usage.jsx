import { Video, Scissors, Clock, Zap, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect, useState, useRef } from "react";

const UsageCard = ({ icon: Icon, label, value, total, unit, color = "emerald" }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);
    const percentage = Math.round((value / total) * 100);
    const remaining = 100 - percentage;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    setTimeout(() => setAnimatedWidth(percentage), 100);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [percentage]);

    const colors = {
        emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-500" },
        orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600", bar: "bg-orange-500" },
        purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", bar: "bg-purple-500" },
        blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", bar: "bg-blue-500" },
    };

    const style = colors[color];

    return (
        <div ref={ref} className="bg-white rounded-2xl border border-gray-100 p-5 font-['Satoshi',sans-serif]">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", style.icon)}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-400">/ {total} {unit}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", style.bar)}
                    style={{ width: `${animatedWidth}%` }}
                />
            </div>
            <p className="text-xs text-gray-400">{remaining}% remaining</p>
        </div>
    );
};

const Usage = () => {
    const weeklyData = [
        { day: "Mon", value: 12 },
        { day: "Tue", value: 8 },
        { day: "Wed", value: 24 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 32 },
        { day: "Sat", value: 18 },
        { day: "Sun", value: 6 },
    ];

    const maxValue = Math.max(...weeklyData.map((d) => d.value));

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Usage</h1>
                    <p className="text-gray-500 mt-1">Track your consumption and limits</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Billing cycle ends Feb 15, 2024
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <UsageCard icon={Video} label="Videos Processed" value={18} total={25} unit="videos" color="emerald" />
                <UsageCard icon={Scissors} label="Clips Generated" value={142} total={200} unit="clips" color="orange" />
                <UsageCard icon={Clock} label="Processing Hours" value={4.5} total={10} unit="hours" color="emerald" />
                <UsageCard icon={Zap} label="Credits Used" value={68} total={100} unit="credits" color="orange" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div
                    className="rounded-2xl border border-gray-100 p-6"
                    style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)" }}
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Time Saved This Month</p>
                            <p className="text-3xl font-bold text-gray-900">18.5 hours</p>
                            <div className="flex items-center gap-1 mt-1">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-emerald-600 font-medium">+23%</span>
                                <span className="text-sm text-gray-400">vs last month</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-6">Weekly Activity</h3>
                    <div className="flex items-end justify-between gap-2 h-24">
                        {weeklyData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                <span className="text-xs text-gray-500">{item.value}</span>
                                <div
                                    className={cn(
                                        "w-full rounded-t-lg transition-all duration-500",
                                        item.value > 0 ? "bg-emerald-500" : "bg-gray-200"
                                    )}
                                    style={{ height: `${item.value > 0 ? (item.value / maxValue) * 60 + 10 : 4}px` }}
                                />
                                <span className="text-xs text-gray-400">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="rounded-2xl border p-6 flex items-center justify-between"
                style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                    borderColor: "rgba(168, 85, 247, 0.2)"
                }}
            >
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Need more capacity?</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Upgrade to Pro for unlimited clips and priority processing.
                    </p>
                </div>
                <button className="flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-purple-200">
                    Upgrade Plan
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Usage;
