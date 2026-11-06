"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProdutoImagem } from "@/components/shared/produto-imagem";
import { cn } from "@/lib/utils";
import { useProdutos } from "@/feature/produto/hook/use-produtos";
import type { Produto } from "@/feature/produto/types";

const PAGE_SIZE = 12;

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface ProdutoGridProps {
  onSelecionar: (produto: Produto) => void;
  className?: string;
}

export function ProdutoGrid({ onSelecionar, className }: ProdutoGridProps) {
  const { produtos, loading, error } = useProdutos();
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter((produto) => produto.nome.toLowerCase().includes(termo));
  }, [produtos, busca]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * PAGE_SIZE;
  const visiveis = filtrados.slice(inicio, inicio + PAGE_SIZE);

  if (loading) {
    return <p className="text-muted-foreground text-sm">Carregando produtos...</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Erro ao carregar produtos: {error}</p>;
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Input
        placeholder="Procure o produto pelo nome..."
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPagina(1);
        }}
      />

      <div className="grid flex-1 grid-cols-3 gap-2 content-start sm:gap-3 md:grid-cols-5">
        {visiveis.map((produto) => (
          <Button
            key={produto.id}
            type="button"
            variant="outline"
            className="h-auto flex-col items-center gap-1.5 p-2 whitespace-normal sm:gap-2 sm:p-3"
            onClick={() => onSelecionar(produto)}
          >
            <ProdutoImagem
              src={produto.imagem}
              alt={produto.nome}
              className="size-16 rounded-lg sm:size-20"
            />
            <span className="text-center text-xs leading-tight font-medium sm:text-sm">
              {produto.nome}
            </span>
            <span className="text-muted-foreground text-[11px] sm:text-xs">
              {formatPreco(produto.preco)}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtrados.length} produto{filtrados.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={paginaAtual <= 1}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span>
            {paginaAtual} / {totalPaginas}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={paginaAtual >= totalPaginas}
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
