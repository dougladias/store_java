"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TAMANHO_MAXIMO = 10 * 1024 * 1024;
const TIPOS_PERMITIDOS = ["image/png", "image/jpeg", "image/webp", "image/gif"];

interface ImageInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export function ImageInput({ value, onChange, className }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      toast.error("Use uma imagem PNG, JPEG, WebP ou GIF.");
      return;
    }
    if (file.size > TAMANHO_MAXIMO) {
      toast.error("A imagem deve ter no máximo 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.onerror = () => toast.error("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Imagem do produto" className="size-full object-cover" />
        ) : (
          <ImagePlus className="text-muted-foreground size-6" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          {value ? "Trocar imagem" : "Escolher imagem"}
        </Button>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remover imagem"
            onClick={() => onChange(null)}
          >
            <X />
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
