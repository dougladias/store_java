export interface Endereco {
  id: number;
  usuarioId: number;
  rua: string;
  bairro: string;
  numero: string;
  cep: string;
}

export interface EnderecoCep {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: Endereco;
}

export type NovoCliente = Omit<Cliente, "id">;
