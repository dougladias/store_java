import { api } from "@/services/api/client";
import { COMPRA_ENDPOINT } from "../constants";
import type { Compra, FormaPagamento } from "../types";

export const compraService = {
  listar: () => api.get<Compra[]>(COMPRA_ENDPOINT),
  abrir: (usuarioId: number) => api.post<Compra>(COMPRA_ENDPOINT, { usuarioId }),
  buscar: (id: number) => api.get<Compra>(`${COMPRA_ENDPOINT}/${id}`),
  adicionarItem: (compraId: number, produtoId: number, quantidade: number) =>
    api.post<Compra>(`${COMPRA_ENDPOINT}/${compraId}/itens`, { produtoId, quantidade }),
  definirQuantidade: (compraId: number, produtoId: number, quantidade: number) =>
    api.put<Compra>(`${COMPRA_ENDPOINT}/${compraId}/itens/${produtoId}`, { quantidade }),
  removerItem: (compraId: number, produtoId: number) =>
    api.delete<Compra>(`${COMPRA_ENDPOINT}/${compraId}/itens/${produtoId}`),
  cancelar: (compraId: number) => api.delete<void>(`${COMPRA_ENDPOINT}/${compraId}`),
  finalizar: (compraId: number, formaPagamento: FormaPagamento) =>
    api.post<Compra>(`${COMPRA_ENDPOINT}/${compraId}/finalizar`, { formaPagamento }),
};
