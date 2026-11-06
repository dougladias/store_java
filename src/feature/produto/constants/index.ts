import type { UnidadeMedida } from "../types";

export const PRODUTO_ENDPOINT = "/produtos";

export const UNIDADES_MEDIDA: { value: UnidadeMedida; label: string }[] = [
  { value: "UN", label: "Unidade" },
  { value: "KG", label: "Quilograma (kg)" },
  { value: "G", label: "Grama (g)" },
  { value: "L", label: "Litro (L)" },
  { value: "ML", label: "Mililitro (ml)" },
];
