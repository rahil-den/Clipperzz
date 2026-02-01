import { useState } from "react";
import { Plus, Edit, UserX, UserCheck, Trash2, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import RoleBadge from "../../components/admin-dashboard-components/RoleBadge";
import { cn } from "../../lib/utils";

const mockAdmins = [
    { id: 1, name: "John Admin", email: "john.admin@clipperz.io", role: "admin", status: "active", created: "Jan 5, 2024" },
    { id: 2, name: "Sarah Manager", email: "sarah.m@clipperz.io", role: "admin", status: "active", created: "Dec 20, 2023" },
    { id: 3, name: "Mike Support", email: "mike.s@clipperz.io", role: "admin", status: "disabled", created: "Nov 15, 2023" },
];

const AdminManagement = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    return (
        <div className="max-w-5xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
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
                    <p className="text-gray-500 mt-1">Create and manage admin accounts</p>
                </div>
                <AdminButton onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4" />
                    Create Admin
                </AdminButton>
            </div>

            {/* Admins Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Admin Accounts</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockAdmins.map((admin) => (
                                <tr
                                    key={admin.id}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
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
                                            admin.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                                        )}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">{admin.created}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <AdminButton variant="ghost" size="icon">
                                                <Edit className="w-4 h-4" />
                                            </AdminButton>
                                            <AdminButton variant="ghost" size="icon">
                                                {admin.status === "active" ? (
                                                    <UserX className="w-4 h-4 text-orange-500" />
                                                ) : (
                                                    <UserCheck className="w-4 h-4 text-emerald-500" />
                                                )}
                                            </AdminButton>
                                            <AdminButton variant="ghost" size="icon">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </AdminButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Admin Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Create New Admin</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    id="admin-name"
                                    type="text"
                                    placeholder="Enter admin name"
                                    className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    id="admin-email"
                                    type="email"
                                    placeholder="admin@clipperz.io"
                                    className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Temporary Password</label>
                                <input
                                    id="admin-password"
                                    type="password"
                                    placeholder="Set initial password"
                                    className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                            <AdminButton variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</AdminButton>
                            <AdminButton onClick={() => {
                                const adminData = {
                                    name: document.getElementById('admin-name')?.value,
                                    email: document.getElementById('admin-email')?.value,
                                    password: document.getElementById('admin-password')?.value,
                                    createdAt: new Date().toISOString(),
                                };
                                console.log('[AdminManagement.jsx] New Admin Created:', adminData);
                                alert('Admin created successfully!');
                                setShowCreateModal(false);
                            }}>Create Admin</AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
