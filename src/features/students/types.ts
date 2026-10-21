import type { StatusEmprestimo } from '@/features/loans/types'

// Um equipamento atualmente emprestado ao aluno (unidades do mesmo equipamento no mesmo
// empréstimo são agrupadas em quantidade).
export interface EquipamentoEmprestadoAluno {
  id: string
  equipamentoId: string
  equipamentoNome: string
  quantidade: number
  dataRetirada: string
  previsaoDevolucao: string
  status: StatusEmprestimo
}
