"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { compraService } from "../service/compra-service";
import type { Compra, FormaPagamento } from "../types";
import type { Produto } from "@/feature/produto/types";

const STORAGE_KEY = "pdv:compraId";

export function useCarrinho() {
  const [compra, setCompra] = useState<Compra | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Retoma uma venda em aberto salva na sessão (ex.: ao voltar pro PDV ou dar F5)
  useEffect(() => {
    const idSalvo = sessionStorage.getItem(STORAGE_KEY);
    if (!idSalvo) return;

    compraService
      .buscar(Number(idSalvo))
      .then((compraSalva) => {
        if (compraSalva.status === "ABERTA") {
          setCompra(compraSalva);
          setClienteId(compraSalva.usuarioId);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => sessionStorage.removeItem(STORAGE_KEY));
  }, []);

  // Mantém a sessão sincronizada com a venda em aberto
  useEffect(() => {
    if (compra) {
      sessionStorage.setItem(STORAGE_KEY, String(compra.id));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [compra]);

  // Avisa antes de fechar a aba/recarregar com uma venda em aberto
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!compra) return;
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [compra]);

  async function adicionarProduto(produto: Produto) {
    try {
      setLoading(true);

      let compraAtual = compra;

      if (!compraAtual) {
        if (!clienteId) {
          toast.error("Selecione um cliente antes de adicionar produtos.");
          return;
        }
        compraAtual = await compraService.abrir(clienteId);
        setCompra(compraAtual);
      }

      const atualizada = await compraService.adicionarItem(compraAtual.id, produto.id, 1);
      setCompra(atualizada);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function incrementarItem(produtoId: number) {
    if (!compra) return;

    try {
      setLoading(true);
      const atualizada = await compraService.adicionarItem(compra.id, produtoId, 1);
      setCompra(atualizada);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function decrementarItem(produtoId: number) {
    if (!compra) return;

    const item = compra.itens.find((item) => item.produtoId === produtoId);
    if (!item) return;

    if (item.quantidade <= 1) {
      await removerItem(produtoId);
      return;
    }

    try {
      setLoading(true);
      const atualizada = await compraService.definirQuantidade(
        compra.id,
        produtoId,
        item.quantidade - 1
      );
      setCompra(atualizada);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function removerItem(produtoId: number) {
    if (!compra) return;

    try {
      setLoading(true);

      if (compra.itens.length === 1) {
        await compraService.cancelar(compra.id);
        setCompra(null);
        return;
      }

      const atualizada = await compraService.removerItem(compra.id, produtoId);
      setCompra(atualizada);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelar() {
    if (!compra) return;

    try {
      setLoading(true);
      await compraService.cancelar(compra.id);
      setCompra(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function finalizar(formaPagamento: FormaPagamento) {
    if (!compra) return false;

    try {
      setLoading(true);
      await compraService.finalizar(compra.id, formaPagamento);
      toast.success("Venda finalizada com sucesso.");
      setCompra(null);
      return true;
    } catch (err) {
      toast.error((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    compra,
    clienteId,
    loading,
    carrinhoAberto: compra !== null,
    selecionarCliente: setClienteId,
    adicionarProduto,
    incrementarItem,
    decrementarItem,
    removerItem,
    cancelar,
    finalizar,
  };
}
