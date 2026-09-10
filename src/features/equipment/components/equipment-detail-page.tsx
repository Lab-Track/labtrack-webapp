import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { EquipmentDetailError } from './equipment-detail-error'
import { EquipmentDetailSummary } from './equipment-detail-summary'
import { EquipmentHistoryList } from './equipment-history-list'
import { useEquipamento, useHistoricoEquipamento } from '../use-equipment-detail'

export function EquipmentDetailPage({ id }: { id: string }) {
  const equipamentoQuery = useEquipamento(id)
  const historicoQuery = useHistoricoEquipamento(id)

  return (
    <div className="flex flex-col gap-4 p-6">
      <Link
        to="/equipment"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para Equipamentos
      </Link>

      {equipamentoQuery.isPending ? (
        <p className="text-sm text-muted-foreground">Carregando equipamento...</p>
      ) : equipamentoQuery.isError ? (
        <EquipmentDetailError message="Equipamento não encontrado." />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
