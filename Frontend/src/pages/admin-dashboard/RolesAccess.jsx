import { useState } from "react";
import { Shield, Users, Plus, Edit, Trash2, Check, X, Eye, EyeOff } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";

const defaultRoles = [
    {
        id: 1,
        name: "User",
        description: "Default role for registered users",
        color: "gray",
        userCount: 1150,
        permissions: {
            clips: { create: true, read: true, update: true, delete: true },
            videos: { create: true, read: true, update: true, delete: true },
            billing: { read: true, update: true },
            settings: { read: true, update: true },
        }
    },
    {
        id: 2,
        name: "Premium",
        description: "Paid subscription users with extra features",
        color: "purple",
        userCount: 286,
        permissions: {
            clips: { create: true, read: true, update: true, delete: true, unlimited: true },
            videos: { create: true, read: true, update: true, delete: true, unlimited: true },
            billing: { read: true, update: true },
            settings: { read: true, update: true },
            templates: { create: true, read: true },
        }
    },
    {
        id: 3,
        name: "Admin",
        description: "Platform administrators with management access",
        color: "emerald",
        userCount: 5,
        permissions: {
            users: { read: true, update: true, suspend: true },
            clips: { read: true, update: true, delete: true, flag: true },
            payments: { read: true },
            reports: { read: true },
            settings: { read: true, update: true },
        }
    },
    {
        id: 4,
        name: "Super Admin",
        description: "Full system access with all privileges",
        color: "emerald",
        userCount: 2,
        isSuper: true,
        permissions: {
            all: { full: true },
        }
    },
];

const permissionModules = [
    { key: "users", label: "User Management", actions: ["read", "create", "update", "delete", "suspend", "promote"] },
    { key: "clips", label: "Clip Management", actions: ["read", "create", "update", "delete", "flag", "unlimited"] },
    { key: "videos", label: "Video Management", actions: ["read", "create", "update", "delete", "unlimited"] },
    { key: "payments", label: "Payments", actions: ["read", "refund", "modify"] },
    { key: "reports", label: "Reports & Analytics", actions: ["read", "export"] },
    { key: "settings", label: "Platform Settings", actions: ["read", "update"] },
    { key: "admins", label: "Admin Management", actions: ["read", "create", "update", "delete"] },
    { key: "system", label: "System", actions: ["logs", "config", "maintenance"] },
];

const RolesAccess = () => {
    const [roles, setRoles] = useState(defaultRoles);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const getRoleColorStyle = (color) => {
        const styles = {
            gray: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
            purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
            emerald: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
        };
        return styles[color] || styles.gray;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        Roles & Access Control
                    </h1>
                    <p className="text-gray-500 mt-1">Manage user roles and their permissions</p>
                </div>
                <AdminButton onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4" />
                    Create Role
                </AdminButton>
            </div>

            {/* Roles Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => {
                    const colorStyle = getRoleColorStyle(role.color);
                    return (
                        <div
                            key={role.id}
                            className={cn(
                                "bg-white rounded-2xl border p-5 transition-all duration-200 hover:shadow-md cursor-pointer",
                                selectedRole?.id === role.id ? "ring-2 ring-emerald-500 border-emerald-200" : "border-gray-100"
                            )}
                            onClick={() => setSelectedRole(role)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorStyle.bg)}>
                                        <Shield className={cn("w-5 h-5", colorStyle.text)} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{role.name}</h3>
                                            {role.isSuper && (
                                                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                                                    SUPER
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{role.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <AdminButton variant="ghost" size="icon"><Edit className="w-4 h-4" /></AdminButton>
                                    {!role.isSuper && role.name !== "User" && (
                                        <AdminButton variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></AdminButton>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{role.userCount} users</span>
                                </div>
                                <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", colorStyle.bg, colorStyle.text)}>
                                    {role.isSuper ? "Full Access" : `${Object.keys(role.permissions).length} modules`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Permission Details */}
            {selectedRole && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">{selectedRole.name} Permissions</h3>
                            <p className="text-sm text-gray-500">Configure what this role can access</p>
                        </div>
                        <AdminButton variant="outline" size="sm">Save Changes</AdminButton>
                    </div>
                    {selectedRole.isSuper ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Full System Access</h4>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Super Admins have unrestricted access to all platform features and settings.
                                This role cannot be modified.
                            </p>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="space-y-4">
                                {permissionModules.slice(0, 5).map((module) => (
                                    <div key={module.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">{module.label}</p>
                                            <p className="text-xs text-gray-400">{module.actions.join(" • ")}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {module.actions.slice(0, 3).map((action) => (
                                                <button
                                                    key={action}
                                                    className={cn(
                                                        "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                                                        selectedRole.permissions[module.key]?.[action]
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-gray-200 text-gray-500"
                                                    )}
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create Role Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Create New Role</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                                <input
                                    id="role-name"
                                    type="text"
                                    placeholder="e.g. Moderator"
                                    className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    id="role-description"
                                    rows={3}
                                    placeholder="What can this role do?"
                                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Base On</label>
                                <select
                                    id="role-base"
                                    className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                >
                                    <option value="">Start from scratch</option>
                                    <option value="user">Copy from User</option>
                                    <option value="premium">Copy from Premium</option>
                                    <option value="admin">Copy from Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                            <AdminButton variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</AdminButton>
                            <AdminButton onClick={() => {
                                const roleData = {
                                    name: document.getElementById('role-name')?.value,
                                    description: document.getElementById('role-description')?.value,
                                    baseOn: document.getElementById('role-base')?.value || 'scratch',
                                    createdAt: new Date().toISOString(),
                                };
                                console.log('[RolesAccess.jsx] New Role Created:', roleData);
                                alert(`Role "${roleData.name}" created successfully!`);
                                setShowCreateModal(false);
                            }}>Create Role</AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesAccess;
