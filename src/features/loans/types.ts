export type StatusEmprestimo = 'EMPRESTADO' | 'ATRASADO' | 'DEVOLVIDO'

export const ESTADOS_EQUIPAMENTO = [
  'Sem avarias',
  'Com avarias leves',
  'Danificado',
] as const

// Só equipamento DISPONIVEL pode ser emprestado (RN01), então a retirada é sempre sem avarias.
export const ESTADO_RETIRADA_PADRAO = ESTADOS_EQUIPAMENTO[0]

export interface Professor {
  id: string
  nome: string
}

export interface AlunoResumo {
  nome: string
  matricula: string
  email: string
  telefone: string
}

export interface Emprestimo {
  id: string
  equipamentoId: string
  equipamentoNome: string
  quantidade: number
  aluno: AlunoResumo
  professor: string
  tecnicoResponsavel: string
  dataSaida: string
  previsaoDevolucao: string
  status: StatusEmprestimo
}
