"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormDialog } from "@/components/shared/form-dialog";
import { MaskedInput } from "@/components/shared/masked-input";
import { cepService } from "../service/cep-service";
import { clienteService } from "../service/cliente-service";
import type { Cliente } from "../types";

interface ClienteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente | null;
  onSuccess: () => void;
}

const FORM_VAZIO = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  dataNascimento: "",
  rua: "",
  bairro: "",
  numero: "",
  cep: "",
};

function paraFormulario(cliente?: Cliente | null) {
  if (!cliente) return FORM_VAZIO;

  return {
    nome: cliente.nome,
    cpf: cliente.cpf,
    email: cliente.email,
    telefone: cliente.telefone,
    dataNascimento: cliente.dataNascimento,
    rua: cliente.endereco.rua,
    bairro: cliente.endereco.bairro,
    numero: cliente.endereco.numero,
    cep: cliente.endereco.cep,
  };
}

function normalizarCep(valor: string) {
  return valor.replace(/\D/g, "");
}

export function ClienteFormDialog({
  open,
  onOpenChange,
  cliente,
  onSuccess,
}: ClienteFormDialogProps) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ultimoCepConsultado = useRef<string | null>(null);
  const consultaCepId = useRef(0);

  useEffect(() => {
    if (open) {
      setForm(paraFormulario(cliente));
      setError(null);
      ultimoCepConsultado.current = normalizarCep(cliente?.endereco.cep ?? "");
    }
  }, [open, cliente]);

  function set<K extends keyof typeof FORM_VAZIO>(campo: K, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function alterarCep(valor: string) {
    set("cep", valor);

    const digitos = normalizarCep(valor);

    if (digitos.length === 8) {
      void buscarCep(digitos);
    }
  }

  async function buscarCep(digitos: string) {
    if (digitos.length !== 8 || ultimoCepConsultado.current === digitos) {
      return;
    }

    const consulta = ++consultaCepId.current;

    try {
      const endereco = await cepService.buscar(digitos);

      if (consulta !== consultaCepId.current) {
        return;
      }

      ultimoCepConsultado.current = digitos;
      setForm((atual) =>
        normalizarCep(atual.cep) === digitos
          ? { ...atual, rua: endereco.rua, bairro: endereco.bairro }
          : atual
      );
    } catch (err) {
      if (consulta === consultaCepId.current) {
        toast.error((err as Error).message);
      }
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const payload = {
      nome: form.nome,
      cpf: form.cpf,
      email: form.email,
      telefone: form.telefone,
      dataNascimento: form.dataNascimento,
      endereco: {
        id: cliente?.endereco.id ?? 0,
        usuarioId: cliente?.endereco.usuarioId ?? 0,
        rua: form.rua,
        bairro: form.bairro,
        numero: form.numero,
        cep: form.cep,
      },
    };

    try {
      if (cliente) {
        await clienteService.atualizar(cliente.id, payload);
        toast.success("Cliente atualizado com sucesso.");
      } else {
        await clienteService.criar(payload);
        toast.success("Cliente cadastrado com sucesso.");
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
      title={cliente ? "Editar cliente" : "Adicionar cliente"}
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      <Field className="col-span-2">
        <FieldLabel htmlFor="cliente-nome">Nome</FieldLabel>
        <Input
          id="cliente-nome"
          value={form.nome}
          onChange={(e) => set("nome", e.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cliente-cpf">CPF</FieldLabel>
        <MaskedInput
          id="cliente-cpf"
          mask="000.000.000-00"
          value={form.cpf}
          onAccept={(valor) => set("cpf", valor)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cliente-email">E-mail</FieldLabel>
        <Input
          id="cliente-email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cliente-telefone">Telefone</FieldLabel>
        <MaskedInput
          id="cliente-telefone"
          mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
          value={form.telefone}
          onAccept={(valor) => set("telefone", valor)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cliente-data-nascimento">Data de nascimento</FieldLabel>
        <Input
          id="cliente-data-nascimento"
          type="date"
          value={form.dataNascimento}
          onChange={(e) => set("dataNascimento", e.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cliente-cep">CEP</FieldLabel>
        <MaskedInput
          id="cliente-cep"
          mask="00000-000"
          value={form.cep}
          onAccept={alterarCep}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cliente-rua">Rua</FieldLabel>
        <Input
          id="cliente-rua"
          value={form.rua}
          onChange={(e) => set("rua", e.target.value)}
          required
        />
      </Field>

      <div className="col-span-2 flex gap-4">
        <Field>
          <FieldLabel htmlFor="cliente-bairro">Bairro</FieldLabel>
          <Input
            id="cliente-bairro"
            value={form.bairro}
            onChange={(e) => set("bairro", e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="cliente-numero">Número</FieldLabel>
          <Input
            id="cliente-numero"
            value={form.numero}
            onChange={(e) => set("numero", e.target.value)}
            required
          />
        </Field>
      </div>

      {error && <FieldError className="col-span-2">{error}</FieldError>}
    </FormDialog>
  );
}
