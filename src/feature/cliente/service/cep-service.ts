import { api } from "@/services/api/client";
import { CEP_ENDPOINT } from "../constants";
import type { EnderecoCep } from "../types";

export const cepService = {
  buscar: (cep: string) => api.get<EnderecoCep>(`${CEP_ENDPOINT}/${cep}`),
};
