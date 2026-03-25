import { useState, useEffect } from "react";
import { Video, Scissors, Clock, CreditCard, Zap, TrendingUp, Loader2 } from "lucide-react";
import StatCard from "../../components/dashboard-user/StatCard";
import CreateClip from "../../components/dashboard-user/CreateClip";
import RecentActivity from "../../components/dashboard-user/RecentActivity";
import UsageLimits from "../../components/dashboard-user/UsageLimits";
import RecentClips from "../../components/dashboard-user/RecentClips";
import { useAuth } from "../../context/AuthContext";
import { getVideos, getClips, getAllUsage } from "../../services/api";

const DashboardHome = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({
        videos: 0,
        clips: 0,
        usage: 0,
        limit: 10
    });
    const [recentClips, setRecentClips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [videos, clips, usage] = await Promise.all([
                    getVideos(),
                    getClips(),
                    getAllUsage()
                ]);

                const usageRecord = Array.isArray(usage) ? usage[0] : usage;
                const clipsData = Array.isArray(clips) ? clips : (clips.clips || []);

                setStatsData({
                    videos: Array.isArray(videos) ? videos.length : (videos.videos?.length || 0),
                    clips: clipsData.length,
                    usage: usageRecord?.videosProcessed || 0,
                    limit: usageRecord?.monthlyLimit || 10
                });

                setRecentClips(clipsData);
            } catch (err) {
                console.error("[DashboardHome.jsx] Error fetching dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleGenerate = (url) => {
        console.log("Generating clips from:", url);
    };

    const stats = [
        { icon: Video, value: statsData.videos.toString(), label: "Videos Uploaded", variant: "emerald" },
        { icon: Scissors, value: statsData.clips.toString(), label: "Clips Generated", variant: "purple" },
        { icon: TrendingUp, value: `${Math.round((statsData.usage / statsData.limit) * 100) || 0}%`, label: "Monthly Usage", variant: "orange" },
        { icon: CreditCard, value: user?.subscription?.plan || "Free", label: "Current Plan", variant: "purple" },
        { icon: Zap, value: (statsData.limit - statsData.usage).toString(), label: "Videos Left", variant: "emerald" },
        { icon: Clock, value: "N/A", label: "Time Saved", variant: "orange" },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-['Satoshi',sans-serif]">
            <div className="mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Welcome back, {user?.name?.split(" ")[0] || "User"} <span className="inline-block">👋</span>
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
                    <UsageLimits 
                        usage={statsData.usage}
                        limit={statsData.limit}
                        plan={user?.subscription?.plan || "Free"}
                    />
                </div>
            </div>

            <RecentClips clips={recentClips.slice(0, 4)} />
        </div>
    );
};

export default DashboardHome;
