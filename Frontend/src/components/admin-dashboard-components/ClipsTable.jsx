import { useState, useEffect } from "react";
import { MoreHorizontal, Eye, Flag, Trash2, RefreshCw, X, Play, ChevronLeft, ChevronRight, Loader2, Download } from "lucide-react";
import { cn } from "../../lib/utils";
import { AdminButton } from "./AdminButton";
import { getClips, updateClip, deleteClip } from "../../services/api";

const ClipsTable = () => {
    const [clips, setClips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [previewModal, setPreviewModal] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const clipsPerPage = 5;

    const fetchClips = async () => {
        setIsLoading(true);
        try {
            const data = await getClips();
            setClips(Array.isArray(data) ? data : data.clips || []);
        } catch (err) {
            console.error("[ClipsTable.jsx] Error fetching clips:", err);
            setError("Failed to load clips. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClips();
    }, []);

    const handleDeleteClip = async (clip) => {
        if (!window.confirm(`Are you sure you want to delete "${clip.title}"?`)) return;
        
        setIsActionLoading(true);
        try {
            await deleteClip(clip._id);
            setActionMenuOpen(null);
            await fetchClips();
        } catch (err) {
            console.error("[ClipsTable.jsx] Error deleting clip:", err);
            alert("Failed to delete clip.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateStatus = async (clip, newStatus) => {
        setIsActionLoading(true);
        try {
            await updateClip(clip._id, { status: newStatus });
            setActionMenuOpen(null);
            await fetchClips();
        } catch (err) {
            console.error("[ClipsTable.jsx] Error updating clip status:", err);
            alert("Failed to update clip status.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const totalPages = Math.ceil(clips.length / clipsPerPage);
    const startIndex = (currentPage - 1) * clipsPerPage;
    const displayedClips = clips.slice(startIndex, startIndex + clipsPerPage);

    const getStatusBadge = (status) => {
        const styles = {
            ready: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Ready" },
            processing: { bg: "bg-purple-100", text: "text-purple-700", label: "Processing" },
            failed: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
            flagged: { bg: "bg-orange-100", text: "text-orange-700", label: "Flagged" },
        };
        const style = styles[status] || styles.ready;
        return (
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", style.bg, style.text)}>
                {style.label}
            </span>
        );
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 font-['Satoshi',sans-serif]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clip</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                            <p className="text-sm text-gray-500 font-medium">Loading clips...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <p className="text-sm text-red-500 font-medium">{error}</p>
                                    </td>
                                </tr>
                            ) : clips.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <p className="text-sm text-gray-400 font-medium">No clips found</p>
                                    </td>
                                </tr>
                            ) : (
                             displayedClips.map((clip) => (
                                    <tr
                                        key={clip._id}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-16 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => setPreviewModal(clip)}
                                                >
                                                    <Play className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <p className="font-medium text-gray-900">{clip.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{clip.user?.name || "Unknown User"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 font-mono">{clip.duration}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(clip.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500">{new Date(clip.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 relative">
                                                <button
                                                    onClick={() => setActionMenuOpen(actionMenuOpen === clip._id ? null : clip._id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                                                >
                                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                                </button>

                                                {actionMenuOpen === clip._id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[999]">
                                                        {isActionLoading ? (
                                                            <div className="px-4 py-2 flex items-center justify-center">
                                                                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setPreviewModal(clip);
                                                                        setActionMenuOpen(null);
                                                                    }}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    Preview
                                                                </button>
                                                                {clip.status === "failed" && (
                                                                    <button 
                                                                        onClick={() => handleUpdateStatus(clip, "processing")}
                                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                                                                    >
                                                                        <RefreshCw className="w-4 h-4" />
                                                                        Reprocess
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(clip, clip.status === "flagged" ? "ready" : "flagged")}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                                                                >
                                                                    <Flag className="w-4 h-4" />
                                                                    {clip.status === "flagged" ? "Unflag" : "Flag"}
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteClip(clip)}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {clips.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + clipsPerPage, clips.length)} of {clips.length} clips
                    </p>
                    <div className="flex items-center gap-2">
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </AdminButton>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <AdminButton
                                key={page}
                                variant={page === currentPage ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </AdminButton>
                        ))}
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </AdminButton>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {previewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">{previewModal.title}</h3>
                                <p className="text-sm text-gray-500">by {previewModal.user?.name || "Unknown User"}</p>
                            </div>
                            <button
                                onClick={() => setPreviewModal(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                            {previewModal.clipUrl ? (
                                <video 
                                    src={previewModal.clipUrl} 
                                    controls 
                                    className="w-full h-full"
                                    autoPlay
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <div className="text-center">
                                    <Play className="w-16 h-16 text-white/50 mx-auto mb-2" />
                                    <p className="text-white/50">Video URL not available</p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">Duration: {previewModal.duration}</span>
                                {getStatusBadge(previewModal.status)}
                            </div>
                            <div className="flex gap-2">
                                <AdminButton 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => {
                                        const url = new URL(previewModal.clipUrl);
                                        url.searchParams.set('dl', '1');
                                        window.location.href = url.toString();
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </AdminButton>
                                <AdminButton 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => {
                                        handleDeleteClip(previewModal);
                                        setPreviewModal(null);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Clip
                                </AdminButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClipsTable;
