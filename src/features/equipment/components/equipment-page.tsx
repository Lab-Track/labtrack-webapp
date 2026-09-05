import { useMemo, useState } from 'react'
import { useDebouncedValue } from '@/lib/use-debounced-value'
import { EquipmentFilters } from './equipment-filters'
import { EquipmentGrid } from './equipment-grid'
import type { StatusEquipamento } from '../types'
import { useEquipmentList } from '../use-equipment'
import { useProjects } from '../use-projects'

export function EquipmentPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusEquipamento | null>(null)
  const [projetoId, setProjetoId] = useState<string | null>(null)
  const debouncedSearch = useDebouncedValue(search, 300)

  const filters = useMemo(
    () => ({ search: debouncedSearch, status, projetoId }),
    [debouncedSearch, status, projetoId]
  )

  const equipmentQuery = useEquipmentList(filters)
  const projectsQuery = useProjects()

  const equipamentos =
    equipmentQuery.data?.pages.flatMap((page) => page.items) ?? []
  const total = equipmentQuery.data?.pages[0]?.total ?? 0

  return (
    <div className="flex flex-1 flex-col">
      <EquipmentFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        projetoId={projetoId}
        onProjetoIdChange={setProjetoId}
        projetos={projectsQuery.data ?? []}
        total={total}
      />

      <EquipmentGrid
        equipamentos={equipamentos}
        isLoading={equipmentQuery.isPending}
        isFetchingNextPage={equipmentQuery.isFetchingNextPage}
        hasNextPage={equipmentQuery.hasNextPage ?? false}
        onLoadMore={equipmentQuery.fetchNextPage}
      />
    </div>
  )
}
