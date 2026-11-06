"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FORMAS_PAGAMENTO } from "@/feature/pdv/constants";
import { STATUS_COMPRA_LABEL } from "../constants";
import type { Compra } from "@/feature/pdv/types";

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(data: string) {
  return new Date(data).toLocaleString("pt-BR");
}

interface VendaDetalhesDialogProps {
  compra: Compra | null;
  onOpenChange: (open: boolean) => void;
}

export function VendaDetalhesDialog({ compra, onOpenChange }: VendaDetalhesDialogProps) {
  const formaPagamento = FORMAS_PAGAMENTO.find(
    (forma) => forma.value === compra?.formaPagamento
  )?.label;

  return (
    <Dialog open={compra !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Venda #{compra?.id}</DialogTitle>
          <DialogDescription>
            {compra?.usuarioNome} · {compra ? formatData(compra.dataCriacao) : ""}
          </DialogDescription>
        </DialogHeader>

        {compra && (
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-2">
            <div className="flex items-center justify-between text-sm">
              <Badge variant={compra.status === "FINALIZADA" ? "default" : "outline"}>
                {STATUS_COMPRA_LABEL[compra.status]}
              </Badge>
              {formaPagamento && (
                <span className="text-muted-foreground">{formaPagamento}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:hidden">
              {compra.itens.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b pb-2 text-sm last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.produtoNome}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantidade} x {formatPreco(item.precoUnitario)}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium">{formatPreco(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-center">Preço</TableHead>
                    <TableHead className="text-center">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compra.itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-normal">{item.produtoNome}</TableCell>
                      <TableCell className="text-center">{item.quantidade}</TableCell>
                      <TableCell className="text-center">
                        {formatPreco(item.precoUnitario)}
                      </TableCell>
                      <TableCell className="text-center">{formatPreco(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-2 font-semibold">
              <span>Total</span>
              <span>{formatPreco(compra.valorTotal)}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
