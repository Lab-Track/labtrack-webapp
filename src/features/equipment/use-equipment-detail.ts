import { useQuery } from '@tanstack/react-query'
import { fetchEquipamento, fetchHistoricoEquipamento } from './api'

export function useEquipamento(id: string) {
  return useQuery({
    queryKey: ['equipamentos', id],
    queryFn: () => fetchEquipamento(id),
  })
}

export function useHistoricoEquipamento(id: string) {
  return useQuery({
    queryKey: ['equipamentos', id, 'historico'],
    queryFn: () => fetchHistoricoEquipamento(id),
  })
}