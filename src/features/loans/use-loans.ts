import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchEmprestimos, fetchProfessores, registrarDevolucao, registrarEmprestimo } from './api'

export function useEmprestimos() {
  return useQuery({
    queryKey: ['emprestimos'],
    queryFn: fetchEmprestimos,
  })
}

export function useProfessores() {
  return useQuery({
    queryKey: ['professores'],
    queryFn: fetchProfessores,
  })
}

export function useRegistrarEmprestimo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registrarEmprestimo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprestimos'] })
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      queryClient.invalidateQueries({ queryKey: ['alunos'] })
      toast.success('Empréstimo registrado com sucesso.')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Não foi possível registrar o empréstimo.')
    },
  })
}

export function useRegistrarDevolucao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registrarDevolucao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprestimos'] })
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
      queryClient.invalidateQueries({ queryKey: ['alunos'] })
      toast.success('Devolução registrada com sucesso.')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Não foi possível registrar a devolução.')
    },
  })
}
