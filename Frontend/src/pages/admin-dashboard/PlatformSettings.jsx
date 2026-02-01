import { useState } from "react";
import { Sliders, DollarSign, Zap, Save, Mail, Shield, Database, Eye, EyeOff } from "lucide-react";
import { AdminButton } from "../../components/admin-dashboard-components/AdminButton";
import { cn } from "../../lib/utils";

const PlatformSettings = () => {
    const [showSmtpPassword, setShowSmtpPassword] = useState(false);

    const [aiLimits, setAiLimits] = useState({
        maxClipsPerVideo: 15,
        maxVideoDuration: 120,
        processingPriority: 3,
    });

    const [pricing, setPricing] = useState({
        proMonthly: 29,
        proAnnual: 290,
        enterprise: 99,
    });

    const [featureFlags, setFeatureFlags] = useState({
        bulkUpload: true,
        advancedEditor: true,
        apiAccess: false,
        betaFeatures: false,
        maintenance: false,
    });

    const [smtp, setSmtp] = useState({
        host: "smtp.clipperz.io",
        port: "587",
        username: "noreply@clipperz.io",
        password: "",
        fromName: "Clipperz",
        fromEmail: "noreply@clipperz.io",
        encryption: "tls",
    });

    const [adminPermissions, setAdminPermissions] = useState({
        canManageUsers: true,
        canSuspendUsers: true,
        canDeleteClips: true,
        canViewPayments: true,
        canExportData: false,
        canModifyPricing: false,
        canAccessLogs: false,
        maxUsersPerPage: 50,
        maxActionsPerDay: 100,
    });

    const [storage, setStorage] = useState({
        maxFileSize: 500,
        maxStoragePerUser: 10,
        videoRetention: 90,
        clipRetention: 365,
    });

    const handleSaveAll = () => {
        const allSettings = {
            aiLimits,
            pricing,
            featureFlags,
            smtp,
            adminPermissions,
            storage,
            savedAt: new Date().toISOString(),
        };
        console.log("Platform Settings Saved:", allSettings);
        alert("Settings saved successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                            Platform Settings
                        </h1>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            SUPER ADMIN ONLY
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">Configure global platform limits, email, pricing, and features</p>
                </div>
                <AdminButton onClick={handleSaveAll}>
                    <Save className="w-4 h-4" />
                    Save All Changes
                </AdminButton>
            </div>

            {/* SMTP Email Configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                        <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Email Configuration (SMTP)</h3>
                        <p className="text-sm text-gray-500">Configure outgoing email settings for notifications</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                        <input
                            type="text"
                            value={smtp.host}
                            onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                            placeholder="smtp.example.com"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                        <input
                            type="text"
                            value={smtp.port}
                            onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                            placeholder="587"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={smtp.username}
                            onChange={(e) => setSmtp({ ...smtp, username: e.target.value })}
                            placeholder="username@example.com"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showSmtpPassword ? "text" : "password"}
                                value={smtp.password}
                                onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full h-10 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                        <input
                            type="text"
                            value={smtp.fromName}
                            onChange={(e) => setSmtp({ ...smtp, fromName: e.target.value })}
                            placeholder="Clipperz"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                        <input
                            type="email"
                            value={smtp.fromEmail}
                            onChange={(e) => setSmtp({ ...smtp, fromEmail: e.target.value })}
                            placeholder="noreply@clipperz.io"
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
                        <div className="flex gap-4">
                            {["none", "ssl", "tls"].map((enc) => (
                                <button
                                    key={enc}
                                    onClick={() => setSmtp({ ...smtp, encryption: enc })}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-all uppercase",
                                        smtp.encryption === enc
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    {enc}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                    <AdminButton variant="outline" size="sm" onClick={() => console.log("[PlatformSettings.jsx] Test email sent to:", smtp.fromEmail)}>
                        Send Test Email
                    </AdminButton>
                    <AdminButton size="sm" onClick={() => {
                        console.log("[PlatformSettings.jsx] SMTP Settings Saved:", smtp);
                        alert("SMTP settings saved!");
                    }}>
                        <Save className="w-4 h-4" />
                        Save SMTP Settings
                    </AdminButton>
                </div>
            </div>

            {/* Admin Permissions Control */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Admin Permissions</h3>
                        <p className="text-sm text-gray-500">Control what regular admins can do</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                        { key: "canManageUsers", label: "Manage Users", desc: "View and edit user profiles" },
                        { key: "canSuspendUsers", label: "Suspend Users", desc: "Temporarily disable user accounts" },
                        { key: "canDeleteClips", label: "Delete Clips", desc: "Remove user-generated clips" },
                        { key: "canViewPayments", label: "View Payments", desc: "Access payment and revenue data" },
                        { key: "canExportData", label: "Export Data", desc: "Download reports and user data" },
                        { key: "canModifyPricing", label: "Modify Pricing", desc: "Change subscription prices" },
                        { key: "canAccessLogs", label: "Access System Logs", desc: "View audit and system logs" },
                    ].map((perm) => (
                        <div
                            key={perm.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                            <div>
                                <p className="font-medium text-gray-700">{perm.label}</p>
                                <p className="text-sm text-gray-400">{perm.desc}</p>
                            </div>
                            <div
                                onClick={() => setAdminPermissions({ ...adminPermissions, [perm.key]: !adminPermissions[perm.key] })}
                                className={cn(
                                    "w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer",
                                    adminPermissions[perm.key] ? "bg-emerald-500" : "bg-gray-200"
                                )}
                            >
                                <div
                                    className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                                        adminPermissions[perm.key] ? "left-6" : "left-1"
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Users Per Page</label>
                        <input
                            type="number"
                            value={adminPermissions.maxUsersPerPage}
                            onChange={(e) => setAdminPermissions({ ...adminPermissions, maxUsersPerPage: parseInt(e.target.value) })}
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Actions Per Day</label>
                        <input
                            type="number"
                            value={adminPermissions.maxActionsPerDay}
                            onChange={(e) => setAdminPermissions({ ...adminPermissions, maxActionsPerDay: parseInt(e.target.value) })}
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <AdminButton size="sm" onClick={() => {
                        console.log("[PlatformSettings.jsx] Admin Permissions Saved:", adminPermissions);
                        alert("Admin permissions saved!");
                    }}>
                        <Save className="w-4 h-4" />
                        Save Permissions
                    </AdminButton>
                </div>
            </div>

            {/* Storage Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                        <Database className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Storage & Retention</h3>
                        <p className="text-sm text-gray-500">Configure storage limits and data retention</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                        <input
                            type="number"
                            value={storage.maxFileSize}
                            onChange={(e) => setStorage({ ...storage, maxFileSize: parseInt(e.target.value) })}
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Storage Per User (GB)</label>
                        <input
                            type="number"
                            value={storage.maxStoragePerUser}
                            onChange={(e) => setStorage({ ...storage, maxStoragePerUser: parseInt(e.target.value) })}
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video Retention (days)</label>
                        <input
                            type="number"
                            value={storage.videoRetention}
                            onChange={(e) => setStorage({ ...storage, videoRetention: parseInt(e.target.value) })}
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Clip Retention (days)</label>
                        <input
                            type="number"
                            value={storage.clipRetention}
                            onChange={(e) => setStorage({ ...storage, clipRetention: parseInt(e.target.value) })}
                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <AdminButton size="sm" onClick={() => {
                        console.log("[PlatformSettings.jsx] Storage Settings Saved:", storage);
                        alert("Storage settings saved!");
                    }}>
                        <Save className="w-4 h-4" />
                        Save Storage Settings
                    </AdminButton>
                </div>
            </div>

            {/* AI Limits */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                        <Sliders className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">AI Processing Limits</h3>
                        <p className="text-sm text-gray-500">Configure clip generation limits</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Max Clips Per Video</label>
                            <span className="text-sm font-semibold text-gray-900">{aiLimits.maxClipsPerVideo}</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={aiLimits.maxClipsPerVideo}
                            onChange={(e) => setAiLimits({ ...aiLimits, maxClipsPerVideo: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>5</span>
                            <span>50</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Max Video Duration (minutes)</label>
                            <span className="text-sm font-semibold text-gray-900">{aiLimits.maxVideoDuration}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="300"
                            step="10"
                            value={aiLimits.maxVideoDuration}
                            onChange={(e) => setAiLimits({ ...aiLimits, maxVideoDuration: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>10 min</span>
                            <span>300 min</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <AdminButton size="sm" onClick={() => {
                        console.log("[PlatformSettings.jsx] AI Limits Saved:", aiLimits);
                        alert("AI limits saved!");
                    }}>
                        <Save className="w-4 h-4" />
                        Save AI Limits
                    </AdminButton>
                </div>
            </div>

            {/* Pricing Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Pricing Controls</h3>
                        <p className="text-sm text-gray-500">Manage subscription pricing</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-xl">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pro Monthly</label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">$</span>
                            <input
                                type="number"
                                value={pricing.proMonthly}
                                onChange={(e) => setPricing({ ...pricing, proMonthly: parseInt(e.target.value) })}
                                className="w-full h-10 px-3 text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pro Annual</label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">$</span>
                            <input
                                type="number"
                                value={pricing.proAnnual}
                                onChange={(e) => setPricing({ ...pricing, proAnnual: parseInt(e.target.value) })}
                                className="w-full h-10 px-3 text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enterprise</label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">$</span>
                            <input
                                type="number"
                                value={pricing.enterprise}
                                onChange={(e) => setPricing({ ...pricing, enterprise: parseInt(e.target.value) })}
                                className="w-full h-10 px-3 text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <AdminButton size="sm" onClick={() => {
                        console.log("[PlatformSettings.jsx] Pricing Saved:", pricing);
                        alert("Pricing saved!");
                    }}>
                        <Save className="w-4 h-4" />
                        Save Pricing
                    </AdminButton>
                </div>
            </div>

            {/* Feature Flags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                        <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Feature Flags</h3>
                        <p className="text-sm text-gray-500">Toggle platform features on/off</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {Object.entries(featureFlags).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                            <div>
                                <p className="font-medium text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {key === "maintenance" ? "Enable maintenance mode for all users" : `Enable ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} feature`}
                                </p>
                            </div>
                            <div
                                onClick={() => setFeatureFlags({ ...featureFlags, [key]: !value })}
                                className={cn(
                                    "w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer",
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
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <AdminButton size="sm" onClick={() => {
                        console.log("[PlatformSettings.jsx] Feature Flags Saved:", featureFlags);
                        alert("Feature flags saved!");
                    }}>
                        <Save className="w-4 h-4" />
                        Save Feature Flags
                    </AdminButton>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;

