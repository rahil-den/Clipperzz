import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Flag, Headphones, Search, Filter, Eye, Check, Trash2, Clock, Send, X, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";
import { getAllReports, updateReportStatus, addReportReply } from "../../services/api";

const UserReports = () => {
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState("reports");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");

    const fetchReports = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = {
                type: activeTab === "reports" ? "report" : activeTab === "feedback" ? "feedback" : "contact",
                status: selectedStatus || undefined
            };
            const data = await getAllReports(params);
            setReports(data);
        } catch (err) {
            console.error("[UserReports] Fetch error:", err);
            setError("Failed to fetch user reports.");
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, selectedStatus]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const tabs = [
        { id: "reports", label: "Issue Reports", icon: Flag, count: reports.filter(r => r.type === "report" && r.status !== "resolved").length },
        { id: "feedback", label: "Feedback", icon: MessageSquare, count: reports.filter(r => r.type === "feedback" && r.status === "new").length },
        { id: "contacts", label: "Contact Requests", icon: Headphones, count: reports.filter(r => r.type === "contact" && r.status === "pending").length },
    ];

    const getStatusStyle = (status) => {
        const styles = {
            new: { bg: "bg-emerald-100", text: "text-emerald-700" },
            reviewed: { bg: "bg-blue-100", text: "text-blue-700" },
            open: { bg: "bg-orange-100", text: "text-orange-700" },
            "in-progress": { bg: "bg-purple-100", text: "text-purple-700" },
            resolved: { bg: "bg-emerald-100", text: "text-emerald-700" },
            pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
            closed: { bg: "bg-gray-100", text: "text-gray-700" },
        };
        return styles[status] || styles.new;
    };

    const getPriorityStyle = (priority) => {
        const styles = {
            high: "bg-red-100 text-red-700",
            medium: "bg-orange-100 text-orange-700",
            low: "bg-gray-100 text-gray-600",
        };
        return styles[priority] || styles.low;
    };

    const openReplyModal = (item) => {
        setReplyTo(item);
        setReplyMessage("");
        setShowReplyModal(true);
    };

    const handleSendReply = async () => {
        try {
            await addReportReply(replyTo._id, { message: replyMessage });
            alert(`Reply sent to ${replyTo.user?.email || "user"}!`);
            setShowReplyModal(false);
            fetchReports();
        } catch (err) {
            alert("Failed to send reply.");
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateReportStatus(id, { status });
            fetchReports();
        } catch (err) {
            alert("Failed to update status.");
            console.error("Status update error:", err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        User Reports & Feedback
                    </h1>
                    <p className="text-gray-500 mt-1">Manage user issues, feature requests, and inquiries</p>
                </div>
                <div className="flex items-center gap-3">
                    <AdminButton variant="outline" onClick={fetchReports} disabled={isLoading}>
                        <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                        Refresh
                    </AdminButton>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={fetchReports} className="ml-auto text-sm font-bold underline">Retry</button>
                </div>
            )}

            {/* Tabs & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSelectedStatus(""); }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                                    activeTab === tab.id ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="h-10 px-4 text-sm bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                        <option value="">All Status</option>
                        {activeTab === "reports" && (
                            <>
                                <option value="new">New</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </>
                        )}
                        {activeTab === "feedback" && (
                            <>
                                <option value="new">New</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="closed">Closed</option>
                            </>
                        )}
                        {activeTab === "contacts" && (
                            <>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                )}
                
                {!isLoading && reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-gray-300" />
                        </div>
                        <p>No items found matching the current filters.</p>
                    </div>
                ) : (
                    <>
                        {activeTab === "reports" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Report</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reports.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{item.user?.email} • {item.category}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full uppercase", getPriorityStyle(item.priority))}>
                                                        {item.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", getStatusStyle(item.status).bg, getStatusStyle(item.status).text)}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-500 text-nowrap">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <AdminButton variant="ghost" size="icon" onClick={() => openReplyModal(item)} title="View & Reply">
                                                            <MessageSquare className="w-4 h-4 text-gray-500" />
                                                        </AdminButton>
                                                        {item.status !== "resolved" && (
                                                            <AdminButton variant="ghost" size="icon" className="text-emerald-600" onClick={() => handleStatusUpdate(item._id, "resolved")} title="Mark Resolved">
                                                                <Check className="w-4 h-4" />
                                                            </AdminButton>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "feedback" && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reports.map((item) => (
                                        <div key={item._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors duration-150">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-gray-200 text-gray-600")}>
                                                        {item.category}
                                                    </span>
                                                    <span className={cn("px-2 py-0.5 text-[10px] font-medium rounded-full capitalize", getStatusStyle(item.status).bg, getStatusStyle(item.status).text)}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 line-clamp-2 mb-3">"{item.description}"</p>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{item.user?.email}</p>
                                                <div className="flex gap-1">
                                                    <button className="text-emerald-600 hover:text-emerald-700 p-1.5 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark as Reviewed" onClick={() => handleStatusUpdate(item._id, "reviewed")}>
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Reply" onClick={() => openReplyModal(item)}>
                                                        <MessageSquare className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "contacts" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reports.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{item.title}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{item.user?.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full uppercase", getPriorityStyle(item.priority))}>
                                                        {item.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", getStatusStyle(item.status).bg, getStatusStyle(item.status).text)}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <AdminButton variant="ghost" size="icon" title="View & Reply" onClick={() => openReplyModal(item)}>
                                                            <Send className="w-4 h-4 text-emerald-500" />
                                                        </AdminButton>
                                                        {item.status !== "resolved" && (
                                                            <AdminButton variant="ghost" size="icon" className="text-emerald-600" onClick={() => handleStatusUpdate(item._id, "resolved")}>
                                                                <Check className="w-4 h-4" />
                                                            </AdminButton>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Reply Modal */}
            {showReplyModal && replyTo && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Reply to User</h3>
                                <p className="text-sm text-gray-500">To: {replyTo.user?.email || "User"}</p>
                            </div>
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Original Message Preview */}
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Original Message</p>
                                <h4 className="font-bold text-gray-900 mb-1">{replyTo.title}</h4>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{replyTo.description}</p>
                                <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    <span>{replyTo.category}</span>
                                    <span>•</span>
                                    <span>{new Date(replyTo.createdAt).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Reply Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Your Response</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={6}
                                    placeholder="Type your response here..."
                                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <AdminButton variant="ghost" onClick={() => setShowReplyModal(false)}>Cancel</AdminButton>
                            <AdminButton 
                                onClick={handleSendReply} 
                                disabled={!replyMessage.trim() || isLoading}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReports;
