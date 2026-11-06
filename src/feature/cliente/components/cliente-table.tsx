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
import { clienteService } from "../service/cliente-service";
import { useClientes } from "../hook/use-clientes";
import type { Cliente } from "../types";
import { ClienteFormDialog } from "./cliente-form-dialog";

const columns: DataTableColumn<Cliente>[] = [
  { key: "nome", header: "Nome", sortable: true },
  { key: "cpf", header: "CPF", sortable: true, align: "center", width: "w-36" },
  { key: "email", header: "E-mail", sortable: true, align: "center", width: "w-56" },
  { key: "telefone", header: "Telefone", align: "center", width: "w-32" },
];

function ClienteAcoes({
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

export function ClienteTable() {
  const { clientes, loading, error, refetch } = useClientes();
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState<Cliente | null>(null);
  const [excluindoCarregando, setExcluindoCarregando] = useState(false);

  function abrirCriar() {
    setEditando(null);
    setFormOpen(true);
  }

  function abrirEditar(cliente: Cliente) {
    setEditando(cliente);
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
      await clienteService.deletar(excluindo.id);
      toast.success("Cliente excluído com sucesso.");
      setExcluindo(null);
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setExcluindoCarregando(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Carregando clientes...</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Erro ao carregar clientes: {error}</p>;
  }

  return (
    <>
      <DataTable
        data={clientes}
        columns={columns}
        getRowId={(cliente) => cliente.id}
        actions={(cliente) => (
          <ClienteAcoes
            onEditar={() => abrirEditar(cliente)}
            onExcluir={() => setExcluindo(cliente)}
          />
        )}
        actionsWidth="w-24"
        searchPlaceholder="Buscar cliente..."
        addLabel="Adicionar Cliente"
        onAdd={abrirCriar}
      />

      <ClienteFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        cliente={editando}
        onSuccess={handleSucesso}
      />

      <ConfirmDialog
        open={excluindo !== null}
        onOpenChange={(open) => !open && setExcluindo(null)}
        title="Excluir cliente"
        description={`Tem certeza que deseja excluir "${excluindo?.nome}"? Essa ação não pode ser desfeita.`}
        loading={excluindoCarregando}
        onConfirm={confirmarExclusao}
      />
    </>
  );
}
