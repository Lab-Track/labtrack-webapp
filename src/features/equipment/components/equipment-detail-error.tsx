import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function EquipmentDetailError({ message }: { message: string }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button type="button" onClick={() => navigate({ to: '/equipment' })}>
        Voltar
      </Button>
    </div>
  )
}
