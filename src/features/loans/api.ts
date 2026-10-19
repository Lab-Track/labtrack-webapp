import { MOCK_EQUIPAMENTOS } from '@/features/equipment/mock-data'
import { MOCK_ALUNOS, MOCK_EMPRESTIMOS, TECNICO_RESPONSAVEL } from './mock-data'
import type { AlunoResumo, Emprestimo } from './types'

const MOCK_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export async function fetchEmprestimos(): Promise<Emprestimo[]> {
  await delay(MOCK_DELAY_MS)
  return MOCK_EMPRESTIMOS
}

export async function buscarAlunoPorMatricula(
  matricula: string
): Promise<AlunoResumo | null> {
  await delay(MOCK_DELAY_MS)
  return MOCK_ALUNOS[matricula] ?? null
}

export interface RegistrarEmprestimoInput {
  equipamentoId: string
  quantidade: number
  aluno: AlunoResumo
  professor: string
}

export async function registrarEmprestimo(
  input: RegistrarEmprestimoInput
): Promise<Emprestimo> {
  await delay(400)
  const equipamento = MOCK_EQUIPAMENTOS.find((item) => item.id === input.equipamentoId)
  if (!equipamento) {
    throw new Error(`Equipamento não encontrado: ${input.equipamentoId}`)
  }

  const agora = new Date()
  const novoEmprestimo: Emprestimo = {
    id: `emp-${Date.now()}`,
    equipamentoId: equipamento.id,
    equipamentoNome: equipamento.nome,
    quantidade: input.quantidade,
    aluno: input.aluno,
    professor: input.professor,
    tecnicoResponsavel: TECNICO_RESPONSAVEL,
    dataSaida: agora.toISOString(),
    previsaoDevolucao: addDays(agora, 7).toISOString(),
    status: 'EMPRESTADO',
  }
  MOCK_EMPRESTIMOS.unshift(novoEmprestimo)
  return novoEmprestimo
}

export interface RegistrarDevolucaoInput {
  id: string
  quantidadeDevolvida: number
  estadoDevolucao: string
  verificacaoFuncionamento: string
  observacoes: string
}

export async function registrarDevolucao(
  input: RegistrarDevolucaoInput
): Promise<void> {
  await delay(400)
  const index = MOCK_EMPRESTIMOS.findIndex((item) => item.id === input.id)
  if (index === -1) {
    throw new Error(`Empréstimo não encontrado: ${input.id}`)
  }

  const emprestimo = MOCK_EMPRESTIMOS[index]
  if (input.quantidadeDevolvida >= emprestimo.quantidade) {
    MOCK_EMPRESTIMOS.splice(index, 1)
  } else {
    MOCK_EMPRESTIMOS[index] = {
      ...emprestimo,
      quantidade: emprestimo.quantidade - input.quantidadeDevolvida,
    }
  }
}
