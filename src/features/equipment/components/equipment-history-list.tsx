import { ArrowLeftRight, RotateCcw } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { HistoricoEquipamentoItem } from '../types'

const TIPO_CONFIG = {
  EMPRESTIMO: {
    label: 'Empréstimo realizado',
    background: 'bg-[#EDEEFF]',
    Icon: ArrowLeftRight,
  },
  DEVOLUCAO: {
    label: 'Devolução realizada',
    background: 'bg-[#DCFCE7]',
    Icon: RotateCcw,
  },
} as const

export function EquipmentHistoryList({
  historico,
}: {
  historico: HistoricoEquipamentoItem[]
}) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {historico.map((item) => {
        const { label, background, Icon } = TIPO_CONFIG[item.tipo]
        return (
          <div key={item.id} className="flex items-start gap-3 py-3">
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${background}`}
            >
              <Icon className="size-4 text-foreground/70" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                {formatDateTime(item.data)}
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
              <span className="text-sm text-muted-foreground">
                {item.aluno} · {item.quantidade} unidade{item.quantidade === 1 ? '' : 's'}
                {item.professor ? ` · ${item.professor}` : ''}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
