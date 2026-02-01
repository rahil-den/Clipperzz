import { useState } from "react";
import { MessageSquare, Flag, Headphones, Search, Filter, Eye, Check, Trash2, ChevronLeft, ChevronRight, Clock, Send, X } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";

const mockFeedback = [
    { id: 1, user: "alex@example.com", type: "feature", message: "Would love to see more templates for TikTok", status: "new", date: "Jan 15, 2024" },
    { id: 2, user: "sarah@gmail.com", type: "improvement", message: "The export process could be faster", status: "reviewed", date: "Jan 14, 2024" },
];

const mockReports = [
    { id: 1, user: "mike@test.com", category: "bug", title: "Video upload fails on large files", description: "When uploading videos over 500MB, the upload fails without error message", status: "open", priority: "high", date: "Jan 15, 2024" },
    { id: 2, user: "emily@example.com", category: "ui", title: "Button overlap on mobile", description: "The save button overlaps with cancel button on iPhone SE", status: "in-progress", priority: "medium", date: "Jan 14, 2024" },
    { id: 3, user: "john@company.com", category: "payment", title: "Double charged for subscription", description: "I was charged twice for my January subscription", status: "resolved", priority: "high", date: "Jan 12, 2024" },
];

const mockContacts = [
    { id: 1, user: "alex@example.com", subject: "Need help with API access", priority: "medium", message: "I upgraded to enterprise but can't find my API keys", status: "pending", date: "Jan 15, 2024" },
    { id: 2, user: "business@corp.com", subject: "Enterprise pricing inquiry", priority: "high", message: "Looking to onboard 50+ team members, need custom quote", status: "pending", date: "Jan 14, 2024" },
];

const UserReports = () => {
    const [activeTab, setActiveTab] = useState("reports");
    const [selectedItem, setSelectedItem] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");

    const tabs = [
        { id: "reports", label: "Issue Reports", icon: Flag, count: mockReports.filter(r => r.status !== "resolved").length },
        { id: "feedback", label: "Feedback", icon: MessageSquare, count: mockFeedback.filter(f => f.status === "new").length },
        { id: "contacts", label: "Contact Requests", icon: Headphones, count: mockContacts.filter(c => c.status === "pending").length },
    ];

    const getStatusStyle = (status) => {
        const styles = {
            new: { bg: "bg-emerald-100", text: "text-emerald-700" },
            reviewed: { bg: "bg-gray-100", text: "text-gray-600" },
            open: { bg: "bg-orange-100", text: "text-orange-700" },
            "in-progress": { bg: "bg-purple-100", text: "text-purple-700" },
            resolved: { bg: "bg-emerald-100", text: "text-emerald-700" },
            pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
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

    const openReplyModal = (item, type) => {
        setReplyTo({ ...item, type });
        setReplyMessage("");
        setShowReplyModal(true);
    };

    const handleSendReply = () => {
        const replyData = {
            to: replyTo.user,
            subject: replyTo.title || replyTo.subject || replyTo.type,
            message: replyMessage,
            originalItem: replyTo,
            sentAt: new Date().toISOString(),
        };
        console.log('[UserReports.jsx] Reply Sent:', replyData);
        alert(`Reply sent to ${replyTo.user}!`);
        setShowReplyModal(false);
        setReplyTo(null);
        setReplyMessage("");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    User Reports & Feedback
                </h1>
                <p className="text-gray-500 mt-1">View and respond to user feedback, issue reports, and contact requests</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                            activeTab === tab.id
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={cn(
                                "px-1.5 py-0.5 text-xs font-semibold rounded-full",
                                activeTab === tab.id ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                            )}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Issue Reports Tab */}
            {activeTab === "reports" && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Issue Reports from Users</h3>
                        <div className="flex items-center gap-2">
                            <select className="h-9 px-3 text-sm bg-gray-50 border border-gray-100 rounded-lg">
                                <option value="">All Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {mockReports.map((report) => {
                            const statusStyle = getStatusStyle(report.status);
                            return (
                                <div
                                    key={report.id}
                                    className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900">{report.title}</h4>
                                                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", getPriorityStyle(report.priority))}>
                                                    {report.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">{report.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span>From: {report.user}</span>
                                                <span>Category: {report.category}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{report.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full capitalize", statusStyle.bg, statusStyle.text)}>
                                                {report.status}
                                            </span>
                                            <AdminButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openReplyModal(report, 'report')}
                                            >
                                                Reply
                                            </AdminButton>
                                            <AdminButton variant="ghost" size="icon"><Eye className="w-4 h-4" /></AdminButton>
                                            <AdminButton variant="ghost" size="icon"><Check className="w-4 h-4 text-emerald-500" /></AdminButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Feedback Tab */}
            {activeTab === "feedback" && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">User Feedback</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {mockFeedback.map((item) => {
                            const statusStyle = getStatusStyle(item.status);
                            return (
                                <div
                                    key={item.id}
                                    className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full capitalize">
                                                    {item.type}
                                                </span>
                                                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", statusStyle.bg, statusStyle.text)}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{item.message}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span>From: {item.user}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AdminButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openReplyModal(item, 'feedback')}
                                            >
                                                Reply
                                            </AdminButton>
                                            <AdminButton variant="ghost" size="icon"><Check className="w-4 h-4 text-emerald-500" /></AdminButton>
                                            <AdminButton variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></AdminButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Contact Requests Tab */}
            {activeTab === "contacts" && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Contact Requests</h3>
                        <p className="text-sm text-gray-500">Users who want to get in touch with the team</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {mockContacts.map((contact) => {
                            const statusStyle = getStatusStyle(contact.status);
                            return (
                                <div
                                    key={contact.id}
                                    className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900">{contact.subject}</h4>
                                                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", getPriorityStyle(contact.priority))}>
                                                    {contact.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">{contact.message}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span>From: {contact.user}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{contact.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full capitalize", statusStyle.bg, statusStyle.text)}>
                                                {contact.status}
                                            </span>
                                            <AdminButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openReplyModal(contact, 'contact')}
                                            >
                                                Reply
                                            </AdminButton>
                                            <AdminButton variant="ghost" size="icon"><Check className="w-4 h-4 text-emerald-500" /></AdminButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && replyTo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Reply to User</h3>
                                <p className="text-sm text-gray-500">Sending reply to {replyTo.user}</p>
                            </div>
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Original Message Preview */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-medium text-gray-500 mb-1">Original {replyTo.type}:</p>
                                <p className="text-sm text-gray-700">{replyTo.message || replyTo.description}</p>
                                {replyTo.title && (
                                    <p className="text-xs text-gray-400 mt-2">Subject: {replyTo.title}</p>
                                )}
                            </div>

                            {/* Reply Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={5}
                                    placeholder="Type your response to the user..."
                                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                            <AdminButton variant="ghost" onClick={() => setShowReplyModal(false)}>Cancel</AdminButton>
                            <AdminButton onClick={handleSendReply} disabled={!replyMessage.trim()}>
                                <Send className="w-4 h-4" />
                                Send Reply
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReports;
