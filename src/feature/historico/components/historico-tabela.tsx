"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { FORMAS_PAGAMENTO } from "@/feature/pdv/constants";
import type { Compra } from "@/feature/pdv/types";
import { STATUS_COMPRA_LABEL } from "../constants";
import { useHistorico } from "../hook/use-historico";
import { VendaDetalhesDialog } from "./venda-detalhes-dialog";

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(data: string) {
  return new Date(data).toLocaleString("pt-BR");
}

const columns: DataTableColumn<Compra>[] = [
  { key: "usuarioNome", header: "Cliente", sortable: true },
  {
    key: "dataCriacao",
    header: "Data",
    sortable: true,
    align: "center",
    width: "w-44",
    render: (compra) => formatData(compra.dataCriacao),
  },
  {
    key: "formaPagamento",
    header: "Forma de Pagamento",
    align: "center",
    width: "w-44",
    render: (compra) =>
      FORMAS_PAGAMENTO.find((forma) => forma.value === compra.formaPagamento)?.label ?? "—",
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    width: "w-32",
    render: (compra) => (
      <Badge variant={compra.status === "FINALIZADA" ? "default" : "outline"}>
        {STATUS_COMPRA_LABEL[compra.status]}
      </Badge>
    ),
  },
  {
    key: "valorTotal",
    header: "Total",
    sortable: true,
    align: "center",
    width: "w-32",
    render: (compra) => formatPreco(compra.valorTotal),
  },
];

export function HistoricoTabela() {
  const { compras, loading, error } = useHistorico();
  const [detalhes, setDetalhes] = useState<Compra | null>(null);

  if (loading) {
    return <p className="text-muted-foreground text-sm">Carregando histórico...</p>;
  }

  if (error) {
    return <p className="text-destructive text-sm">Erro ao carregar histórico: {error}</p>;
  }

  return (
    <>
      <DataTable
        data={compras}
        columns={columns}
        getRowId={(compra) => compra.id}
        actions={(compra) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label="Ver itens"
                    onClick={() => setDetalhes(compra)}
                  />
                }
              >
                <Eye />
              </TooltipTrigger>
              <TooltipContent>Ver itens</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        actionsWidth="w-20"
        searchPlaceholder="Buscar por cliente..."
        showAdd={false}
      />

      <VendaDetalhesDialog compra={detalhes} onOpenChange={(open) => !open && setDetalhes(null)} />
    </>
  );
}
