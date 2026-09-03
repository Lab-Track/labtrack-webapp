import { cn } from '@/lib/utils'
import type { StatusEquipamento } from '../types'

const STATUS_CONFIG: Record<
  StatusEquipamento,
  { label: string; dot: string; text: string }
> = {
  DISPONIVEL: {
    label: 'Disponível',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  EMPRESTADO: {
    label: 'Emprestado',
    dot: 'bg-violet-500',
    text: 'text-violet-700 dark:text-violet-400',
  },
  MANUTENCAO: {
    label: 'Manutenção',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
  },
  INATIVO: {
    label: 'Inativo',
    dot: 'bg-neutral-400',
    text: 'text-neutral-600 dark:text-neutral-400',
  },
}

export function StatusBadge({ status }: { status: StatusEquipamento }) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        config.text
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}

export const STATUS_FILTER_OPTIONS: {
  value: StatusEquipamento
  label: string
}[] = [
  { value: 'DISPONIVEL', label: 'Disponíveis' },
  { value: 'EMPRESTADO', label: 'Emprestados' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
  { value: 'INATIVO', label: 'Inativos' },
]
