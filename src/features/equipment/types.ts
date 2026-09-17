export type StatusEquipamento =
  | 'DISPONIVEL'
  | 'EMPRESTADO'
  | 'MANUTENCAO'
  | 'INATIVO'

export interface Projeto {
  id: string
  nome: string
  professorResponsavel: string | null
}

export interface Equipamento {
  id: string
  nome: string
  codigo: string
  fotoUrl: string | null
  status: StatusEquipamento
  categoria: string
  laboratorio: string
  bancada: string | null
  qtdDisponivel: number
  qtdTotal: number
  projeto: Projeto | null
  cadastradoEm: string
}

export type TipoMovimentacaoEquipamento = 'EMPRESTIMO' | 'DEVOLUCAO'

export interface HistoricoEquipamentoItem {
  id: string
  tipo: TipoMovimentacaoEquipamento
  data: string
  aluno: string
  quantidade: number
  professor: string | null
}
