"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormDialog } from "@/components/shared/form-dialog";
import { CurrencyInput } from "@/components/shared/currency-input";
import { ImageInput } from "@/components/shared/image-input";
import { produtoService } from "../service/produto-service";
import { UNIDADES_MEDIDA } from "../constants";
import type { Produto, UnidadeMedida } from "../types";

interface ProdutoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto?: Produto | null;
  onSuccess: () => void;
}

const FORM_VAZIO = {
  nome: "",
  unidade: "UN" as UnidadeMedida,
  preco: 0,
  quantidade: "",
  imagem: null as string | null,
};

function paraFormulario(produto?: Produto | null) {
  if (!produto) return FORM_VAZIO;

  return {
    nome: produto.nome,
    unidade: produto.unidade,
    preco: produto.preco,
    quantidade: String(produto.quantidade),
    imagem: produto.imagem ?? null,
  };
}

export function ProdutoFormDialog({
  open,
  onOpenChange,
  produto,
  onSuccess,
}: ProdutoFormDialogProps) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (open) {
      setForm(paraFormulario(produto));
      setError(null);
      setFormKey((atual) => atual + 1);
    }
  }, [open, produto]);

  function set<K extends keyof typeof FORM_VAZIO>(campo: K, valor: (typeof FORM_VAZIO)[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const payload = {
      nome: form.nome,
      unidade: form.unidade,
      preco: form.preco,
      quantidade: Number(form.quantidade),
      imagem: form.imagem,
    };

    try {
      if (produto) {
        await produtoService.atualizar(produto.id, payload);
        toast.success("Produto atualizado com sucesso.");
      } else {
        await produtoService.criar(payload);
        toast.success("Produto cadastrado com sucesso.");
      }
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={produto ? "Editar produto" : "Adicionar produto"}
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      <Field className="col-span-2">
        <FieldLabel htmlFor="produto-nome">Nome</FieldLabel>
        <Input
          id="produto-nome"
          value={form.nome}
          onChange={(e) => set("nome", e.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="produto-unidade">Unidade de medida</FieldLabel>
        <Select
          value={form.unidade}
          onValueChange={(valor) => set("unidade", valor as UnidadeMedida)}
        >
          <SelectTrigger id="produto-unidade" className="w-full">
            <SelectValue>
              {(valor: UnidadeMedida) =>
                UNIDADES_MEDIDA.find((unidade) => unidade.value === valor)?.label ?? valor
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {UNIDADES_MEDIDA.map((unidade) => (
              <SelectItem key={unidade.value} value={unidade.value}>
                {unidade.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="produto-quantidade">Quantidade</FieldLabel>
        <Input
          id="produto-quantidade"
          type="number"
          step="0.001"
          min="0"
          value={form.quantidade}
          onChange={(e) => set("quantidade", e.target.value)}
          required
        />
      </Field>

      <Field className="col-span-2">
        <FieldLabel htmlFor="produto-preco">Preço</FieldLabel>
        <CurrencyInput
          key={formKey}
          id="produto-preco"
          defaultValue={form.preco}
          onValueChange={(valor) => set("preco", valor)}
          required
        />
      </Field>

      <Field className="col-span-2">
        <FieldLabel>Imagem do produto</FieldLabel>
        <ImageInput value={form.imagem} onChange={(valor) => set("imagem", valor)} />
      </Field>

      {error && <FieldError className="col-span-2">{error}</FieldError>}
    </FormDialog>
  );
}
