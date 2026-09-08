import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Projeto, StatusEquipamento } from '../types'
import { STATUS_FILTER_OPTIONS } from './status-badge'

export interface EquipmentFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: StatusEquipamento | null
  onStatusChange: (value: StatusEquipamento | null) => void
  projetoId: string | null
  onProjetoIdChange: (value: string | null) => void
  projetos: Projeto[]
  total: number
}

export function EquipmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  projetoId,
  onProjetoIdChange,
  projetos,
  total,
}: EquipmentFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-6 py-4">
      <div className="relative min-w-64 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome ou identificador"
          className="h-10 pl-8 rounded-full"
        />
      </div>

      <Button
        type="button"
        variant={status === null ? 'default' : 'outline'}
        size="lg"
        className='rounded-full'
        onClick={() => onStatusChange(null)}
      >
        Todos ({total})
      </Button>
      {STATUS_FILTER_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={status === option.value ? 'default' : 'outline'}
          size="lg"
          className='rounded-full'
          onClick={() => onStatusChange(option.value)}
        >
          {option.label}
        </Button>
      ))}

      <Select
        value={projetoId ?? 'all'}
        onValueChange={(value) =>
          onProjetoIdChange(value === 'all' ? null : value)
        }
      >
        <SelectTrigger className="w-48 rounded-full data-[size=default]:h-10">
          <SelectValue placeholder="Todos os projetos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os projetos</SelectItem>
          {projetos.map((projeto) => (
            <SelectItem key={projeto.id} value={projeto.id}>
              {projeto.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" className="ml-auto h-11 px-5 text-base" size="lg">
        + Cadastrar equipamento
      </Button>
    </div>
  )
}
