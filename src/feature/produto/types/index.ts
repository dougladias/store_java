export type UnidadeMedida = "UN" | "KG" | "G" | "L" | "ML";

export interface Produto {
  id: number;
  nome: string;
  unidade: UnidadeMedida;
  preco: number;
  quantidade: number;
  imagem: string | null;
}

export type NovoProduto = Omit<Produto, "id">;
