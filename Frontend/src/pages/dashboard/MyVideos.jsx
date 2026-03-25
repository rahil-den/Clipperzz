import { useState, useEffect } from "react";
import { Upload, Search, MoreHorizontal, Trash2, Edit, Youtube, ChevronDown, Check, Play, MoreVertical, Download, Share2, Clock, Calendar, Filter, LayoutGrid, List as ListIcon, Plus, Loader2, AlertCircle } from "lucide-react";
import { getVideos, deleteVideo, updateVideo } from "../../services/api";
import { cn } from "../../lib/utils";

const MyVideos = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const fetchVideos = async () => {
        setIsLoading(true);
        try {
            const data = await getVideos();
            setVideos(Array.isArray(data) ? data : data.videos || []);
        } catch (err) {
            console.error("[MyVideos.jsx] Error fetching videos:", err);
            setError("Failed to load your videos. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDeleteVideo = async (video) => {
        if (!window.confirm(`Are you sure you want to delete "${video.title}"?`)) return;
        
        setIsActionLoading(true);
        try {
            await deleteVideo(video._id);
            await fetchVideos();
        } catch (err) {
            console.error("[MyVideos.jsx] Error deleting video:", err);
            alert("Failed to delete video.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "completed", label: "Completed" },
        { value: "processing", label: "Processing" },
        { value: "failed", label: "Failed" },
    ];

    const sourceOptions = [
        { value: "all", label: "All Sources" },
        { value: "youtube", label: "YouTube" },
        { value: "upload", label: "Upload" },
    ];

    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || video.status === statusFilter;
        const matchesSource = sourceFilter === "all" || video.sourceType === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Videos</h1>
                    <p className="text-gray-500 mt-1">Manage your uploaded long-form videos</p>
                </div>
                <button className="flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm">
                    <Upload className="w-4 h-4" />
                    Upload Video
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos..."
                        className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-3 ml-auto">
                    <div className="relative">
                        <button
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className="flex items-center gap-2 h-10 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                        >
                            {statusOptions.find((s) => s.value === statusFilter)?.label}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {showStatusDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setStatusFilter(option.value);
                                            setShowStatusDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                    >
                                        {option.label}
                                        {statusFilter === option.value && <Check className="w-4 h-4 text-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                            className="flex items-center gap-2 h-10 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                        >
                            {sourceOptions.find((s) => s.value === sourceFilter)?.label}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {showSourceDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
                                {sourceOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSourceFilter(option.value);
                                            setShowSourceDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                    >
                                        {option.label}
                                        {sourceFilter === option.value && <Check className="w-4 h-4 text-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium text-lg">Loading your videos...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-500 font-medium text-lg mb-2">{error}</p>
                    <button
                        onClick={() => fetchVideos()}
                        className="text-emerald-500 hover:text-emerald-600 font-medium underline"
                    >
                        Try reloading the page
                    </button>
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No videos found</h3>
                    <p className="text-gray-500 max-w-sm text-center">
                        {searchQuery
                            ? `We couldn't find any videos matching "${searchQuery}"`
                            : "You haven't uploaded any videos yet. Start by creating your first masterpiece!"}
                    </p>
                    {!searchQuery && (
                        <button className="mt-8 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Upload New Video
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4">Video</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVideos.map((video, index) => (
                                <tr
                                    key={video._id}
                                    className={cn(
                                        "hover:bg-gray-50 transition-colors group",
                                        index !== filteredVideos.length - 1 && "border-b border-gray-50"
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Play className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {video.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{formatDuration(video.duration)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {video.sourceType === "youtube" ? (
                                                <>
                                                    <Youtube className="w-4 h-4 text-red-500" />
                                                    <span className="text-sm text-gray-600 capitalize">YouTube</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-sm text-gray-600 capitalize">Upload</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                                video.status === "completed"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : video.status === "failed" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    video.status === "completed" ? "bg-emerald-500" : video.status === "failed" ? "bg-red-500" : "bg-orange-500"
                                                )}
                                            />
                                            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{new Date(video.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4 text-gray-400" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteVideo(video)}
                                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" 
                                                title="Delete"
                                                disabled={isActionLoading}
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyVideos;
