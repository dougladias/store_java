"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useClientes } from "@/feature/cliente/hook/use-clientes";

interface ClienteSelectProps {
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
}

function formatCpf(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function ClienteSelect({ value, onChange, disabled }: ClienteSelectProps) {
  const { clientes } = useClientes();
  const [open, setOpen] = useState(false);

  const selecionado = clientes.find((cliente) => cliente.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="min-w-0 flex-1 shrink justify-between font-normal"
            />
          }
        >
          {selecionado?.nome ?? "Selecione um cliente"}
          <ChevronsUpDown className="text-muted-foreground" />
        </PopoverTrigger>

        {selecionado && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remover cliente selecionado"
            onClick={() => onChange(null)}
          >
            <X />
          </Button>
        )}
      </div>

      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar por nome ou CPF..." />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={`${cliente.nome} ${cliente.cpf}`}
                  onSelect={() => {
                    onChange(cliente.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      cliente.id === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{cliente.nome}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatCpf(cliente.cpf)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
