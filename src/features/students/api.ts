import { getToken } from '@/lib/auth'
import { MOCK_ALUNOS, MOCK_EMPRESTIMOS } from '@/features/loans/mock-data'
import type { EquipamentoEmprestadoAluno } from './types'

const API_URL = import.meta.env.VITE_API_URL
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const MOCK_DELAY_MS = 300

export class AlunoNaoEncontradoError extends Error {
  constructor() {
    super('Aluno não encontrado.')
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildAuthHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface ActiveLoanItemResponse {
  loanItemId: number
  equipmentId: number
  equipmentName: string
  itemStatus: string
}

interface ActiveLoanResponse {
  loanId: number
  checkoutDate: string
  expectedReturnDate: string
  extendedDate: string | null
  loanStatus: string
  items: ActiveLoanItemResponse[]
}

// Um empréstimo parcial (loanStatus 'partial') ainda traz os itens já devolvidos; só os
// itens 'loaned' estão, de fato, com o aluno agora.
function mapEmprestimosAtivos(loans: ActiveLoanResponse[]): EquipamentoEmprestadoAluno[] {
  return loans.flatMap((loan) => {
    const porEquipamento = new Map<number, EquipamentoEmprestadoAluno>()
    for (const item of loan.items.filter((i) => i.itemStatus === 'loaned')) {
      const existente = porEquipamento.get(item.equipmentId)
      if (existente) {
        existente.quantidade += 1
        continue
      }
      porEquipamento.set(item.equipmentId, {
        id: `${loan.loanId}-${item.equipmentId}`,
        equipamentoId: String(item.equipmentId),
        equipamentoNome: item.equipmentName,
        quantidade: 1,
        dataRetirada: loan.checkoutDate,
        // O backend considera o prazo prorrogado, quando houver, no cálculo de atraso.
        previsaoDevolucao: loan.extendedDate ?? loan.expectedReturnDate,
        status: loan.loanStatus === 'late' ? 'ATRASADO' : 'EMPRESTADO',
      })
    }
    return [...porEquipamento.values()]
  })
}

async function fetchEmprestimosAtivosMock(
  matricula: string
): Promise<EquipamentoEmprestadoAluno[]> {
  await delay(MOCK_DELAY_MS)
  if (!MOCK_ALUNOS[matricula]) throw new AlunoNaoEncontradoError()
  return MOCK_EMPRESTIMOS.filter((emprestimo) => emprestimo.aluno.matricula === matricula).map(
    (emprestimo) => ({
      id: emprestimo.id,
      equipamentoId: emprestimo.equipamentoId,
      equipamentoNome: emprestimo.equipamentoNome,
      quantidade: emprestimo.quantidade,
      dataRetirada: emprestimo.dataSaida,
      previsaoDevolucao: emprestimo.previsaoDevolucao,
      status: emprestimo.status,
    })
  )
}

export async function fetchEmprestimosAtivosDoAluno(
  matricula: string
): Promise<EquipamentoEmprestadoAluno[]> {
  if (USE_MOCK) return fetchEmprestimosAtivosMock(matricula)

  const response = await fetch(
    `${API_URL}/api/students/${encodeURIComponent(matricula)}/active-loans`,
    { headers: buildAuthHeaders() }
  )
  if (response.status === 404) throw new AlunoNaoEncontradoError()
  if (!response.ok) {
    throw new Error(`Falha ao buscar empréstimos do aluno: ${response.status}`)
  }
  const loans: ActiveLoanResponse[] = await response.json()
  return mapEmprestimosAtivos(loans)
}
