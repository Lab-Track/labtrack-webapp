import { cn } from '@/lib/utils'
import type { StatusEquipamento } from '../types'

const STATUS_CONFIG: Record<
  StatusEquipamento,
  { label: string; dot: string; text: string }
> = {
  DISPONIVEL: {
    label: 'Disponível',
    dot: 'bg-[#178A4C]',
    text: 'text-[#178A4C]',
  },
  EMPRESTADO: {
    label: 'Emprestado',
    dot: 'bg-[#6C5CE7]',
    text: 'text-[#6C5CE7]',
  },
  MANUTENCAO: {
    label: 'Manutenção',
    dot: 'bg-[#B4740E]',
    text: 'text-[#B4740E]',
  },
  INATIVO: {
    label: 'Inativo',
    dot: 'bg-[#7C87A6]',
    text: 'text-[#7C87A6]',
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
