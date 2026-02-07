import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionValue = string[];

interface AccordionContextValue {
  value: AccordionValue;
  onValueChange: (value: AccordionValue) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used inside <Accordion />");
  }
  return context;
}

interface AccordionItemContextValue {
  itemValue: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error("Accordion item components must be used inside <AccordionItem />");
  }
  return context;
}

export function Accordion({
  value,
  onValueChange,
  className,
  children,
}: {
  value: AccordionValue;
  onValueChange: (value: AccordionValue) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionContext.Provider value={{ value, onValueChange }}>
      <div className={cn("grid gap-3", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItemContext.Provider value={{ itemValue: value }}>
      <div className={cn("rounded-3xl border border-[#E6D5C3] bg-[#FFF9F0]", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { value, onValueChange } = useAccordionContext();
  const { itemValue } = useAccordionItemContext();
  const isOpen = value.includes(itemValue);
  const contentId = `accordion-content-${itemValue}`;

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-3xl px-5 py-4 text-left text-base font-semibold text-[#3A2A1E] hover:bg-[#F5E6D3]",
        className,
      )}
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={() =>
        onValueChange(
          isOpen ? value.filter((panel) => panel !== itemValue) : [...value, itemValue],
        )
      }
    >
      <span>{children}</span>
      <ChevronDown size={18} className={cn("transition-transform", isOpen && "rotate-180")} />
    </button>
  );
}

export function AccordionContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { value } = useAccordionContext();
  const { itemValue } = useAccordionItemContext();
  const isOpen = value.includes(itemValue);
  const contentId = `accordion-content-${itemValue}`;

  return (
    <div
      id={contentId}
      className={cn(
        "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className={cn("min-h-0", className)}>{children}</div>
    </div>
  );
}
