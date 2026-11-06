"use client";

import { useRef } from "react";
import Image from "next/image";
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
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "h-32 w-full flex-col gap-1.5 overflow-hidden rounded-lg border-2 border-dashed border-input p-0 text-muted-foreground",
          value ? "border-solid bg-muted/30 hover:bg-muted/30" : "hover:bg-transparent"
        )}
      >
        {value ? (
          <div className="relative size-full p-2">
            <Image src={value} alt="Imagem do produto" fill unoptimized className="object-contain" />
          </div>
        ) : (
          <>
            <ImagePlus className="size-6" />
            <span className="text-sm">Escolher imagem</span>
          </>
        )}
      </Button>

      {value && (
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Remover imagem"
          className="absolute top-1.5 right-1.5"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
        >
          <X />
        </Button>
      )}

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
