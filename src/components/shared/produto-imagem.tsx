import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProdutoImagemProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function ProdutoImagem({ src, alt, className }: ProdutoImagemProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded bg-muted text-muted-foreground",
          className
        )}
      >
        <Package className="size-5" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded", className)}>
      <Image src={src} alt={alt} fill unoptimized className="object-cover" />
    </div>
  );
}
