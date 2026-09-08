import { useQuery } from '@tanstack/react-query'
import { fetchProjetos } from './api'

export function useProjects() {
  return useQuery({
    queryKey: ['projetos'],
    queryFn: fetchProjetos,
  })
}
