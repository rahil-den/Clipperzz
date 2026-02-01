import SuperAdminTools from "../../components/admin-dashboard-components/SuperAdminTools";

const SuperTools = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        Super Tools
                    </h1>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        SUPER ADMIN ONLY
                    </span>
                </div>
                <p className="text-gray-500 mt-1">Unlimited video generation with no restrictions</p>
            </div>

            {/* Super Admin Tools */}
            <SuperAdminTools />
        </div>
    );
};

export default SuperTools;
