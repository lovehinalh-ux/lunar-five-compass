import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#E6D5C3] bg-[#FFF9F0] px-3 py-2 text-sm text-[#3A2A1E] ring-offset-[#FFF9F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C97A2B]/40",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";

export { Select };
