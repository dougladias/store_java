import type { Compra } from "../types";

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface CarrinhoTotaisProps {
  compra: Compra | null;
}

export function CarrinhoTotais({ compra }: CarrinhoTotaisProps) {
  const totalItens = compra?.itens.reduce((soma, item) => soma + item.quantidade, 0) ?? 0;
  const totalAPagar = compra?.valorTotal ?? 0;

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-mint p-3 text-mint-foreground">
      <div className="flex items-center justify-between text-sm">
        <span>Total de Itens</span>
        <span>{totalItens}</span>
      </div>
      <div className="flex items-center justify-between text-base font-semibold">
        <span>Total a Pagar</span>
        <span>{formatPreco(totalAPagar)}</span>
      </div>
    </div>
  );
}
