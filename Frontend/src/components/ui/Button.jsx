import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-lg bg-gray-900 text-white hover:bg-gray-800",

        ghost:
          "rounded-lg hover:bg-gray-100",

        "ghost-nav":
          "text-gray-500 hover:text-gray-900 transition-colors",

        gradient:
          "h-9 px-6 rounded-lg font-semibold text-black " +
          "bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#2dd4bf] " +
          "shadow-[0_8px_30px_rgba(34,197,94,0.35)] " +
          "hover:shadow-[0_12px_40px_rgba(34,197,94,0.45)]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
