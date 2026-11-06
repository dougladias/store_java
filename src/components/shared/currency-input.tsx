"use client";

import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  id?: string;
  defaultValue?: number;
  onValueChange: (value: number) => void;
  required?: boolean;
  className?: string;
}

export function CurrencyInput({
  id,
  defaultValue,
  onValueChange,
  required,
  className,
}: CurrencyInputProps) {
  const Component = IMaskInput as React.ComponentType<Record<string, unknown>>;

  return (
    <div
      className={cn(
        "flex h-8 w-full min-w-0 items-center gap-1 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none has-focus:border-ring has-focus:ring-3 has-focus:ring-ring/50 md:text-sm dark:bg-input/30",
        className
      )}
    >
      <span className="text-muted-foreground">R$</span>
      <Component
        id={id}
        mask={Number}
        scale={2}
        radix=","
        thousandsSeparator="."
        padFractionalZeros
        normalizeZeros
        min={0}
        defaultValue={defaultValue ? defaultValue.toFixed(2).replace(".", ",") : undefined}
        unmask="typed"
        onAccept={(valor: number | null) => onValueChange(valor ?? 0)}
        required={required}
        className="w-full min-w-0 bg-transparent outline-none"
      />
    </div>
  );
}
