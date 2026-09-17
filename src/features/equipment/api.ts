import type { Equipamento, Projeto, StatusEquipamento, HistoricoEquipamentoItem } from './types'
import { MOCK_EQUIPAMENTOS, MOCK_HISTORICO_EQUIPAMENTOS, MOCK_PROJETOS } from './mock-data'

export const DEFAULT_PAGE_SIZE = 4

const API_URL = import.meta.env.VITE_API_URL
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const MOCK_DELAY_MS = 300

export interface EquipamentosPage {
  items: Equipamento[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface FetchEquipamentosParams {
  status?: StatusEquipamento
  search?: string
  projetoId?: string
  page?: number
  pageSize?: number
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getAuthToken(): string | null {
  return null
}

function buildAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function matchesFilters(
  equipamento: Equipamento,
  params: FetchEquipamentosParams
): boolean {
  if (params.status && equipamento.status !== params.status) return false
  if (params.projetoId && equipamento.projeto?.id !== params.projetoId) {
    return false
  }
  if (params.search) {
    const term = params.search.trim().toLowerCase()
    const matchesNome = equipamento.nome.toLowerCase().includes(term)
    const matchesCodigo = equipamento.codigo.toLowerCase().includes(term)
    if (!matchesNome && !matchesCodigo) return false
  }
  return true
}

async function fetchEquipamentosMock(
  params: FetchEquipamentosParams
): Promise<EquipamentosPage> {
  await delay(MOCK_DELAY_MS)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE
  const filtered = MOCK_EQUIPAMENTOS.filter((item) =>
    matchesFilters(item, params)
  )
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  const total = filtered.length

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

async function fetchProjetosMock(): Promise<Projeto[]> {
  await delay(MOCK_DELAY_MS)
  return MOCK_PROJETOS
}

async function fetchEquipamentoMock(id: string): Promise<Equipamento> {
  await delay(MOCK_DELAY_MS)
  const equipamento = MOCK_EQUIPAMENTOS.find((item) => item.id === id)
  if (!equipamento) throw new Error(`Equipamento não encontrado: ${id}`)
  return equipamento
}

async function fetchHistoricoEquipamentoMock(id: string): Promise<HistoricoEquipamentoItem[]> {
  await delay(MOCK_DELAY_MS)
  return MOCK_HISTORICO_EQUIPAMENTOS[id] ?? []
}

export async function fetchEquipamentos(
  params: FetchEquipamentosParams = {}
): Promise<EquipamentosPage> {
  if (USE_MOCK) return fetchEquipamentosMock(params)

  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.search) searchParams.set('search', params.search)
  if (params.projetoId) searchParams.set('projectId', params.projetoId)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? DEFAULT_PAGE_SIZE))

  const response = await fetch(
    `${API_URL}/api/equipment?${searchParams.toString()}`,
    { headers: buildAuthHeaders() }
  )
  if (!response.ok) {
    throw new Error(`Falha ao buscar equipamentos: ${response.status}`)
  }
  return response.json()
}

export async function fetchEquipamento(id: string): Promise<Equipamento> {
  if (USE_MOCK) return fetchEquipamentoMock(id)

  const response = await fetch(`${API_URL}/api/equipment/${id}`, {
    headers: buildAuthHeaders(),
  })
  if (!response.ok) {
    throw new Error(`Falha ao buscar equipamento ${id}: ${response.status}`)
  }
  return response.json()
}

export async function fetchHistoricoEquipamento(
  id: string
): Promise<HistoricoEquipamentoItem[]> {
  if (USE_MOCK) return fetchHistoricoEquipamentoMock(id)

  const response = await fetch(
    `${API_URL}/api/equipment/${id}/history`,
    { headers: buildAuthHeaders() }
  )
  if (!response.ok) {
    throw new Error(`Falha ao buscar histórico: ${response.status}`)
  }
  return response.json()
}

export async function fetchProjetos(): Promise<Projeto[]> {
  if (USE_MOCK) return fetchProjetosMock()

  const response = await fetch(`${API_URL}/api/projects`, {
    headers: buildAuthHeaders(),
  })
  if (!response.ok) {
    throw new Error(`Falha ao buscar projetos: ${response.status}`)
  }
  return response.json()
}

async function updateStatusEquipamentoMock(
  id: string,
  status: StatusEquipamento
): Promise<Equipamento> {
  await delay(MOCK_DELAY_MS)
  const index = MOCK_EQUIPAMENTOS.findIndex((item) => item.id === id)
  if (index === -1) throw new Error(`Equipamento não encontrado: ${id}`)
  const equipamento = { ...MOCK_EQUIPAMENTOS[index], status }
  MOCK_EQUIPAMENTOS[index] = equipamento
  return equipamento
}

async function excluirEquipamentoMock(id: string): Promise<void> {
  await delay(MOCK_DELAY_MS)
  const index = MOCK_EQUIPAMENTOS.findIndex((item) => item.id === id)
  if (index === -1) throw new Error(`Equipamento não encontrado: ${id}`)
  MOCK_EQUIPAMENTOS.splice(index, 1)
}

export async function updateStatusEquipamento(
  id: string,
  status: StatusEquipamento
): Promise<Equipamento> {
  if (USE_MOCK) return updateStatusEquipamentoMock(id, status)

  const response = await fetch(`${API_URL}/api/equipment/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error(`Falha ao atualizar status do equipamento ${id}: ${response.status}`)
  }
  return response.json()
}

export async function excluirEquipamento(id: string): Promise<void> {
  if (USE_MOCK) return excluirEquipamentoMock(id)

  const response = await fetch(`${API_URL}/api/equipment/${id}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(),
  })
  if (!response.ok) {
    throw new Error(`Falha ao excluir equipamento ${id}: ${response.status}`)
  }
}
