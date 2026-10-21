import { useQuery } from '@tanstack/react-query'
import { AlunoNaoEncontradoError, fetchEmprestimosAtivosDoAluno } from './api'

export function useEmprestimosAtivosDoAluno(matricula: string | null) {
  return useQuery({
    queryKey: ['alunos', matricula, 'emprestimos-ativos'],
    queryFn: () => fetchEmprestimosAtivosDoAluno(matricula!),
    enabled: matricula !== null,
    // Matrícula inexistente é resposta definitiva, não vale repetir.
    retry: (failureCount, error) =>
      !(error instanceof AlunoNaoEncontradoError) && failureCount < 2,
  })
}
