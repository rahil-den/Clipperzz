import { cn } from "../../lib/utils";

const roleStyles = {
    user: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "User",
    },
    premium: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        label: "Premium",
    },
    admin: {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        label: "Admin",
    },
    superadmin: {
        bg: "bg-emerald-500",
        text: "text-white",
        label: "Super Admin",
        animated: true,
    },
};

const RoleBadge = ({ role = "user", className }) => {
    const style = roleStyles[role] || roleStyles.user;

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200",
                style.bg,
                style.text,
                style.animated && "animate-pulse-subtle",
                className
            )}
        >
            {style.label}
        </span>
    );
};

export default RoleBadge;
