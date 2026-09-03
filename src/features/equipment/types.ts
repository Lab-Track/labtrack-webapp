export type StatusEquipamento =
  | 'DISPONIVEL'
  | 'EMPRESTADO'
  | 'MANUTENCAO'
  | 'INATIVO'

export interface Projeto {
  id: string
  nome: string
}

export interface Equipamento {
  id: string
  nome: string
  codigo: string
  status: StatusEquipamento
  laboratorio: string
  bancada: string | null
  qtdDisponivel: number
  qtdTotal: number
  projeto: Projeto | null
}
