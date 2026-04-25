import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, UserX, UserCheck, Trash2, Shield, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import RoleBadge from "../../components/admin-dashboard-components/RoleBadge";
import { cn } from "../../lib/utils";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/api";

// ── Create Admin Modal ────────────────────────────────────────────────────────
const CreateAdminModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.name || !form.email || !form.password) {
            setError("All fields are required.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setIsLoading(true);
        try {
            const newAdmin = await createUser({ ...form, role: "admin" });
            onCreated(newAdmin);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create admin. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Create New Admin</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Enter admin name"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="admin@clipperz.io"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Temporary Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="Min. 8 characters"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                    <AdminButton variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </AdminButton>
                    <AdminButton onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Admin"
                        )}
                    </AdminButton>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
    const [actionLoading, setActionLoading] = useState(null); // userId being acted on

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // Fetch all admin/superadmin users
    const fetchAdmins = useCallback(async () => {
        setIsLoading(true);
        try {
            const allUsers = await getUsers();
            const adminUsers = allUsers.filter(
                (u) => u.role === "admin" || u.role === "superadmin"
            );
            setAdmins(adminUsers);
        } catch (err) {
            console.error("[AdminManagement] Failed to fetch admins:", err);
            showToast("error", "Failed to load admin accounts.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    // Handle new admin created in modal
    const handleAdminCreated = (newAdmin) => {
        setAdmins((prev) => [newAdmin, ...prev]);
        showToast("success", `Admin "${newAdmin.name}" created successfully.`);
    };

    // Toggle active/inactive
    const handleToggleActive = async (admin) => {
        setActionLoading(admin._id);
        try {
            const updated = await updateUser(admin._id, { isActive: !admin.isActive });
            setAdmins((prev) =>
                prev.map((a) => (a._id === updated._id ? updated : a))
            );
            showToast(
                "success",
                `${updated.name} has been ${updated.isActive ? "activated" : "deactivated"}.`
            );
        } catch (err) {
            showToast("error", err.response?.data?.message || "Failed to update admin status.");
        } finally {
            setActionLoading(null);
        }
    };

    // Delete admin
    const handleDelete = async (admin) => {
        if (!window.confirm(`Delete admin "${admin.name}"? This cannot be undone.`)) return;
        setActionLoading(admin._id);
        try {
            await deleteUser(admin._id);
            setAdmins((prev) => prev.filter((a) => a._id !== admin._id));
            showToast("success", `Admin "${admin.name}" deleted.`);
        } catch (err) {
            showToast("error", err.response?.data?.message || "Failed to delete admin.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Toast */}
            {toast && (
                <div
                    className={cn(
                        "fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2",
                        toast.type === "success"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                    )}
                >
                    {toast.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                            Admin Management
                        </h1>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            SUPER ADMIN ONLY
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                        {isLoading ? "Loading..." : `${admins.length} admin account${admins.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
                <AdminButton onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4" />
                    Create Admin
                </AdminButton>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Admin Accounts</h3>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-3" />
                        <p className="text-sm">Loading admin accounts...</p>
                    </div>
                ) : admins.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Shield className="w-10 h-10 mb-3 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">No admin accounts found</p>
                        <p className="text-xs text-gray-400 mt-1">Create one using the button above</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => {
                                    const isBusy = actionLoading === admin._id;
                                    return (
                                        <tr
                                            key={admin._id}
                                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <Shield className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{admin.name}</p>
                                                        <p className="text-sm text-gray-500">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <RoleBadge role={admin.role} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                                    admin.isActive
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-gray-100 text-gray-600"
                                                )}>
                                                    {admin.isActive ? "Active" : "Disabled"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600">
                                                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Toggle Active */}
                                                    <button
                                                        onClick={() => handleToggleActive(admin)}
                                                        disabled={isBusy}
                                                        title={admin.isActive ? "Deactivate admin" : "Activate admin"}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                    >
                                                        {isBusy ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                                        ) : admin.isActive ? (
                                                            <UserX className="w-4 h-4 text-orange-500" />
                                                        ) : (
                                                            <UserCheck className="w-4 h-4 text-emerald-500" />
                                                        )}
                                                    </button>
                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(admin)}
                                                        disabled={isBusy || admin.role === "superadmin"}
                                                        title={admin.role === "superadmin" ? "Cannot delete superadmin" : "Delete admin"}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Admin Modal */}
            {showCreateModal && (
                <CreateAdminModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={handleAdminCreated}
                />
            )}
        </div>
    );
};

export default AdminManagement;
