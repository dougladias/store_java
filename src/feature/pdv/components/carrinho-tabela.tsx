"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Compra } from "../types";

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface CarrinhoTabelaProps {
  compra: Compra | null;
  onIncrementar: (produtoId: number) => void;
  onDecrementar: (produtoId: number) => void;
  onRemover: (produtoId: number) => void;
}

export function CarrinhoTabela({
  compra,
  onIncrementar,
  onDecrementar,
  onRemover,
}: CarrinhoTabelaProps) {
  const itens = compra?.itens ?? [];

  return (
    <div className="flex-1 overflow-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead className="text-center">Preço</TableHead>
            <TableHead className="text-center">Qtd</TableHead>
            <TableHead className="text-center">Subtotal</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground text-center">
                Carrinho vazio.
              </TableCell>
            </TableRow>
          ) : (
            itens.map((item) => (
              <TableRow key={item.id} className="bg-cart-row text-cart-row-foreground">
                <TableCell>
                  <span className="rounded bg-warning px-1.5 py-0.5 text-xs font-medium text-warning-foreground">
                    {item.produtoNome}
                  </span>
                </TableCell>
                <TableCell className="text-center">{formatPreco(item.precoUnitario)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Diminuir um"
                      onClick={() => onDecrementar(item.produtoId)}
                    >
                      <Minus />
                    </Button>
                    {item.quantidade}
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Adicionar mais um"
                      onClick={() => onIncrementar(item.produtoId)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">{formatPreco(item.subtotal)}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    size="icon-sm"
                    className="bg-destructive text-white hover:bg-destructive/90"
                    aria-label="Remover"
                    onClick={() => onRemover(item.produtoId)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
