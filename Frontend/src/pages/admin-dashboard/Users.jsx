import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Filter, Plus, Download } from "lucide-react";
import UsersTable from "../../components/admin-dashboard-components/UsersTable";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";

const Users = () => {
    const { isSuperAdmin } = useOutletContext();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        User Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage all registered users and their permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <AdminButton variant="outline">
                        <Download className="w-4 h-4" />
                        Export
                    </AdminButton>
                    <AdminButton>
                        <Plus className="w-4 h-4" />
                        Add User
                    </AdminButton>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="h-10 px-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150">
                            <option value="">All Roles</option>
                            <option value="user">User</option>
                            <option value="premium">Premium</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select className="h-10 px-4 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <AdminButton variant="ghost" size="icon">
                            <Filter className="w-4 h-4" />
                        </AdminButton>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <UsersTable isSuperAdmin={isSuperAdmin} />
        </div>
    );
};

export default Users;
