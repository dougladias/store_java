"use client";

import { useCallback, useEffect, useState } from "react";
import { clienteService } from "../service/cliente-service";
import type { Cliente } from "../types";

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setLoading(true);
    return clienteService
      .listar()
      .then(setClientes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { clientes, loading, error, refetch: carregar };
}
