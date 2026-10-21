import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRegistrarDevolucao } from '../use-loans'
import { ESTADOS_EQUIPAMENTO, type Emprestimo } from '../types'

const VERIFICACOES_FUNCIONAMENTO = [
  'Funcionando normalmente',
  'Funcionamento parcial',
  'Não funciona',
] as const

const devolucaoSchema = z.object({
  quantidadeDevolvida: z.number().min(1),
  estadoDevolucao: z.string().min(1, 'Selecione o estado de devolução'),
  verificacaoFuncionamento: z
    .string()
    .min(1, 'Selecione a verificação de funcionamento'),
  observacoes: z.string().optional(),
  foto: z.instanceof(File, {
    message: 'A foto do estado na devolução é obrigatória',
  }),
})

type DevolucaoForm = z.infer<typeof devolucaoSchema>

export function ReturnLoanDialog({
  emprestimo,
  onOpenChange,
}: {
  emprestimo: Emprestimo | null
  onOpenChange: (open: boolean) => void
}) {
  const mutation = useRegistrarDevolucao()

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DevolucaoForm>({
    resolver: zodResolver(devolucaoSchema),
    defaultValues: {
      estadoDevolucao: '',
      verificacaoFuncionamento: '',
      observacoes: '',
    },
  })

  useEffect(() => {
    if (emprestimo) {
      // Campos ligados a <Select> precisam nascer com um valor definido (string vazia), senão
      // o componente começa não controlado e vira controlado só na primeira seleção, quebrando
      // a atualização do Radix Select (ver aviso "Select is changing from uncontrolled to
      // controlled").
      reset({
        quantidadeDevolvida: emprestimo.quantidade,
        estadoDevolucao: '',
        verificacaoFuncionamento: '',
        observacoes: '',
      })
    }
  }, [emprestimo, reset])

  const foto = watch('foto')

  if (!emprestimo) return null

  const atrasado = emprestimo.status === 'ATRASADO'

  async function onSubmit(data: DevolucaoForm) {
    await mutation.mutateAsync({
      id: emprestimo!.id,
      quantidadeDevolvida: data.quantidadeDevolvida,
      estadoDevolucao: data.estadoDevolucao,
      verificacaoFuncionamento: data.verificacaoFuncionamento,
      observacoes: data.observacoes ?? '',
      foto: data.foto,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar devolução</DialogTitle>
          <DialogDescription>
            {emprestimo.equipamentoNome} · {emprestimo.aluno.nome} — quantidade
            emprestada: {emprestimo.quantidade}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {atrasado ? (
            <div className="flex items-start gap-2 rounded-lg bg-[#FEF3C7] px-3 py-2.5 text-xs text-[#B4740E]">
              <AlertTriangle className="size-4 shrink-0" />
              Devolução em atraso. Uma marca de atraso será adicionada ao
              perfil de {emprestimo.aluno.nome}.
            </div>
          ) : null}

          <div className="flex gap-3">
            <div className="flex flex-col gap-1">
              <Label>Quantidade devolvida</Label>
              <Controller
                control={control}
                name="quantidadeDevolvida"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={field.value <= 1}
                      onClick={() => field.onChange(field.value - 1)}
                    >
                      −
                    </Button>
                    <span className="flex h-8 w-10 items-center justify-center rounded-lg border border-input text-sm font-semibold">
                      {field.value}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={field.value >= emprestimo.quantidade}
                      onClick={() => field.onChange(field.value + 1)}
                    >
                      +
                    </Button>
                  </div>
                )}
              />
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <Label>Estado de devolução</Label>
              <Controller
                control={control}
                name="estadoDevolucao"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_EQUIPAMENTO.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.estadoDevolucao && (
                <span className="text-xs text-destructive">
                  {errors.estadoDevolucao.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Verificação de funcionamento</Label>
            <Controller
              control={control}
              name="verificacaoFuncionamento"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {VERIFICACOES_FUNCIONAMENTO.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.verificacaoFuncionamento && (
              <span className="text-xs text-destructive">
                {errors.verificacaoFuncionamento.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="observacoes">Observações sobre o equipamento</Label>
            <Textarea
              id="observacoes"
              placeholder="Descreva avarias, funcionamento ou outras observações"
              {...register('observacoes')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Foto do estado na devolução *</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/40 px-3 py-2.5 text-sm">
              <ImageIcon className="size-5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">
                {foto
                  ? `${foto.name} · ${(foto.size / 1024).toFixed(0)} KB`
                  : 'Clique para anexar uma foto'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setValue('foto', event.target.files?.[0] as File, {
                    shouldValidate: true,
                  })
                }
              />
            </label>
            {errors.foto && (
              <span className="text-xs text-destructive">
                {errors.foto.message}
              </span>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              Registrar devolução
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
