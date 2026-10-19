export type StatusEmprestimo = 'EMPRESTADO' | 'ATRASADO' | 'DEVOLVIDO'

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
