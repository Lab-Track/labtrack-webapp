import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDateTime } from '@/lib/utils'
import { fetchEquipamentos } from '@/features/equipment/api'
import { STATUS_CONFIG } from '@/features/equipment/components/status-badge'
import type { Equipamento } from '@/features/equipment/types'
import { TECNICO_RESPONSAVEL } from '../mock-data'
import { buscarAlunoPorMatricula } from '../api'
import { useProfessores, useRegistrarEmprestimo } from '../use-loans'

function podeEmprestar(item: Equipamento): boolean {
  return item.status === 'DISPONIVEL' && item.qtdDisponivel > 0
}

function descreverDisponibilidade(item: Equipamento): string {
  if (item.status !== 'DISPONIVEL') {
    return `indisponível (${STATUS_CONFIG[item.status]?.label ?? item.status})`
  }
  if (item.qtdDisponivel <= 0) return 'sem unidades livres'
  return `${item.qtdDisponivel} disponível`
}

const DIAS_PRAZO_PADRAO = 7

// <input type="date"> trabalha com 'YYYY-MM-DD' no fuso local (toISOString usaria UTC).
function paraInputDate(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

function diasAPartirDeHoje(dias: number): string {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  return paraInputDate(data)
}

const novoEmprestimoSchema = z.object({
  equipamentoId: z.string().min(1, 'Selecione um equipamento'),
  quantidade: z.number().min(1, 'Informe ao menos 1 unidade'),
  matricula: z.string().min(1, 'Informe a matrícula'),
  nome: z.string().min(1, 'Informe o nome do aluno'),
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  telefone: z.string().optional(),
  professorId: z.string().min(1, 'Selecione o professor responsável'),
  previsaoDevolucao: z
    .string()
    .min(1, 'Informe o prazo de devolução')
    .refine((valor) => valor >= diasAPartirDeHoje(1), 'O prazo deve ser a partir de amanhã'),
  foto: z.instanceof(File, {
    message: 'A foto do estado do equipamento é obrigatória',
  }),
})

type NovoEmprestimoForm = z.infer<typeof novoEmprestimoSchema>

// Campos ligados a <Select> precisam nascer com um valor definido (string vazia), senão o
// componente começa não controlado e vira controlado só na primeira seleção, quebrando a
// atualização do Radix Select (ver aviso "Select is changing from uncontrolled to controlled").
// É função (e não constante) para o prazo padrão ser calculado a cada abertura do diálogo.
const formDefaultValues = () => ({
  equipamentoId: '',
  quantidade: 1,
  matricula: '',
  nome: '',
  email: '',
  telefone: '',
  professorId: '',
  previsaoDevolucao: diasAPartirDeHoje(DIAS_PRAZO_PADRAO),
})

export function NewLoanDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [alunoEncontrado, setAlunoEncontrado] = useState(false)
  const [buscandoAluno, setBuscandoAluno] = useState(false)
  const mutation = useRegistrarEmprestimo()
  const professoresQuery = useProfessores()

  const equipamentosQuery = useQuery({
    queryKey: ['equipamentos', 'emprestimo'],
    queryFn: () => fetchEquipamentos({ pageSize: 100 }),
    enabled: open,
  })

  // RN01 do backend: só empresta equipamento DISPONIVEL e com unidades livres. Os demais
  // continuam na lista, desabilitados e com o motivo, para o técnico saber por que não dá.
  const equipamentos = useMemo(
    () =>
      [...(equipamentosQuery.data?.items ?? [])].sort(
        (a, b) => Number(podeEmprestar(b)) - Number(podeEmprestar(a))
      ),
    [equipamentosQuery.data]
  )

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NovoEmprestimoForm>({
    resolver: zodResolver(novoEmprestimoSchema),
    defaultValues: formDefaultValues(),
  })

  useEffect(() => {
    if (!open) {
      reset(formDefaultValues())
      setAlunoEncontrado(false)
      setBuscandoAluno(false)
    }
  }, [open, reset])

  const equipamentoId = watch('equipamentoId')
  const equipamentoSelecionado = equipamentos.find(
    (item) => item.id === equipamentoId
  )
  const foto = watch('foto')

  async function handleMatriculaBlur(matricula: string) {
    if (!matricula.trim()) return
    setBuscandoAluno(true)
    try {
      const aluno = await buscarAlunoPorMatricula(matricula.trim())
      if (aluno) {
        setValue('nome', aluno.nome)
        setValue('email', aluno.email)
        setValue('telefone', aluno.telefone)
        setAlunoEncontrado(true)
      } else {
        setAlunoEncontrado(false)
      }
    } catch (error) {
      setAlunoEncontrado(false)
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível buscar o aluno.'
      )
    } finally {
      setBuscandoAluno(false)
    }
  }

  async function onSubmit(data: NovoEmprestimoForm) {
    await mutation.mutateAsync({
      equipamentoId: data.equipamentoId,
      quantidade: data.quantidade,
      aluno: {
        nome: data.nome,
        matricula: data.matricula,
        email: data.email,
        telefone: data.telefone ?? '',
      },
      professorId: data.professorId,
      previsaoDevolucao: data.previsaoDevolucao,
      foto: data.foto,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo empréstimo</DialogTitle>
          <DialogDescription>
            Foto do estado do equipamento e dados do aluno são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold tracking-wide text-muted-foreground">
              EQUIPAMENTO
            </p>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <Label>Equipamento disponível</Label>
                <Controller
                  control={control}
                  name="equipamentoId"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        setValue('quantidade', 1)
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            equipamentosQuery.isPending
                              ? 'Carregando equipamentos...'
                              : 'Selecione um equipamento'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {equipamentos.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id}
                            disabled={!podeEmprestar(item)}
                          >
                            {item.nome} — {descreverDisponibilidade(item)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.equipamentoId && (
                  <span className="text-xs text-destructive">
                    {errors.equipamentoId.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Quantidade</Label>
                <Controller
                  control={control}
                  name="quantidade"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={!equipamentoSelecionado || field.value <= 1}
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
                        disabled={
                          !equipamentoSelecionado ||
                          field.value >= equipamentoSelecionado.qtdDisponivel
                        }
                        onClick={() => field.onChange(field.value + 1)}
                      >
                        +
                      </Button>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-wide text-muted-foreground">
              DADOS DO ALUNO
            </p>

            <div className="flex flex-col gap-1">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                placeholder="2021045123"
                aria-invalid={!!errors.matricula}
                {...register('matricula', {
                  onBlur: (event) => handleMatriculaBlur(event.target.value),
                })}
              />
              {errors.matricula && (
                <span className="text-xs text-destructive">
                  {errors.matricula.message}
                </span>
              )}
            </div>

            {buscandoAluno ? (
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Buscando aluno...
              </div>
            ) : alunoEncontrado ? (
              <div className="rounded-lg bg-[#DCFCE7] px-3 py-2 text-xs text-[#178A4C]">
                Aluno já cadastrado — dados preenchidos automaticamente. Edite
                se estiverem desatualizados.
              </div>
            ) : null}

            <div className="flex flex-col gap-1">
              <Label htmlFor="nome">Nome do aluno</Label>
              <Input
                id="nome"
                placeholder="João Silva"
                aria-invalid={!!errors.nome}
                {...register('nome')}
              />
              {errors.nome && (
                <span className="text-xs text-destructive">
                  {errors.nome.message}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao.silva@aluno.ifma.edu.br"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-xs text-destructive">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(98) 99876-5432"
                  {...register('telefone')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Professor responsável</Label>
              <Controller
                control={control}
                name="professorId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          professoresQuery.isPending
                            ? 'Carregando professores...'
                            : 'Selecione o professor'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {professoresQuery.data?.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id}>
                          {professor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.professorId && (
                <span className="text-xs text-destructive">
                  {errors.professorId.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-wide text-muted-foreground">
              RETIRADA
            </p>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <Label>Técnico responsável</Label>
                <Input value={TECNICO_RESPONSAVEL} disabled />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label>Data/hora da retirada</Label>
                <Input value={formatDateTime(new Date().toISOString())} disabled />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="previsaoDevolucao">Prazo de devolução</Label>
              <Input
                id="previsaoDevolucao"
                type="date"
                min={diasAPartirDeHoje(1)}
                aria-invalid={!!errors.previsaoDevolucao}
                {...register('previsaoDevolucao')}
              />
              {errors.previsaoDevolucao && (
                <span className="text-xs text-destructive">
                  {errors.previsaoDevolucao.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Foto do estado do equipamento na retirada *</Label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/40 px-3 py-2.5 text-sm">
                <Camera className="size-5 shrink-0 text-muted-foreground" />
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              Registrar empréstimo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
