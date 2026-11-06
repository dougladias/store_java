"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProdutoImagem } from "@/components/shared/produto-imagem";
import { produtoService } from "../service/produto-service";
import { useProdutos } from "../hook/use-produtos";
import type { Produto } from "../types";
import { ProdutoFormDialog } from "./produto-form-dialog";

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatQuantidade(produto: Produto) {
  return `${produto.quantidade.toLocaleString("pt-BR", { maximumFractionDigits: 3 })} ${produto.unidade}`;
}

const columns: DataTableColumn<Produto>[] = [
  {
    key: "nome",
    header: "Nome",
    sortable: true,
    render: (produto) => (
      <div className="flex items-center gap-2">
        <ProdutoImagem
          src={produto.imagem}
          alt={produto.nome}
          className="size-9 shrink-0 rounded-md"
        />
        <span>{produto.nome}</span>
      </div>
    ),
  },
  {
    key: "preco",
    header: "Preço",
    sortable: true,
    align: "center",
    width: "w-32",
    render: (produto) => formatPreco(produto.preco),
  },
  {
    key: "quantidade",
    header: "Quantidade",
    sortable: true,
    align: "center",
    width: "w-32",
    render: (produto) => formatQuantidade(produto),
  },
];

function ProdutoAcoes({
  onEditar,
  onExcluir,
}: {
  onEditar: () => void;
  onExcluir: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-sm"
              className="bg-warning text-warning-foreground hover:bg-warning/90"
              aria-label="Editar"
              onClick={onEditar}
            />
          }
        >
          <Pencil />
        </TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-sm"
              className="bg-destructive text-white hover:bg-destructive/90"
              aria-label="Excluir"
              onClick={onExcluir}
            />
          }
        >
          <Trash2 />
        </TooltipTrigger>
        <TooltipContent>Excluir</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ProdutoTable() {
  const { produtos, loading, error, refetch } = useProdutos();
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState<Produto | null>(null);
  const [excluindoCarregando, setExcluindoCarregando] = useState(false);

  function abrirCriar() {
    setEditando(null);
    setFormOpen(true);
  }

  function abrirEditar(produto: Produto) {
    setEditando(produto);
    setFormOpen(true);
  }

  function handleSucesso() {
    setFormOpen(false);
    refetch();
  }

  async function confirmarExclusao() {
    if (!excluindo) return;

    setExcluindoCarregando(true);
    try {
      await produtoService.deletar(excluindo.id);
      toast.success("Produto excluído com sucesso.");
      setExcluindo(null);
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setExcluindoCarregando(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Carregando produtos...</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Erro ao carregar produtos: {error}</p>;
  }

  return (
    <>
      <DataTable
        data={produtos}
        columns={columns}
        getRowId={(produto) => produto.id}
        actions={(produto) => (
          <ProdutoAcoes
            onEditar={() => abrirEditar(produto)}
            onExcluir={() => setExcluindo(produto)}
          />
        )}
        actionsWidth="w-24"
        searchPlaceholder="Buscar produto..."
        addLabel="Adicionar Produto"
        onAdd={abrirCriar}
      />

      <ProdutoFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        produto={editando}
        onSuccess={handleSucesso}
      />

      <ConfirmDialog
        open={excluindo !== null}
        onOpenChange={(open) => !open && setExcluindo(null)}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir "${excluindo?.nome}"? Essa ação não pode ser desfeita.`}
        loading={excluindoCarregando}
        onConfirm={confirmarExclusao}
      />
    </>
  );
}
