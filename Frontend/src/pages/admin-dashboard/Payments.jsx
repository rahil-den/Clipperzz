import PaymentsTable from "../../components/admin-dashboard-components/PaymentsTable";

const Payments = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Payments & Revenue
                </h1>
                <p className="text-gray-500 mt-1">Track revenue, subscriptions, and transaction history</p>
            </div>

            {/* Payments Content */}
            <PaymentsTable />
        </div>
    );
};

export default Payments;
