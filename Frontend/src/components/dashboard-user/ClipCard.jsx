import { useState } from "react";
import { Play, Download, Edit2, Share2, Bookmark, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

const ClipCard = ({
    id,
    thumbnail,
    title,
    duration,
    isBookmarked = false,
    isProcessed = true,
    hasSubtitles = true,
    onPlay,
    onDownload,
    onEdit,
    onShare,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [bookmarked, setBookmarked] = useState(isBookmarked);

    // Default placeholder thumbnails
    const defaultThumbnails = [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop",
    ];

    const displayThumbnail = thumbnail || defaultThumbnails[id % defaultThumbnails.length];

    return (
        <div
            className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/5] cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail */}
            <img
                src={displayThumbnail}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Duration Badge */}
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-md">
                {duration}
            </div>

            {/* Status Icons - Top Left */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                {hasSubtitles && (
                    <div className="w-6 h-6 bg-black/70 backdrop-blur-sm rounded-md flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">CC</span>
                    </div>
                )}
                {isProcessed && (
                    <div className="w-6 h-6 bg-black/70 backdrop-blur-sm rounded-md flex items-center justify-center">
                        <Clock className="w-3 h-3 text-white" />
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setBookmarked(!bookmarked);
                    }}
                    className={cn(
                        "w-6 h-6 bg-black/70 backdrop-blur-sm rounded-md flex items-center justify-center transition-colors",
                        bookmarked && "bg-emerald-500"
                    )}
                >
                    <Play className="w-3 h-3 text-white" />
                </button>
            </div>

            {/* Hover Overlay */}
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-200",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
            >
                {/* Centered Play Button */}
                <button
                    onClick={() => onPlay?.(id)}
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-xl",
                        isHovered ? "scale-100 opacity-100" : "scale-75 opacity-0"
                    )}
                >
                    <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                </button>

                {/* Bottom Action Buttons */}
                <div
                    className={cn(
                        "absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 transition-all duration-200",
                        isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    )}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload?.(id);
                        }}
                        className="flex-1 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center gap-1.5 text-white text-sm font-medium transition-all hover:scale-[1.02]"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(id);
                        }}
                        className="flex-1 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center gap-1.5 text-white text-sm font-medium transition-all hover:scale-[1.02]"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShare?.(id);
                        }}
                        className="flex-1 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center gap-1.5 text-white text-sm font-medium transition-all hover:scale-[1.02]"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Title - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-200">
                <h3 className="text-white text-sm font-medium truncate">{title}</h3>
            </div>
        </div>
    );
};

export default ClipCard;
