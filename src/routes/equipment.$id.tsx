import { createFileRoute } from '@tanstack/react-router'
import { EquipmentDetailPage } from '@/features/equipment/components/equipment-detail-page'

export const Route = createFileRoute('/equipment/$id')({
  staticData: {
    title: 'Detalhe do equipamento',
  },
  component: EquipmentDetailRoute,
})

function EquipmentDetailRoute() {
  const { id } = Route.useParams()
  return <EquipmentDetailPage id={id} />
}

