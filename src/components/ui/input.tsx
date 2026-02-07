import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[#E6D5C3] bg-[#FFF9F0] px-3 py-2 text-sm text-[#3A2A1E] ring-offset-[#FFF9F0] placeholder:text-[#8A6F55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C97A2B]/40",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
