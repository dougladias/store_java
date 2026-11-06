"use client";

import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  id?: string;
  defaultValue?: number;
  onValueChange: (value: number) => void;
  scale?: number;
  required?: boolean;
  className?: string;
}

export function NumberInput({
  id,
  defaultValue,
  onValueChange,
  scale = 3,
  required,
  className,
}: NumberInputProps) {
  const Component = IMaskInput as React.ComponentType<Record<string, unknown>>;

  return (
    <Component
      id={id}
      mask={Number}
      scale={scale}
      radix=","
      thousandsSeparator="."
      min={0}
      defaultValue={
        defaultValue
          ? defaultValue.toLocaleString("pt-BR", { maximumFractionDigits: scale })
          : undefined
      }
      unmask="typed"
      onAccept={(valor: number | null) => onValueChange(valor ?? 0)}
      required={required}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30",
        className
      )}
    />
  );
}
