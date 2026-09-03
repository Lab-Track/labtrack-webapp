import { useNavigate } from '@tanstack/react-router'
import { Cpu, Gauge, Puzzle, Radar } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Equipamento } from '../types'
import { StatusBadge } from './status-badge'

const CARD_STYLES: { background: string; Icon: ComponentType<{ className?: string }> }[] = [
  { background: 'bg-violet-100 dark:bg-violet-500/10', Icon: Cpu },
  { background: 'bg-emerald-100 dark:bg-emerald-500/10', Icon: Puzzle },
  { background: 'bg-neutral-100 dark:bg-neutral-500/10', Icon: Gauge },
  { background: 'bg-orange-100 dark:bg-orange-500/10', Icon: Radar },
]

export function EquipmentCard({
  equipamento,
  index,
}: {
  equipamento: Equipamento
  index: number
}) {
  const navigate = useNavigate()
  const { background, Icon } = CARD_STYLES[index % CARD_STYLES.length]

  return (
    <button
      type="button"
      onClick={() =>
        navigate({ to: '/equipment/$id', params: { id: equipamento.id } })
      }
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow hover:shadow-md"
    >
      <div className={`flex h-28 items-center justify-center ${background}`}>
        <Icon className="size-8 text-foreground/70" />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="font-medium text-foreground">{equipamento.nome}</span>
        <span className="text-sm text-muted-foreground">
          {equipamento.laboratorio}
          {equipamento.bancada ? ` - ${equipamento.bancada}` : ''}
        </span>
        <div className="mt-1 flex items-center justify-between">
          <StatusBadge status={equipamento.status} />
          <span className="text-xs text-muted-foreground">
            {equipamento.qtdDisponivel}/{equipamento.qtdTotal} disp.
          </span>
        </div>
      </div>
    </button>
  )
}
