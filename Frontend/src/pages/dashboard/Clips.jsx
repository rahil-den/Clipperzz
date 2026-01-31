import { useState } from "react";
import { Search, Grid3X3, List, Play, Download, Edit, Share2 } from "lucide-react";
import { cn } from "../../lib/utils";
import ClipCard from "../../components/dashboard-user/ClipCard";

const Clips = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("list");

    const clips = [
        {
            id: 1,
            thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&h=68&fit=crop",
            title: "The Secret to Viral Content",
            duration: "0:45",
            platforms: ["reddit", "snapchat", "tiktok"],
            views: 12400,
            sourceVideo: "How to Build a SaaS in 2...",
            date: "1/15/2024",
        },
        {
            id: 2,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=68&fit=crop",
            title: "AI Will Change Everything",
            duration: "0:32",
            platforms: ["reddit", "tiktok"],
            views: 8900,
            sourceVideo: "The Future of AI Content ...",
            date: "1/14/2024",
        },
        {
            id: 3,
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=68&fit=crop",
            title: "Marketing Hack #1",
            duration: "0:28",
            platforms: ["snapchat"],
            views: 5600,
            sourceVideo: "Marketing Strategies That...",
            date: "1/13/2024",
        },
        {
            id: 4,
            thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=120&h=68&fit=crop",
            title: "Tech Trend Predictions",
            duration: "0:51",
            platforms: ["reddit", "snapchat", "tiktok"],
            views: 15200,
            sourceVideo: "Podcast Episode #45...",
            date: "1/12/2024",
        },
    ];

    const platformColors = {
        reddit: "bg-orange-500",
        snapchat: "bg-yellow-400",
        tiktok: "bg-gray-900",
    };

    const filteredClips = clips.filter((clip) =>
        clip.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatViews = (num) => {
        return num.toLocaleString();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clips</h1>
                    <p className="text-gray-500 mt-1">Manage your generated short-form clips</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        )}
                    >
                        <Grid3X3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        )}
                    >
                        <List className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search clips..."
                        className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
            </div>

            {viewMode === "list" ? (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-400 tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4 font-normal">Clip</th>
                                <th className="px-6 py-4 font-normal">Duration</th>
                                <th className="px-6 py-4 font-normal">Platforms</th>
                                <th className="px-6 py-4 font-normal">Views</th>
                                <th className="px-6 py-4 font-normal">Source video</th>
                                <th className="px-6 py-4 font-normal">Date</th>
                                <th className="px-6 py-4 font-normal">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClips.map((clip, index) => (
                                <tr
                                    key={clip.id}
                                    className={cn(
                                        "hover:bg-gray-50 transition-colors group",
                                        index !== filteredClips.length - 1 && "border-b border-gray-50"
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={clip.thumbnail}
                                                    alt={clip.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Play className="w-4 h-4 text-white" fill="white" />
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                {clip.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{clip.duration}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            {clip.platforms.map((platform, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                                                        platformColors[platform]
                                                    )}
                                                >
                                                    {platform.charAt(0).toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatViews(clip.views)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{clip.sourceVideo}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{clip.date}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="p-2 rounded-full text-gray-500 hover:bg-emerald-100 hover:text-gray-900 transition-all"
                                                title="Play"
                                            >
                                                <Play className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 rounded-full text-gray-500 hover:bg-emerald-100 hover:text-gray-900 transition-all"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 rounded-full text-gray-500 hover:bg-emerald-100 hover:text-gray-900 transition-all"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 rounded-full text-gray-500 hover:bg-emerald-100 hover:text-gray-900 transition-all"
                                                title="Share"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredClips.map((clip) => (
                        <ClipCard
                            key={clip.id}
                            id={clip.id}
                            thumbnail={clip.thumbnail}
                            title={clip.title}
                            duration={clip.duration}
                            hasSubtitles={true}
                            isProcessed={true}
                            onPlay={(id) => console.log("Play", id)}
                            onDownload={(id) => console.log("Download", id)}
                            onEdit={(id) => console.log("Edit", id)}
                            onShare={(id) => console.log("Share", id)}
                        />
                    ))}
                </div>
            )}

            {filteredClips.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clips found</h3>
                    <p className="text-gray-500 mb-4">Generate your first clip from a video</p>
                </div>
            )}
        </div>
    );
};

export default Clips;
