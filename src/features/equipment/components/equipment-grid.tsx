import { useEffect, useRef } from 'react'
import type { Equipamento } from '../types'
import { EquipmentCard } from './equipment-card'

export interface EquipmentGridProps {
  equipamentos: Equipamento[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onLoadMore: () => void
}

export function EquipmentGrid({
  equipamentos,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: EquipmentGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) onLoadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, onLoadMore])

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        Carregando equipamentos...
      </p>
    )
  }

  if (equipamentos.length === 0) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        Nenhum equipamento encontrado.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {equipamentos.map((equipamento, index) => (
          <EquipmentCard
            key={equipamento.id}
            equipamento={equipamento}
            index={index}
          />
        ))}
      </div>
      {hasNextPage ? (
        <div
          ref={sentinelRef}
          className="flex justify-center py-4 text-sm text-muted-foreground"
        >
          {isFetchingNextPage ? 'Carregando mais...' : ''}
        </div>
      ) : null}
    </div>
  )
}
