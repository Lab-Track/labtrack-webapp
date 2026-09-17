import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Equipamento, StatusEquipamento } from '../types'
import { STATUS_CONFIG } from './status-badge'
import { useUpdateStatusEquipamento } from '../use-equipment-detail'

const STATUS_OPTIONS = (Object.keys(STATUS_CONFIG) as StatusEquipamento[]).map(
  (value) => ({ value, label: STATUS_CONFIG[value].label })
)

export function EquipmentStatusCard({ equipamento }: { equipamento: Equipamento }) {
  const [status, setStatus] = useState<StatusEquipamento>(equipamento.status)
  const [confirmedStatus, setConfirmedStatus] = useState(equipamento.status)
  const mutation = useUpdateStatusEquipamento(equipamento.id)

  if (equipamento.status !== confirmedStatus) {
    setConfirmedStatus(equipamento.status)
    setStatus(equipamento.status)
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Status do equipamento
      </h2>
      <Select value={status} onValueChange={(value) => setStatus(value as StatusEquipamento)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        className="mt-3 w-full"
        disabled={status === equipamento.status || mutation.isPending}
        onClick={() => mutation.mutate(status)}
      >
        Atualizar status
      </Button>
    </div>
  )
}