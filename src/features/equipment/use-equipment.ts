import { useInfiniteQuery } from '@tanstack/react-query'
import { DEFAULT_PAGE_SIZE, fetchEquipamentos } from './api'
import type { StatusEquipamento } from './types'

export interface EquipmentFiltersState {
  search: string
  status: StatusEquipamento | null
  projetoId: string | null
}

export function useEquipmentList(filters: EquipmentFiltersState) {
  return useInfiniteQuery({
    queryKey: ['equipamentos', filters],
    queryFn: ({ pageParam }) =>
      fetchEquipamentos({
        page: pageParam,
        pageSize: DEFAULT_PAGE_SIZE,
        search: filters.search || undefined,
        status: filters.status ?? undefined,
        projetoId: filters.projetoId ?? undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })
}
