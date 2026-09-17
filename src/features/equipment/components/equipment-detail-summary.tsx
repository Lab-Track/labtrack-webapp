import { Cpu } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Equipamento } from '../types'
import { StatusBadge } from './status-badge'

export function EquipmentDetailSummary({
  equipamento,
}: {
  equipamento: Equipamento
}) {
  const rows: [string, string][] = [
    ['Patrimônio', equipamento.codigo],
    ['Categoria', equipamento.categoria],
    [
      'Localização',
      equipamento.bancada
        ? `${equipamento.laboratorio} · ${equipamento.bancada}`
        : equipamento.laboratorio,
    ],
    [
      'Disponibilidade',
      `${equipamento.qtdDisponivel} de ${equipamento.qtdTotal} unidade${equipamento.qtdTotal === 1 ? '' : 's'}`,
    ],
    ['Cadastrado em', formatDate(equipamento.cadastradoEm)],
  ]

  if (equipamento.projeto) {
    rows.push(
      ['Projeto', equipamento.projeto.nome],
      ['Professor responsável', equipamento.projeto.professorResponsavel ?? '—']
    )
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-4">
        {equipamento.fotoUrl ? (
          <img
            src={equipamento.fotoUrl}
            alt={equipamento.nome}
            className="size-16 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#EDEEFF]">
            <Cpu className="size-7 text-foreground/70" />
          </div>
        )}
        <div className="flex flex-col items-start gap-1">
          <span className="text-xl font-semibold text-foreground">
            {equipamento.nome}
          </span>
          <span className="text-sm text-muted-foreground">
            {equipamento.codigo} · {equipamento.categoria} ·{' '}
            {equipamento.laboratorio}
            {equipamento.bancada ? ` · ${equipamento.bancada}` : ''}
          </span>
          <StatusBadge status={equipamento.status} />
        </div>
      </div>
      <dl className="mt-4 flex flex-col divide-y divide-border border-t border-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2.5 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
