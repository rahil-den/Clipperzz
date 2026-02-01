import { useState } from "react";
import { Infinity, Upload, Link, Zap, Settings, Play, Trash2, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { AdminButton } from "./AdminButton";

const SuperAdminTools = () => {
    const [inputType, setInputType] = useState("url");
    const [videoUrl, setVideoUrl] = useState("");
    const [overrideAI, setOverrideAI] = useState(false);
    const [bulkMode, setBulkMode] = useState(false);
    const [generationQueue, setGenerationQueue] = useState([
        { id: 1, title: "Marketing Video #1", status: "completed", clips: 8 },
        { id: 2, title: "Product Demo Extended", status: "processing", clips: 5 },
        { id: 3, title: "Webinar Recording", status: "queued", clips: 12 },
    ]);

    const getStatusBadge = (status) => {
        const styles = {
            completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
            processing: { bg: "bg-purple-100", text: "text-purple-700" },
            queued: { bg: "bg-gray-100", text: "text-gray-700" },
        };
        const style = styles[status] || styles.queued;
        return (
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", style.bg, style.text)}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6 font-['Satoshi',sans-serif]">
            {/* Unlimited Badge */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
                        <Infinity className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900">Unlimited Access</h2>
                            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full animate-pulse">
                                SUPER ADMIN
                            </span>
                        </div>
                        <p className="text-gray-500 mt-1">No quotas • No limits • Full system override</p>
                    </div>
                </div>
            </div>

            {/* Video Input */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Generate Clips</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Process any video without restrictions</p>
                </div>
                <div className="p-6 space-y-6">
                    {/* Input Type Toggle */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                        <button
                            onClick={() => setInputType("url")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                                inputType === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Link className="w-4 h-4" />
                            URL
                        </button>
                        <button
                            onClick={() => setInputType("upload")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                                inputType === "upload" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Upload className="w-4 h-4" />
                            Upload
                        </button>
                    </div>

                    {/* URL Input */}
                    {inputType === "url" && (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="Paste video URL (YouTube, Vimeo, direct link...)"
                                className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                            />
                            {bulkMode && (
                                <textarea
                                    placeholder="Additional URLs (one per line)"
                                    rows={4}
                                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150 resize-none"
                                />
                            )}
                        </div>
                    )}

                    {/* Upload Area */}
                    {inputType === "upload" && (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors duration-150">
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">Drop video files here</p>
                            <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                            <p className="text-xs text-gray-400 mt-3">No file size limit • All formats supported</p>
                        </div>
                    )}

                    {/* Override Controls */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setOverrideAI(!overrideAI)}
                                className={cn(
                                    "w-11 h-6 rounded-full transition-all duration-200 relative",
                                    overrideAI ? "bg-emerald-500" : "bg-gray-200"
                                )}
                            >
                                <div
                                    className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                                        overrideAI ? "left-6" : "left-1"
                                    )}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Override AI Limits</p>
                                <p className="text-xs text-gray-400">Bypass processing restrictions</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setBulkMode(!bulkMode)}
                                className={cn(
                                    "w-11 h-6 rounded-full transition-all duration-200 relative",
                                    bulkMode ? "bg-emerald-500" : "bg-gray-200"
                                )}
                            >
                                <div
                                    className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                                        bulkMode ? "left-6" : "left-1"
                                    )}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Bulk Mode</p>
                                <p className="text-xs text-gray-400">Process multiple videos</p>
                            </div>
                        </label>
                    </div>

                    {/* Generate Button */}
                    <AdminButton className="w-full h-12 text-base">
                        <Zap className="w-5 h-5" />
                        Generate Unlimited Clips
                    </AdminButton>
                </div>
            </div>

            {/* Generation Queue */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Generation Queue</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Your pending and completed generations</p>
                    </div>
                    <AdminButton variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </AdminButton>
                </div>
                <div className="divide-y divide-gray-50">
                    {generationQueue.map((item) => (
                        <div
                            key={item.id}
                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-150"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Play className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.clips} clips</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(item.status)}
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminTools;
