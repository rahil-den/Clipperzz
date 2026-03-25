import { useState, useEffect } from "react";
import { MoreHorizontal, Edit, UserX, Trash2, ShieldCheck, ChevronLeft, ChevronRight, Loader2, UserCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import RoleBadge from "./RoleBadge";
import { AdminButton } from "./AdminButton";
import { getUsers, updateUser, deleteUser } from "../../services/api";

const UsersTable = ({ isSuperAdmin = false }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const usersPerPage = 5;

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            // Ensure data is an array
            setUsers(Array.isArray(data) ? data : data.users || []);
        } catch (err) {
            console.error("[UsersTable.jsx] Error fetching users:", err);
            setError("Failed to load users. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateStatus = async (user, newStatus) => {
        setIsActionLoading(true);
        try {
            await updateUser(user._id, { isActive: newStatus === "active" });
            setActionMenuOpen(null);
            await fetchUsers();
        } catch (err) {
            console.error("[UsersTable.jsx] Error updating user status:", err);
            alert("Failed to update user status.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
        
        setIsActionLoading(true);
        try {
            await deleteUser(user._id);
            setActionMenuOpen(null);
            await fetchUsers();
        } catch (err) {
            console.error("[UsersTable.jsx] Error deleting user:", err);
            alert("Failed to delete user.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handlePromoteAdmin = async (user) => {
        setIsActionLoading(true);
        try {
            await updateUser(user._id, { role: "admin" });
            setActionMenuOpen(null);
            await fetchUsers();
        } catch (err) {
            console.error("[UsersTable.jsx] Error promoting user:", err);
            alert("Failed to promote user to admin.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const totalPages = Math.ceil(users.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const displayedUsers = users.slice(startIndex, startIndex + usersPerPage);

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

    // ... (rest of the component)

    return (
        <div className="bg-white rounded-2xl border border-gray-100 font-['Satoshi',sans-serif]">
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
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                        <p className="text-sm text-gray-500 font-medium">Loading users...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <p className="text-sm text-red-500 font-medium">{error}</p>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <p className="text-sm text-gray-400 font-medium">No users found</p>
                                </td>
                            </tr>
                        ) : (
                            displayedUsers.map((user) => {
                                // Map backend fields to frontend expectations
                                const status = user.isActive === false ? "suspended" : "active";
                                const authType = user.authProvider === "google" ? "Google" : "Email";

                                return (
                                    <tr
                                        key={user._id}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar || user.name}`}
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
                                            {/* getAuthTypeBadge is defined lower in the file in the original */}
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", authType === "Google" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600")}>
                                                {authType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 relative">
                                                <button
                                                    onClick={() => setActionMenuOpen(actionMenuOpen === user._id ? null : user._id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                                                >
                                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                                </button>

                                                {actionMenuOpen === user._id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[999]">
                                                        {isActionLoading ? (
                                                            <div className="px-4 py-2 flex items-center justify-center">
                                                                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                                            </div>
                                                        ) : (
                                                            <>
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
                                                                        onClick={() => handlePromoteAdmin(user)}
                                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                                    >
                                                                        <ShieldCheck className="w-4 h-4" />
                                                                        Promote to Admin
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleUpdateStatus(user, status === "suspended" ? "active" : "suspended")}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                                                                >
                                                                    {status === "suspended" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                                                    {status === "suspended" ? "Unsuspend" : "Suspend"}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete User
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing {users.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + usersPerPage, users.length)} of {users.length} users
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
