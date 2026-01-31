import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import ClipCard from "./ClipCard";

const RecentClips = ({ clips = [] }) => {
    const defaultClips = [
        {
            id: 1,
            thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=500&fit=crop",
            title: "The Secret to Going Viral",
            duration: "0:32",
            hasSubtitles: true,
            isProcessed: true,
        },
        {
            id: 2,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=500&fit=crop",
            title: "AI Tools You Need Now",
            duration: "0:45",
            hasSubtitles: true,
            isProcessed: true,
        },
        {
            id: 3,
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500&fit=crop",
            title: "Marketing Hack #1",
            duration: "0:28",
            hasSubtitles: true,
            isProcessed: true,
        },
        {
            id: 4,
            thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=500&fit=crop",
            title: "Build in Public Tips",
            duration: "0:59",
            hasSubtitles: false,
            isProcessed: true,
        },
    ];

    const displayClips = clips.length > 0 ? clips : defaultClips;

    const handlePlay = (id) => {
        console.log("Playing clip:", id);
    };

    const handleDownload = (id) => {
        console.log("Downloading clip:", id);
    };

    const handleEdit = (id) => {
        console.log("Editing clip:", id);
    };

    const handleShare = (id) => {
        console.log("Sharing clip:", id);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Recent Clips</h2>
                <Link
                    to="/dashboard/clips"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                    View all
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>

            {/* Clips Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {displayClips.map((clip) => (
                    <ClipCard
                        key={clip.id}
                        {...clip}
                        onPlay={handlePlay}
                        onDownload={handleDownload}
                        onEdit={handleEdit}
                        onShare={handleShare}
                    />
                ))}
            </div>

            {/* Empty State */}
            {displayClips.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-gray-500">No clips yet. Create your first clip!</p>
                </div>
            )}
        </div>
    );
};

export default RecentClips;
