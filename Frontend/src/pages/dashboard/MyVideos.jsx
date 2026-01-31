import { useState, useRef } from "react";
import { Upload, Search, MoreHorizontal, Trash2, Edit, Youtube, ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

const MyVideos = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const videos = [
        {
            id: 1,
            title: "How to Build a SaaS in 2024",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=68&fit=crop",
            duration: "24:35",
            source: "youtube",
            clips: 8,
            status: "completed",
            date: "1/15/2024",
        },
        {
            id: 2,
            title: "The Future of AI Content Creation",
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=68&fit=crop",
            duration: "18:22",
            source: "upload",
            clips: 5,
            status: "completed",
            date: "1/14/2024",
        },
        {
            id: 3,
            title: "Marketing Strategies That Actually Work",
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=68&fit=crop",
            duration: "32:18",
            source: "youtube",
            clips: 0,
            status: "processing",
            date: "1/13/2024",
        },
        {
            id: 4,
            title: "Podcast Episode #45 - Tech Trends",
            thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=120&h=68&fit=crop",
            duration: "58:45",
            source: "upload",
            clips: 12,
            status: "completed",
            date: "1/12/2024",
        },
    ];

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "completed", label: "Completed" },
        { value: "processing", label: "Processing" },
    ];

    const sourceOptions = [
        { value: "all", label: "All Sources" },
        { value: "youtube", label: "YouTube" },
        { value: "upload", label: "Upload" },
    ];

    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || video.status === statusFilter;
        const matchesSource = sourceFilter === "all" || video.source === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });

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

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <th className="px-6 py-4">Video</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4">Clips</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVideos.map((video, index) => (
                            <tr
                                key={video.id}
                                className={cn(
                                    "hover:bg-gray-50 transition-colors cursor-pointer group",
                                    index !== filteredVideos.length - 1 && "border-b border-gray-50"
                                )}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-20 h-12 object-cover rounded-lg"
                                        />
                                        <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                            {video.title}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">{video.duration}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {video.source === "youtube" ? (
                                            <>
                                                <Youtube className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-gray-600 capitalize">{video.source}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600 capitalize">{video.source}</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900">{video.clips}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                            video.status === "completed"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-orange-50 text-orange-600"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                video.status === "completed" ? "bg-emerald-500" : "bg-orange-500"
                                            )}
                                        />
                                        {video.status === "completed" ? "Completed" : "Processing"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-500">{video.date}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                            <Edit className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="More">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredVideos.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                    <p className="text-gray-500 mb-4">Upload your first video to start creating clips</p>
                    <button className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all">
                        <Upload className="w-4 h-4" />
                        Upload Video
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyVideos;
