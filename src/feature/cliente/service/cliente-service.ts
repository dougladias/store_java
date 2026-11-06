import { api } from "@/services/api/client";
import { CLIENTE_ENDPOINT } from "../constants";
import type { Cliente, NovoCliente } from "../types";

export const clienteService = {
  listar: () => api.get<Cliente[]>(CLIENTE_ENDPOINT),
  buscar: (id: number) => api.get<Cliente>(`${CLIENTE_ENDPOINT}/${id}`),
  criar: (cliente: NovoCliente) => api.post<Cliente>(CLIENTE_ENDPOINT, cliente),
  atualizar: (id: number, cliente: NovoCliente) =>
    api.put<Cliente>(`${CLIENTE_ENDPOINT}/${id}`, cliente),
  deletar: (id: number) => api.delete(`${CLIENTE_ENDPOINT}/${id}`),
};
