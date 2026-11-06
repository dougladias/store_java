"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [produtoDialogOpen, setProdutoDialogOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:flex-row">
      <div className="flex h-full w-full shrink-0 flex-col gap-3 md:h-auto md:w-[520px]">
        <ClienteSelect
          value={clienteId}
          onChange={selecionarCliente}
          disabled={carrinhoAberto}
        />

        <Button
          type="button"
          className="gap-1.5 md:hidden"
          onClick={() => setProdutoDialogOpen(true)}
        >
          <Plus />
          Adicionar Produto
        </Button>

        <CarrinhoTabela
          compra={compra}
          onIncrementar={incrementarItem}
          onDecrementar={decrementarItem}
          onRemover={removerItem}
        />

        <div className="flex shrink-0 flex-col gap-3">
          <CarrinhoTotais compra={compra} />

          <CarrinhoAcoes
            carrinhoAberto={carrinhoAberto}
            loading={loading}
            onCancelar={cancelar}
            onFinalizar={finalizar}
          />
        </div>
      </div>

      <div className="hidden flex-1 overflow-hidden md:block">
        <ProdutoGrid onSelecionar={adicionarProduto} className="h-full" />
      </div>

      <Dialog open={produtoDialogOpen} onOpenChange={setProdutoDialogOpen}>
        <DialogContent className="flex flex-col sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar produto</DialogTitle>
          </DialogHeader>
          <ProdutoGrid onSelecionar={adicionarProduto} className="flex-1 overflow-y-auto" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
