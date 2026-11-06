export type FormaPagamento =
  | "PIX"
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO"
  | "BOLETO"
  | "DINHEIRO";

export type StatusCompra = "ABERTA" | "FINALIZADA";

export interface ItemCompra {
  id: number;
  compraId: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Compra {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  formaPagamento: FormaPagamento | null;
  valorTotal: number;
  status: StatusCompra;
  dataCriacao: string;
  dataFinalizacao: string | null;
  itens: ItemCompra[];
}
