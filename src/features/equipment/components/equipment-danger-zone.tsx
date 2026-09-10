import { Power, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { Equipamento } from '../types'
import { useExcluirEquipamento, useUpdateStatusEquipamento } from '../use-equipment-detail'

export function EquipmentDangerZone({ equipamento }: { equipamento: Equipamento }) {
  const updateStatus = useUpdateStatusEquipamento(equipamento.id)
  const excluir = useExcluirEquipamento(equipamento.id)
  const blocked = equipamento.status === 'EMPRESTADO'

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h2 className="mb-1 text-sm font-semibold text-foreground">Zona de risco</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Equipamentos com empréstimos ativos não podem ser inativados ou excluídos.
      </p>

      <Button
        type="button"
        variant="outline"
        className="w-full justify-start border-[#B4740E]/30 text-[#B4740E] hover:bg-[#FEF3C7]"
        disabled={blocked || updateStatus.isPending}
        onClick={() => updateStatus.mutate('INATIVO')}
      >
        <Power className="size-4" />
        Inativar equipamento
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            className="mt-2 w-full justify-start"
            disabled={blocked || excluir.isPending}
          >
            <Trash2 className="size-4" />
            Excluir equipamento
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir equipamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O equipamento "{equipamento.nome}" será
              removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => excluir.mutate()}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}