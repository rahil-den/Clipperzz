import { useState } from "react";
import { MoreHorizontal, Eye, Flag, Trash2, RefreshCw, X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { AdminButton } from "./AdminButton";

const mockClips = [
    { id: 1, title: "Product Demo Highlight", user: "Alex Johnson", status: "ready", duration: "0:45", created: "2 hours ago", thumbnail: "product" },
    { id: 2, title: "Tutorial Intro Sequence", user: "Sarah Wilson", status: "processing", duration: "1:20", created: "4 hours ago", thumbnail: "tutorial" },
    { id: 3, title: "Customer Testimonial", user: "Mike Chen", status: "ready", duration: "0:32", created: "1 day ago", thumbnail: "testimonial" },
    { id: 4, title: "Brand Story Clip", user: "Emily Brown", status: "failed", duration: "2:15", created: "1 day ago", thumbnail: "brand" },
    { id: 5, title: "Event Recap #1", user: "David Lee", status: "flagged", duration: "1:05", created: "2 days ago", thumbnail: "event" },
    { id: 6, title: "Social Media Teaser", user: "Lisa Wang", status: "ready", duration: "0:28", created: "3 days ago", thumbnail: "social" },
];

const ClipsTable = () => {
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [previewModal, setPreviewModal] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const clipsPerPage = 5;

    const totalPages = Math.ceil(mockClips.length / clipsPerPage);
    const startIndex = (currentPage - 1) * clipsPerPage;
    const displayedClips = mockClips.slice(startIndex, startIndex + clipsPerPage);

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
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden font-['Satoshi',sans-serif]">
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
                            {displayedClips.map((clip) => (
                                <tr
                                    key={clip.id}
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
                                        <p className="text-sm text-gray-600">{clip.user}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 font-mono">{clip.duration}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(clip.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-500">{clip.created}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 relative">
                                            <button
                                                onClick={() => setActionMenuOpen(actionMenuOpen === clip.id ? null : clip.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                                            >
                                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                            </button>

                                            {actionMenuOpen === clip.id && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
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
                                                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors">
                                                            <RefreshCw className="w-4 h-4" />
                                                            Reprocess
                                                        </button>
                                                    )}
                                                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors">
                                                        <Flag className="w-4 h-4" />
                                                        {clip.status === "flagged" ? "Unflag" : "Flag"}
                                                    </button>
                                                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(startIndex + clipsPerPage, mockClips.length)} of {mockClips.length} clips
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
                                <p className="text-sm text-gray-500">by {previewModal.user}</p>
                            </div>
                            <button
                                onClick={() => setPreviewModal(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                            <div className="text-center">
                                <Play className="w-16 h-16 text-white/50 mx-auto mb-2" />
                                <p className="text-white/50">Video Preview Placeholder</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">Duration: {previewModal.duration}</span>
                                {getStatusBadge(previewModal.status)}
                            </div>
                            <AdminButton variant="danger" size="sm">
                                <Trash2 className="w-4 h-4" />
                                Delete Clip
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClipsTable;
