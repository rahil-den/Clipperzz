import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import ClipCard from "./ClipCard";

const RecentClips = ({ clips = [] }) => {
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
            {clips.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {clips.map((clip) => (
                        <ClipCard
                            key={clip._id}
                            id={clip._id}
                            title={clip.title}
                            duration={clip.duration}
                            isProcessed={clip.status === "ready"}
                            hasSubtitles={true}
                            onPlay={handlePlay}
                            onDownload={handleDownload}
                            onEdit={handleEdit}
                            onShare={handleShare}
                        />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-500 font-medium">No clips found. Start by uploading a video!</p>
                </div>
            )}
        </div>
    );
};

export default RecentClips;
