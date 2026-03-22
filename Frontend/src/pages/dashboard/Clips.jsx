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
  Edit
} from "lucide-react";
import { getClips } from "../../services/api";
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
                      {(clip.platforms || []).map((platform, i) => (
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
    </div>
  );
};

export default Clips;
