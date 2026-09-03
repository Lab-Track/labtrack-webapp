import { createFileRoute } from '@tanstack/react-router'
import { EquipmentPage } from '@/features/equipment/components/equipment-page'

export const Route = createFileRoute('/equipment/')({
  component: EquipmentPage,
})
