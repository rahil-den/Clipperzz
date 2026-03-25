import { useState, useRef } from "react";
import { Link2, Upload, Sparkles, ArrowRight } from "lucide-react";

const CreateClip = ({ onGenerate }) => {
    const [url, setUrl] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef(null);

    const handleGenerate = async () => {
        if (!url.trim()) return;
        setIsGenerating(true);

        try {
            const newVideo = await createVideo({
                title: "New Video from YouTube",
                sourceType: "youtube",
                sourceUrl: url,
            });
            if (onGenerate) onGenerate(newVideo);
            setUrl("");
        } catch (err) {
            console.error("[CreateClip.jsx] Error creating video:", err);
            alert("Failed to create video. Please check the URL and try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("Uploading file:", file.name);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 font-['Satoshi',sans-serif]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Title */}
                <div className="shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">Create New Clips</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Paste a YouTube link or upload a video to generate viral clips
                    </p>
                </div>

                {/* Input and Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl ml-auto">
                    {/* URL Input */}
                    <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube video link..."
                            className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 font-['Satoshi',sans-serif]"
                            disabled={isGenerating}
                        />
                    </div>

                    {/* Upload Button */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        accept="video/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating}
                        className="flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>

                    {/* Generate Button - Green matching reference */}
                    <button
                        onClick={handleGenerate}
                        disabled={!url.trim() || isGenerating}
                        className="flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        {isGenerating ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateClip;
