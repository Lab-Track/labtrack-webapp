import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDate, formatDateTime } from '@/lib/utils'
import { LoanStatusBadge } from '@/features/loans/components/loan-status-badge'
import { AlunoNaoEncontradoError } from '../api'
import { useEmprestimosAtivosDoAluno } from '../use-student-loans'

export function StudentLoansPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [matricula, setMatricula] = useState<string | null>(null)
  const query = useEmprestimosAtivosDoAluno(matricula)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const valor = input.trim()
    if (!valor) return
    // Mesma matrícula não muda o estado, então a consulta não rodaria de novo sozinha.
    if (valor === matricula) query.refetch()
    else setMatricula(valor)
  }

  function abrirEquipamento(id: string) {
    navigate({ to: '/equipment/$id', params: { id } })
  }

  const emprestimos = query.data ?? []

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Buscar por matrícula"
            aria-label="Matrícula do aluno"
            className="h-10 rounded-full pl-8"
          />
        </div>
        <Button type="submit" size="lg" className="rounded-full" disabled={!input.trim()}>
          Buscar
        </Button>
      </form>

      <Card className="p-4">
        {matricula === null ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Informe a matrícula para ver os equipamentos emprestados ao aluno.
          </p>
        ) : query.isFetching ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Buscando empréstimos...
          </p>
        ) : query.error instanceof AlunoNaoEncontradoError ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Aluno não encontrado para a matrícula {matricula}.
          </p>
        ) : query.isError ? (
          <p className="px-2 py-6 text-center text-sm text-destructive">
            Não foi possível buscar os empréstimos. Tente novamente.
          </p>
        ) : emprestimos.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Este aluno não tem empréstimos ativos.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 font-semibold">Equipamento</th>
                  <th className="px-2 py-2 font-semibold">Qtd</th>
                  <th className="px-2 py-2 font-semibold">Retirada</th>
                  <th className="px-2 py-2 font-semibold">Previsão de devolução</th>
                  <th className="px-2 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {emprestimos.map((item) => (
                  <tr
                    key={item.id}
                    tabIndex={0}
                    onClick={() => abrirEquipamento(item.equipamentoId)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') abrirEquipamento(item.equipamentoId)
                    }}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-2 py-3 font-semibold text-foreground">
                      {item.equipamentoNome}
                    </td>
                    <td className="px-2 py-3">{item.quantidade}</td>
                    <td className="px-2 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDateTime(item.dataRetirada)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(item.previsaoDevolucao)}
                    </td>
                    <td className="px-2 py-3">
                      <LoanStatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
