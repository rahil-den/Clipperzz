import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard-user/Sidebar";
import Header from "../components/dashboard-user/Header";

const Dashboard = () => {
    const handleCreateClip = () => {
        const createClipSection = document.getElementById("create-clip-section");
        if (createClipSection) {
            createClipSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-['Satoshi',sans-serif]">
            <Sidebar />
            <div className="pl-[240px]">
                <Header onCreateClip={handleCreateClip} />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
