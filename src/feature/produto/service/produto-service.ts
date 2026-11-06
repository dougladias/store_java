import { api } from "@/services/api/client";
import { PRODUTO_ENDPOINT } from "../constants";
import type { NovoProduto, Produto } from "../types";

export const produtoService = {
  listar: () => api.get<Produto[]>(PRODUTO_ENDPOINT),
  buscar: (id: number) => api.get<Produto>(`${PRODUTO_ENDPOINT}/${id}`),
  criar: (produto: NovoProduto) => api.post<Produto>(PRODUTO_ENDPOINT, produto),
  atualizar: (id: number, produto: NovoProduto) =>
    api.put<Produto>(`${PRODUTO_ENDPOINT}/${id}`, produto),
  deletar: (id: number) => api.delete(`${PRODUTO_ENDPOINT}/${id}`),
};
