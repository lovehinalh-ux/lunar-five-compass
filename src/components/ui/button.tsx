import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C97A2B]/40",
  {
    variants: {
      variant: {
        default:
          "bg-[#C97A2B] text-white hover:bg-[#B36A1F] shadow-[0_10px_24px_rgba(58,42,30,0.16)]",
        ghost: "bg-transparent text-[#8A6F55] hover:bg-[#F5E6D3]",
        outline: "border border-[#E6D5C3] bg-[#FFF9F0] text-[#3A2A1E] hover:bg-[#F5E6D3]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button };
