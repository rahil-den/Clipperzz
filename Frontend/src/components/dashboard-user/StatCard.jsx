import { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";

const StatCard = ({
    icon: Icon,
    value,
    label,
    change,
    changeType = "positive",
    variant = "emerald",
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const cardRef = useRef(null);
    const hasAnimated = useRef(false);

    // Check if value is a string (like "Pro")
    const isTextValue = typeof value === "string" && isNaN(parseFloat(value));

    // Animated count-up effect
    useEffect(() => {
        if (isTextValue) {
            setDisplayValue(value);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animateValue();
                }
            },
            { threshold: 0.5 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [value, isTextValue]);

    const animateValue = () => {
        const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ""));
        if (isNaN(numericValue)) {
            setDisplayValue(value);
            return;
        }
        const duration = 800;
        const steps = 25;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            setDisplayValue(Math.floor(numericValue * easeOutQuad));

            if (currentStep >= steps) {
                setDisplayValue(numericValue);
                clearInterval(timer);
            }
        }, stepDuration);
    };

    const formatValue = () => {
        if (isTextValue) return value;
        const valueStr = String(value);
        if (valueStr.includes("%")) return `${displayValue}%`;
        if (valueStr.includes(".") && typeof displayValue === "number") {
            return displayValue.toFixed(1);
        }
        return displayValue;
    };

    // Professional accent-based styling matching reference
    const accentStyles = {
        emerald: {
            cardBg: "from-emerald-500/10 to-emerald-500/5",
            border: "border-emerald-500/20",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
        },
        purple: {
            cardBg: "from-purple-500/10 to-purple-500/5",
            border: "border-purple-500/20",
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-500",
        },
        orange: {
            cardBg: "from-orange-500/10 to-orange-500/5",
            border: "border-orange-500/20",
            iconBg: "bg-orange-500/10",
            iconColor: "text-orange-500",
        },
        blue: {
            cardBg: "from-blue-500/10 to-blue-500/5",
            border: "border-blue-500/20",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
        },
        yellow: {
            cardBg: "from-yellow-500/10 to-yellow-500/5",
            border: "border-yellow-500/20",
            iconBg: "bg-yellow-500/10",
            iconColor: "text-yellow-500",
        },
        red: {
            cardBg: "from-red-500/10 to-red-500/5",
            border: "border-red-500/20",
            iconBg: "bg-red-500/10",
            iconColor: "text-red-500",
        },
    };

    const style = accentStyles[variant] || accentStyles.emerald;

    return (
        <div
            ref={cardRef}
            className={cn(
                "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-['Satoshi',sans-serif]",
                style.cardBg,
                style.border
            )}
        >
            <div className="flex items-start justify-between">
                {/* Icon with colored background */}
                <div
                    className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        style.iconBg,
                        style.iconColor
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>

                {/* Trend badge */}
                {change && (
                    <span
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            changeType === "positive"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-red-500/10 text-red-500"
                        )}
                    >
                        {changeType === "positive" ? "+" : ""}
                        {change}
                    </span>
                )}
            </div>

            <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {formatValue()}
                </p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
};

export default StatCard;
