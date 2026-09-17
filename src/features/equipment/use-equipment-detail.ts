import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  excluirEquipamento,
  fetchEquipamento,
  fetchHistoricoEquipamento,
  updateStatusEquipamento,
} from './api'
import type { StatusEquipamento } from './types'

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

export function useUpdateStatusEquipamento(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: StatusEquipamento) => updateStatusEquipamento(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      toast.success('Status atualizado com sucesso.')
    },
    onError: () => {
      toast.error('Não foi possível atualizar o status.')
    },
  })
}

export function useExcluirEquipamento(id: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => excluirEquipamento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      toast.success('Equipamento excluído com sucesso.')
      navigate({ to: '/equipment' })
    },
    onError: () => {
      toast.error('Não foi possível excluir o equipamento.')
    },
  })
}