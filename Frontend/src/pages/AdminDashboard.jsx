import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin-dashboard-components/AdminSidebar";
import AdminHeader from "../components/admin-dashboard-components/AdminHeader";

const AdminDashboard = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === "superadmin";

    return (
        <div className="min-h-screen bg-gray-50/50 font-['Satoshi',sans-serif]">
            <AdminSidebar isSuperAdmin={isSuperAdmin} />
            <div className="pl-[240px]">
                <AdminHeader
                    isSuperAdmin={isSuperAdmin}
                    onToggleRole={() => console.log("Role toggling disabled in production")}
                />
                <main className="p-6">
                    <Outlet context={{ isSuperAdmin }} />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;

