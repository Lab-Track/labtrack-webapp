import { createFileRoute } from '@tanstack/react-router'
import { EquipmentPage } from '@/features/equipment/components/equipment-page'

export const Route = createFileRoute('/equipment/')({
  staticData: {
    title: 'Equipamentos',
    subtitle: 'Consulte, cadastre e altere o status dos equipamentos.',
  },
  component: EquipmentPage,
})
