"use client";

import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface MaskedInputProps {
  mask: string | { mask: string }[];
  value: string;
  onAccept: (value: string) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function MaskedInput({ mask, value, onAccept, className, ...props }: MaskedInputProps) {
  const Component = IMaskInput as React.ComponentType<Record<string, unknown>>;

  return (
    <Component
      mask={mask}
      value={value}
      unmask={false}
      onAccept={(valor: string) => onAccept(valor)}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  );
}
