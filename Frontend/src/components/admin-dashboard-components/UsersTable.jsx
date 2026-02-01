import { useState } from "react";
import { MoreHorizontal, Edit, UserX, Trash2, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import RoleBadge from "./RoleBadge";
import { AdminButton } from "./AdminButton";

const mockUsers = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", authType: "Email", role: "premium", status: "active", avatar: "Alex" },
    { id: 2, name: "Sarah Wilson", email: "sarah@gmail.com", authType: "Google", role: "user", status: "active", avatar: "Sarah" },
    { id: 3, name: "Mike Chen", email: "mike@example.com", authType: "Email", role: "admin", status: "active", avatar: "Mike" },
    { id: 4, name: "Emily Brown", email: "emily@test.com", authType: "Google", role: "user", status: "suspended", avatar: "Emily" },
    { id: 5, name: "David Lee", email: "david@example.com", authType: "Email", role: "premium", status: "active", avatar: "David" },
    { id: 6, name: "Lisa Wang", email: "lisa@gmail.com", authType: "Google", role: "user", status: "active", avatar: "Lisa" },
    { id: 7, name: "James Miller", email: "james@example.com", authType: "Email", role: "user", status: "active", avatar: "James" },
    { id: 8, name: "Anna Garcia", email: "anna@test.com", authType: "Email", role: "premium", status: "active", avatar: "Anna" },
];

const UsersTable = ({ isSuperAdmin = false }) => {
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const totalPages = Math.ceil(mockUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const displayedUsers = mockUsers.slice(startIndex, startIndex + usersPerPage);

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-emerald-100 text-emerald-700",
            suspended: "bg-red-100 text-red-700",
            pending: "bg-yellow-100 text-yellow-700",
        };
        return (
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", styles[status])}>
                {status}
            </span>
        );
    };

    const getAuthTypeBadge = (authType) => {
        const styles = {
            Email: "bg-gray-100 text-gray-600",
            Google: "bg-orange-100 text-orange-600",
        };
        return (
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", styles[authType])}>
                {authType}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden font-['Satoshi',sans-serif]">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Auth Type</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full bg-gray-100"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getAuthTypeBadge(user.authType)}
                                </td>
                                <td className="px-6 py-4">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2 relative">
                                        <button
                                            onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                        </button>

                                        {actionMenuOpen === user.id && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                                                <button
                                                    onClick={() => {
                                                        console.log('[UsersTable.jsx] Edit User:', user);
                                                        setActionMenuOpen(null);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit User
                                                </button>
                                                {isSuperAdmin && user.role !== "admin" && (
                                                    <button
                                                        onClick={() => {
                                                            console.log('[UsersTable.jsx] Promote to Admin:', user);
                                                            alert(`${user.name} promoted to Admin!`);
                                                            setActionMenuOpen(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                        Promote to Admin
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const action = user.status === "suspended" ? "Unsuspend" : "Suspend";
                                                        console.log(`[UsersTable.jsx] ${action} User:`, user);
                                                        alert(`${user.name} ${action.toLowerCase()}ed!`);
                                                        setActionMenuOpen(null);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                    {user.status === "suspended" ? "Unsuspend" : "Suspend"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        console.log('[UsersTable.jsx] Delete User:', user);
                                                        alert(`${user.name} deleted!`);
                                                        setActionMenuOpen(null);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete User
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
                    Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, mockUsers.length)} of {mockUsers.length} users
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
    );
};

export default UsersTable;
