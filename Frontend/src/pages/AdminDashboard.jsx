import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin-dashboard-components/AdminSidebar";
import AdminHeader from "../components/admin-dashboard-components/AdminHeader";

const AdminDashboard = () => {
    // Toggle for testing Admin vs Super Admin view
    const [isSuperAdmin, setIsSuperAdmin] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50/50 font-['Satoshi',sans-serif]">
            <AdminSidebar isSuperAdmin={isSuperAdmin} />
            <div className="pl-[240px]">
                <AdminHeader
                    isSuperAdmin={isSuperAdmin}
                    onToggleRole={() => setIsSuperAdmin(!isSuperAdmin)}
                />
                <main className="p-6">
                    <Outlet context={{ isSuperAdmin }} />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;

