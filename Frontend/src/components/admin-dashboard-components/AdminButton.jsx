import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const adminButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                primary:
                    "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md",
                secondary:
                    "bg-gray-100 text-gray-900 hover:bg-gray-200",
                danger:
                    "bg-red-500 text-white hover:bg-red-600",
                ghost:
                    "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
                outline:
                    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300",
            },
            size: {
                default: "h-10 px-4 py-2 rounded-xl",
                sm: "h-8 px-3 rounded-lg text-xs",
                lg: "h-11 px-6 rounded-xl text-base",
                icon: "h-9 w-9 rounded-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

const AdminButton = React.forwardRef(
    ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={ref}
                className={cn(adminButtonVariants({ variant, size }), className)}
                disabled={loading || props.disabled}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </Comp>
        );
    }
);

AdminButton.displayName = "AdminButton";

export { AdminButton, adminButtonVariants };
