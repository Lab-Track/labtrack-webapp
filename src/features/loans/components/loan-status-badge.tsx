import { cn } from '@/lib/utils'
import type { StatusEmprestimo } from '../types'

export const LOAN_STATUS_CONFIG: Record<
  StatusEmprestimo,
  { label: string; dot: string; text: string; background: string }
> = {
  EMPRESTADO: {
    label: 'Emprestado',
    dot: 'bg-[#6C5CE7]',
    text: 'text-[#6C5CE7]',
    background: 'bg-[#EDEEFF]',
  },
  ATRASADO: {
    label: 'Atrasado',
    dot: 'bg-[#D6293E]',
    text: 'text-[#D6293E]',
    background: 'bg-[#FDE2E5]',
  },
  DEVOLVIDO: {
    label: 'Devolvido',
    dot: 'bg-[#178A4C]',
    text: 'text-[#178A4C]',
    background: 'bg-[#DCFCE7]',
  },
}

export function LoanStatusBadge({ status }: { status: StatusEmprestimo }) {
  const config = LOAN_STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        config.background,
        config.text
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
