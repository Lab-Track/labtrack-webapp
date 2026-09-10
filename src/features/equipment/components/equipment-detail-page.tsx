import { EquipmentDetailError } from './equipment-detail-error'
import { EquipmentDetailSummary } from './equipment-detail-summary'
import { EquipmentHistoryList } from './equipment-history-list'
import { useEquipamento, useHistoricoEquipamento } from '../use-equipment-detail'

export function EquipmentDetailPage({ id }: { id: string }) {
  const equipamentoQuery = useEquipamento(id)
  const historicoQuery = useHistoricoEquipamento(id)

  if (equipamentoQuery.isPending) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Carregando equipamento...</p>
    )
  }

  if (equipamentoQuery.isError) {
    return <EquipmentDetailError message="Equipamento não encontrado." />
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <EquipmentDetailSummary equipamento={equipamentoQuery.data} />

      <div className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-2 text-sm font-semibold text-foreground">
          Histórico de empréstimos deste equipamento
        </h2>

        {historicoQuery.isPending ? (
          <p className="text-sm text-muted-foreground">Carregando histórico...</p>
        ) : historicoQuery.isError ? (
          <EquipmentDetailError message="Não foi possível carregar o histórico." />
        ) : historicoQuery.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este equipamento ainda não foi emprestado.
          </p>
        ) : (
          <EquipmentHistoryList historico={historicoQuery.data} />
        )}
      </div>
    </div>
  )
}