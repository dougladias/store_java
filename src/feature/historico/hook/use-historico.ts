"use client";

import { useCallback, useEffect, useState } from "react";
import { compraService } from "@/feature/pdv/service/compra-service";
import type { Compra } from "@/feature/pdv/types";

export function useHistorico() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setLoading(true);
    return compraService
      .listar()
      .then(setCompras)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { compras, loading, error, refetch: carregar };
}
