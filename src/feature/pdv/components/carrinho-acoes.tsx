"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormDialog } from "@/components/shared/form-dialog";
import { FORMAS_PAGAMENTO } from "../constants";
import type { FormaPagamento } from "../types";

interface CarrinhoAcoesProps {
  carrinhoAberto: boolean;
  loading: boolean;
  onCancelar: () => void;
  onFinalizar: (formaPagamento: FormaPagamento) => Promise<boolean>;
}

export function CarrinhoAcoes({
  carrinhoAberto,
  loading,
  onCancelar,
  onFinalizar,
}: CarrinhoAcoesProps) {
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("PIX");

  async function handleFinalizar() {
    const sucesso = await onFinalizar(formaPagamento);
    if (sucesso) {
      setPagamentoOpen(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"
        className="bg-destructive text-white hover:bg-destructive/90"
        disabled={!carrinhoAberto || loading}
        onClick={onCancelar}
      >
        Cancelar
      </Button>

      <Button
        type="button"
        disabled={!carrinhoAberto || loading}
        onClick={() => setPagamentoOpen(true)}
      >
        Pagamento
      </Button>

      <FormDialog
        open={pagamentoOpen}
        onOpenChange={setPagamentoOpen}
        title="Finalizar venda"
        description="Escolha a forma de pagamento."
        onSubmit={handleFinalizar}
        submitting={loading}
        submitLabel="Confirmar pagamento"
      >
        <Field>
          <FieldLabel htmlFor="forma-pagamento">Forma de pagamento</FieldLabel>
          <Select
            value={formaPagamento}
            onValueChange={(valor) => setFormaPagamento(valor as FormaPagamento)}
          >
            <SelectTrigger id="forma-pagamento" className="w-full">
              <SelectValue>
                {(valor: FormaPagamento) =>
                  FORMAS_PAGAMENTO.find((forma) => forma.value === valor)?.label ?? valor
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FORMAS_PAGAMENTO.map((forma) => (
                <SelectItem key={forma.value} value={forma.value}>
                  {forma.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FormDialog>
    </div>
  );
}
