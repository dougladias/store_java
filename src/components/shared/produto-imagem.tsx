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
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("rounded object-cover", className)} />
  );
}
