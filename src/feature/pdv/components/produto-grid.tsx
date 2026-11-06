"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProdutoImagem } from "@/components/shared/produto-imagem";
import { useProdutos } from "@/feature/produto/hook/use-produtos";
import type { Produto } from "@/feature/produto/types";

const PAGE_SIZE = 12;

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface ProdutoGridProps {
  onSelecionar: (produto: Produto) => void;
}

export function ProdutoGrid({ onSelecionar }: ProdutoGridProps) {
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
    <div className="flex h-full flex-col gap-3">
      <Input
        placeholder="Procure o produto pelo nome..."
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPagina(1);
        }}
      />

      <div className="grid flex-1 grid-cols-4 gap-3 content-start">
        {visiveis.map((produto) => (
          <Button
            key={produto.id}
            type="button"
            variant="outline"
            className="h-auto flex-col items-center gap-2 p-3 whitespace-normal"
            onClick={() => onSelecionar(produto)}
          >
            <ProdutoImagem
              src={produto.imagem}
              alt={produto.nome}
              className="size-14 rounded-lg"
            />
            <span className="text-center text-sm leading-tight font-medium">
              {produto.nome}
            </span>
            <span className="text-muted-foreground text-xs">{formatPreco(produto.preco)}</span>
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
