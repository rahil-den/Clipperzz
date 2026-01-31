import { Video, Scissors, Clock, CreditCard, Zap, TrendingUp } from "lucide-react";
import StatCard from "../../components/dashboard-user/StatCard";
import CreateClip from "../../components/dashboard-user/CreateClip";
import RecentActivity from "../../components/dashboard-user/RecentActivity";
import UsageLimits from "../../components/dashboard-user/UsageLimits";
import RecentClips from "../../components/dashboard-user/RecentClips";

const DashboardHome = () => {
    const handleGenerate = (url) => {
        console.log("Generating clips from:", url);
    };

    const stats = [
        { icon: Video, value: "24", label: "Videos Uploaded", change: "12%", variant: "emerald" },
        { icon: Scissors, value: "142", label: "Clips Generated", change: "23%", variant: "purple" },
        { icon: Clock, value: "18.5", label: "Hours Saved", variant: "orange" },
        { icon: CreditCard, value: "Pro", label: "Current Plan", variant: "purple" },
        { icon: Zap, value: "12", label: "Credits Left", variant: "emerald" },
        { icon: TrendingUp, value: "68%", label: "Usage This Month", variant: "orange" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-['Satoshi',sans-serif]">
            <div className="mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Welcome back, Alex <span className="inline-block">👋</span>
                </h1>
                <p className="text-gray-500 mt-1 text-base">Let's turn long videos into viral clips.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        value={stat.value}
                        label={stat.label}
                        change={stat.change}
                        variant={stat.variant}
                    />
                ))}
            </div>

            <div id="create-clip-section">
                <CreateClip onGenerate={handleGenerate} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivity />
                </div>
                <div className="lg:col-span-1">
                    <UsageLimits />
                </div>
            </div>

            <RecentClips />
        </div>
    );
};

export default DashboardHome;
