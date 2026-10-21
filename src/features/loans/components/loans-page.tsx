import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { formatDate, formatDateTime } from '@/lib/utils'
import { useDebouncedValue } from '@/lib/use-debounced-value'
import { useEmprestimos } from '../use-loans'
import type { Emprestimo, StatusEmprestimo } from '../types'
import { LoanStatusBadge } from './loan-status-badge'
import { NewLoanDialog } from './new-loan-dialog'
import { ReturnLoanDialog } from './return-loan-dialog'

const STATUS_TABS: { value: StatusEmprestimo; label: string }[] = [
  { value: 'EMPRESTADO', label: 'Emprestado' },
  { value: 'ATRASADO', label: 'Atrasado' },
]

export function LoansPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusEmprestimo | null>(null)
  const [newLoanOpen, setNewLoanOpen] = useState(false)
  const [returnTarget, setReturnTarget] = useState<Emprestimo | null>(null)
  const debouncedSearch = useDebouncedValue(search, 300)

  const emprestimosQuery = useEmprestimos()
  const emprestimosData = emprestimosQuery.data

  const filtrados = useMemo(() => {
    const emprestimos = emprestimosData ?? []
    const term = debouncedSearch.trim().toLowerCase()
    return emprestimos.filter((emprestimo) => {
      if (status && emprestimo.status !== status) return false
      if (!term) return true
      return (
        emprestimo.equipamentoNome.toLowerCase().includes(term) ||
        emprestimo.aluno.nome.toLowerCase().includes(term) ||
        emprestimo.aluno.matricula.includes(term)
      )
    })
  }, [emprestimosData, status, debouncedSearch])

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou identificador"
            className="h-10 rounded-full pl-8"
          />
        </div>

        <Button
          type="button"
          variant={status === null ? 'default' : 'outline'}
          size="lg"
          className="rounded-full"
          onClick={() => setStatus(null)}
        >
          Todos ({emprestimosData?.length ?? 0})
        </Button>
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            variant={status === tab.value ? 'default' : 'outline'}
            size="lg"
            className="rounded-full"
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </Button>
        ))}

        <Button
          type="button"
          className="ml-auto h-11 px-5 text-base"
          size="lg"
          onClick={() => setNewLoanOpen(true)}
        >
          <Plus className="size-4" />
          Novo empréstimo
        </Button>
      </div>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-foreground">
            Empréstimos em andamento
          </h2>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {emprestimosData?.length ?? 0} em andamento
          </span>
        </div>

        {emprestimosQuery.isPending ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Carregando empréstimos...
          </p>
        ) : filtrados.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Nenhum empréstimo encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 font-semibold">Equipamento</th>
                  <th className="px-2 py-2 font-semibold">Qtd</th>
                  <th className="px-2 py-2 font-semibold">Aluno</th>
                  <th className="px-2 py-2 font-semibold">Professor</th>
                  <th className="px-2 py-2 font-semibold">Saída</th>
                  <th className="px-2 py-2 font-semibold">Previsão</th>
                  <th className="px-2 py-2 font-semibold">Status</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map((emprestimo) => (
                  <tr key={emprestimo.id} className="border-b border-border last:border-0">
                    <td className="px-2 py-3 font-semibold text-foreground">
                      {emprestimo.equipamentoNome}
                    </td>
                    <td className="px-2 py-3">{emprestimo.quantidade}</td>
                    <td className="px-2 py-3">
                      <div className="flex flex-col">
                        <span className="text-foreground">{emprestimo.aluno.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          {emprestimo.aluno.matricula}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {emprestimo.professor}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDateTime(emprestimo.dataSaida)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(emprestimo.previsaoDevolucao)}
                    </td>
                    <td className="px-2 py-3">
                      <LoanStatusBadge status={emprestimo.status} />
                    </td>
                    <td className="px-2 py-3 text-right">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setReturnTarget(emprestimo)}
                      >
                        Devolver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <NewLoanDialog open={newLoanOpen} onOpenChange={setNewLoanOpen} />
      <ReturnLoanDialog
        emprestimo={returnTarget}
        onOpenChange={(open) => {
          if (!open) setReturnTarget(null)
        }}
      />
    </div>
  )
}
