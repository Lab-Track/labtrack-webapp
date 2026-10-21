import { getToken } from '@/lib/auth'
import { MOCK_EQUIPAMENTOS } from '@/features/equipment/mock-data'
import { MOCK_ALUNOS, MOCK_EMPRESTIMOS, PROFESSORES_MOCK, TECNICO_RESPONSAVEL } from './mock-data'
import type { AlunoResumo, Emprestimo, Professor, StatusEmprestimo } from './types'

const API_URL = import.meta.env.VITE_API_URL
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const MOCK_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function buildAuthHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json()
    return body.message ?? fallback
  } catch {
    return fallback
  }
}

interface LoanSummaryResponse {
  loanId: number
  equipmentName: string | null
  quantity: number
  studentName: string
  studentRegistrationNumber: string | null
  professorName: string
  technicianName: string
  checkoutDate: string
  expectedReturnDate: string
  loanStatus: string
}

function mapLoanStatus(loanStatus: string): StatusEmprestimo {
  return loanStatus === 'late' ? 'ATRASADO' : 'EMPRESTADO'
}

function mapLoanSummary(loan: LoanSummaryResponse): Emprestimo {
  return {
    id: String(loan.loanId),
    equipamentoId: '',
    equipamentoNome: loan.equipmentName ?? '—',
    quantidade: loan.quantity,
    aluno: {
      nome: loan.studentName,
      matricula: loan.studentRegistrationNumber ?? '',
      email: '',
      telefone: '',
    },
    professor: loan.professorName,
    tecnicoResponsavel: loan.technicianName,
    dataSaida: loan.checkoutDate,
    previsaoDevolucao: loan.expectedReturnDate,
    status: mapLoanStatus(loan.loanStatus),
  }
}

async function fetchEmprestimosMock(): Promise<Emprestimo[]> {
  await delay(MOCK_DELAY_MS)
  return MOCK_EMPRESTIMOS
}

export async function fetchEmprestimos(): Promise<Emprestimo[]> {
  if (USE_MOCK) return fetchEmprestimosMock()

  const response = await fetch(`${API_URL}/api/loans`, { headers: buildAuthHeaders() })
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Falha ao buscar empréstimos'))
  }
  const loans: LoanSummaryResponse[] = await response.json()
  return loans.map(mapLoanSummary)
}

async function fetchProfessoresMock(): Promise<Professor[]> {
  await delay(MOCK_DELAY_MS)
  return PROFESSORES_MOCK
}

export async function fetchProfessores(): Promise<Professor[]> {
  if (USE_MOCK) return fetchProfessoresMock()

  const response = await fetch(`${API_URL}/api/professors`, { headers: buildAuthHeaders() })
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Falha ao buscar professores'))
  }
  const professores: { id: number; name: string }[] = await response.json()
  return professores.map((item) => ({ id: String(item.id), nome: item.name }))
}

async function buscarAlunoPorMatriculaMock(matricula: string): Promise<AlunoResumo | null> {
  await delay(MOCK_DELAY_MS)
  return MOCK_ALUNOS[matricula] ?? null
}

export async function buscarAlunoPorMatricula(
  matricula: string
): Promise<AlunoResumo | null> {
  if (USE_MOCK) return buscarAlunoPorMatriculaMock(matricula)

  const response = await fetch(
    `${API_URL}/api/students/${encodeURIComponent(matricula)}`,
    { headers: buildAuthHeaders() }
  )
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Falha ao buscar aluno'))
  }
  const student = await response.json()
  return {
    nome: student.name,
    matricula: student.registrationNumber ?? matricula,
    email: student.email ?? '',
    telefone: student.phone ?? '',
  }
}

export interface RegistrarEmprestimoInput {
  equipamentoId: string
  quantidade: number
  aluno: AlunoResumo
  professorId: string
  estadoRetirada: string
  foto: File
}

async function registrarEmprestimoMock(
  input: RegistrarEmprestimoInput
): Promise<Emprestimo> {
  await delay(400)
  const equipamento = MOCK_EQUIPAMENTOS.find((item) => item.id === input.equipamentoId)
  if (!equipamento) {
    throw new Error(`Equipamento não encontrado: ${input.equipamentoId}`)
  }
  const professor = PROFESSORES_MOCK.find((item) => item.id === input.professorId)

  const agora = new Date()
  const novoEmprestimo: Emprestimo = {
    id: `emp-${Date.now()}`,
    equipamentoId: equipamento.id,
    equipamentoNome: equipamento.nome,
    quantidade: input.quantidade,
    aluno: input.aluno,
    professor: professor?.nome ?? '',
    tecnicoResponsavel: TECNICO_RESPONSAVEL,
    dataSaida: agora.toISOString(),
    previsaoDevolucao: addDays(agora, 7).toISOString(),
    status: 'EMPRESTADO',
  }
  MOCK_EMPRESTIMOS.unshift(novoEmprestimo)
  return novoEmprestimo
}

async function uploadFotoEquipamento(foto: File): Promise<string> {
  const formData = new FormData()
  formData.append('foto', foto)

  const response = await fetch(`${API_URL}/api/equipment/photos`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: formData,
  })
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Falha ao enviar a foto do equipamento'))
  }
  const body: { fotoUrl: string } = await response.json()
  return body.fotoUrl
}

export async function registrarEmprestimo(
  input: RegistrarEmprestimoInput
): Promise<Emprestimo> {
  if (USE_MOCK) return registrarEmprestimoMock(input)

  const fotoUrl = await uploadFotoEquipamento(input.foto)

  const response = await fetch(`${API_URL}/api/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
    body: JSON.stringify({
      alunoMatricula: input.aluno.matricula || undefined,
      alunoNome: input.aluno.nome,
      alunoEmail: input.aluno.email,
      alunoTelefone: input.aluno.telefone || undefined,
      professorId: Number(input.professorId),
      itens: Array.from({ length: input.quantidade }, () => ({
        equipamentoId: Number(input.equipamentoId),
        fotoRetirada: fotoUrl,
        estadoRetirada: input.estadoRetirada,
      })),
    }),
  })
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Falha ao registrar empréstimo'))
  }

  const loan = await response.json()
  return {
    id: String(loan.loanId),
    equipamentoId: input.equipamentoId,
    equipamentoNome: loan.items?.[0]?.equipmentName ?? '—',
    quantidade: loan.items?.length ?? input.quantidade,
    aluno: input.aluno,
    professor: loan.professorName,
    tecnicoResponsavel: TECNICO_RESPONSAVEL,
    dataSaida: loan.checkoutDate,
    previsaoDevolucao: loan.expectedReturnDate,
    status: 'EMPRESTADO',
  }
}

export interface RegistrarDevolucaoInput {
  id: string
  quantidadeDevolvida: number
  estadoDevolucao: string
  verificacaoFuncionamento: string
  observacoes: string
  foto: File
}

export async function registrarDevolucao(input: RegistrarDevolucaoInput): Promise<void> {
  if (USE_MOCK) {
    await delay(400)
    return
  }

  const fotoUrl = await uploadFotoEquipamento(input.foto)

  const response = await fetch(`${API_URL}/api/loans/${input.id}/return`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
    body: JSON.stringify({
      quantidade: input.quantidadeDevolvida,
      estadoDevolucao: input.estadoDevolucao,
      fotoDevolucao: fotoUrl,
      verificacaoFuncionamento: input.verificacaoFuncionamento,
      observacoes: input.observacoes || undefined,
    }),
  })
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Falha ao registrar devolução'))
  }
}
