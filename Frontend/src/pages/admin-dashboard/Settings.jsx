import { useState } from "react";
import { User, Bell, Shield, Eye, EyeOff } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [notifications, setNotifications] = useState({
        newUsers: true,
        payments: true,
        systemAlerts: true,
        weeklyReport: false,
    });

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Admin Settings
                </h1>
                <p className="text-gray-500 mt-1">Manage your admin profile and preferences</p>
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
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                    <div className="flex items-center gap-5">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                            alt="Admin avatar"
                            className="w-20 h-20 rounded-2xl bg-gray-100"
                        />
                        <div>
                            <AdminButton variant="outline" size="sm">Change Avatar</AdminButton>
                            <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Admin User"
                                className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                defaultValue="admin@clipperz.io"
                                className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <AdminButton>Save Changes</AdminButton>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-150">
                                <div>
                                    <p className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    <p className="text-sm text-gray-400">Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                                </div>
                                <div
                                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                    className={cn(
                                        "w-11 h-6 rounded-full transition-all duration-200 relative",
                                        value ? "bg-emerald-500" : "bg-gray-200"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                                            value ? "left-6" : "left-1"
                                        )}
                                    />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                    <h3 className="font-semibold text-gray-900">Change Password</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    className="w-full h-10 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150"
                            />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <AdminButton>Update Password</AdminButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
