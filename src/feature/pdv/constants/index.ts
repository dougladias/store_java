import type { FormaPagamento } from "../types";

export const COMPRA_ENDPOINT = "/compras";

export const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: "PIX", label: "PIX" },
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito" },
  { value: "BOLETO", label: "Boleto" },
  { value: "DINHEIRO", label: "Dinheiro" },
];
