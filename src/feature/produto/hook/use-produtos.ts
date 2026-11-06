"use client";

import { useCallback, useEffect, useState } from "react";
import { produtoService } from "../service/produto-service";
import type { Produto } from "../types";

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setLoading(true);
    return produtoService
      .listar()
      .then(setProdutos)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { produtos, loading, error, refetch: carregar };
}
