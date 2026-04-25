import { useState, useEffect } from "react";
import {
  Play,
  Download,
  Share2,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Calendar,
  Loader2,
  AlertCircle,
  X,
  Grid3X3,
  List,
  Edit,
  ChevronLeft
} from "lucide-react";
import { getClips, deleteClip } from "../../services/api";
import { cn } from "../../lib/utils";
import ClipCard from "../../components/dashboard-user/ClipCard";

const Clips = () => {
  const [clips, setClips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [previewClip, setPreviewClip] = useState(null);

  useEffect(() => {
    const fetchClips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getClips();
        setClips(Array.isArray(data) ? data : data.clips || []);
      } catch (err) {
        console.error("[Clips.jsx] Error fetching clips:", err);
        setError("Failed to load your clips. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClips();
  }, []);

  const platformColors = {
    reddit: "bg-orange-500",
    snapchat: "bg-yellow-400",
    tiktok: "bg-gray-900",
  };

  const filteredClips = clips.filter((clip) =>
    (clip.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatViews = (num) => {
    return (num || 0).toLocaleString();
  };

  const handleDownload = (clipUrl) => {
    if (!clipUrl) return;
    const url = new URL(clipUrl);
    url.searchParams.set('dl', '1');
    window.location.href = url.toString();
  };

  const handlePlay = (clip) => {
    setPreviewClip(clip);
  };

  const handleDeleteClip = async (clipId) => {
    if (!window.confirm("Are you sure you want to delete this clip?")) return;
    
    try {
      await deleteClip(clipId);
      setClips((prev) => prev.filter((clip) => clip._id !== clipId));
    } catch (err) {
      console.error("Failed to delete clip:", err);
      alert("Failed to delete clip. Please try again.");
    }
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium text-lg">Loading your clips...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 font-medium text-lg mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-emerald-500 hover:text-emerald-600 font-medium underline"
          >
            Try reloading the page
          </button>
        </div>
      ) : filteredClips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No clips found</h3>
          <p className="text-gray-500 max-w-sm text-center">
            {searchQuery
              ? `We couldn't find any clips matching "${searchQuery}"`
              : "You haven't generated any clips yet. Go to 'My Videos' to start clipping!"}
          </p>
        </div>
      ) : viewMode === "list" ? (
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
                  key={clip._id}
                  className={cn(
                    "hover:bg-gray-50 transition-colors group",
                    index !== filteredClips.length - 1 && "border-b border-gray-50"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer" onClick={() => handlePlay(clip)}>
                        <img
                          src={clip.thumbnail || `https://api.dicebear.com/7.x/shapes/svg?seed=${clip._id}`}
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
                    <span className="text-sm text-gray-600">{clip.duration || "0:00"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {(clip.platforms || ["tiktok"]).map((platform, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                            platformColors[platform] || "bg-gray-400"
                          )}
                        >
                          {platform.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {formatViews(clip.views || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 overflow-hidden text-ellipsis max-w-[150px] block" title={clip.video?.title || "Original Video"}>
                      {clip.video?.title || "Original Video"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{new Date(clip.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 rounded-full text-gray-500 hover:bg-emerald-100 hover:text-gray-900 transition-all"
                        title="Play"
                        onClick={() => handlePlay(clip)}
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-full text-gray-500 hover:bg-emerald-100 hover:text-gray-900 transition-all"
                        title="Download"
                        onClick={() => handleDownload(clip.clipUrl)}
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
                      <button
                        className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all"
                        title="Delete"
                        onClick={() => handleDeleteClip(clip._id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
              key={clip._id}
              id={clip._id}
              thumbnail={clip.thumbnail}
              title={clip.title}
              duration={clip.duration}
              hasSubtitles={true}
              isProcessed={clip.status === "ready"}
              onPlay={() => handlePlay(clip)}
              onDownload={() => handleDownload(clip.clipUrl)}
              onEdit={(id) => console.log("Edit", id)}
              onShare={(id) => console.log("Share", id)}
              onDelete={() => handleDeleteClip(clip._id)}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewClip && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm flex items-center justify-between mb-4">
            <button
              onClick={() => setPreviewClip(null)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          </div>
          <div className="bg-black rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-800 relative">
            <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
              <h3 className="font-semibold text-white drop-shadow-md truncate">{previewClip.title}</h3>
              <button
                onClick={() => setPreviewClip(null)}
                className="p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* 9:16 Vertical Video Aspect Ratio */}
            <div className="aspect-[9/16] bg-gray-900 flex items-center justify-center relative">
              {previewClip.clipUrl ? (
                <video 
                  src={previewClip.clipUrl} 
                  controls 
                  className="w-full h-full object-cover"
                  autoPlay
                  crossOrigin="anonymous"
                  playsInline
                />
              ) : (
                <div className="text-center">
                  <Play className="w-12 h-12 text-white/30 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">Video URL not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clips;
