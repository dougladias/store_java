"use client";

import { ClienteSelect } from "@/feature/pdv/components/cliente-select";
import { ProdutoGrid } from "@/feature/pdv/components/produto-grid";
import { CarrinhoTabela } from "@/feature/pdv/components/carrinho-tabela";
import { CarrinhoTotais } from "@/feature/pdv/components/carrinho-totais";
import { CarrinhoAcoes } from "@/feature/pdv/components/carrinho-acoes";
import { useCarrinho } from "@/feature/pdv/hook/use-carrinho";

export default function PdvPage() {
  const {
    compra,
    clienteId,
    loading,
    carrinhoAberto,
    selecionarCliente,
    adicionarProduto,
    incrementarItem,
    decrementarItem,
    removerItem,
    cancelar,
    finalizar,
  } = useCarrinho();

  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex w-[520px] shrink-0 flex-col gap-3">
        <ClienteSelect
          value={clienteId}
          onChange={selecionarCliente}
          disabled={carrinhoAberto}
        />

        <CarrinhoTabela
          compra={compra}
          onIncrementar={incrementarItem}
          onDecrementar={decrementarItem}
          onRemover={removerItem}
        />

        <CarrinhoTotais compra={compra} />

        <CarrinhoAcoes
          carrinhoAberto={carrinhoAberto}
          loading={loading}
          onCancelar={cancelar}
          onFinalizar={finalizar}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ProdutoGrid onSelecionar={adicionarProduto} />
      </div>
    </div>
  );
}
