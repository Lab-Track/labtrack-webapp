import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/equipment/$id')({
  component: EquipmentDetailPlaceholder,
})

function EquipmentDetailPlaceholder() {
  const { id } = Route.useParams()

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground">
        Detalhe do equipamento
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tela em construção (TASK-LAB-063). Equipamento selecionado: {id}
      </p>
    </div>
  )
}
