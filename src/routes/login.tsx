import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, ArrowRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Logo, LogoFull } from '@/components/layout/logo'
import textureDots from '@/assets/login/texture-dots.svg'
import glowEllipse from '@/assets/login/glow-ellipse.svg'

export const Route = createFileRoute('/login')({
  component: Login,
})

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    // MOCK: sem API ainda — só simula um delay e loga os dados
    console.log('login mock:', data)
    await new Promise((r) => setTimeout(r, 800))
    navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo - institucional */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-sidebar p-3xl text-secondary-foreground lg:flex">
        <img
          src={textureDots}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />

        <LogoFull className="relative h-14 w-auto" />

        <div className="relative flex flex-col items-center gap-lg text-center">
          <div className="relative mb-xs flex size-24 items-center justify-center">
            <img
              src={glowEllipse}
              alt=""
              className="pointer-events-none absolute inset-0 size-full"
            />
            <Logo className="relative h-14 w-auto" />
          </div>
          <h1 className="text-h1 font-semibold">
            Controle, localize e{' '}
            <span className="text-primary">rastreie</span> cada equipamento
            do laboratório.
          </h1>
          <p className="max-w-[28rem] text-body text-muted-foreground">
            Empréstimos, devoluções e histórico dos equipamentos do
            laboratório em um só lugar — sincronizado com o app do técnico.
          </p>
        </div>

        <div className="relative flex gap-sm">
          <div className="rounded-md border border-white/10 bg-white/5 px-md py-xs text-body-sm">
            <strong>128</strong> equipamentos
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 px-md py-xs text-body-sm">
            <strong>36</strong> emprestados agora
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 px-md py-xs text-body-sm">
            <strong>3</strong> pendências
          </div>
        </div>
      </div>

      {/* Painel direito - form */}
      <div className="flex flex-1 items-center justify-center bg-muted p-lg">
        <Card className="w-full max-w-[24rem] p-xl">
          <div className="mb-md flex size-10 items-center justify-center rounded-md bg-primary-soft">
            <Logo className="h-6 w-auto" />
          </div>

          <h2 className="text-h2 font-semibold">Entrar</h2>
          <p className="mb-lg text-body-sm text-muted-foreground">
            Acesso restrito a técnicos de laboratório cadastrados.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <Label htmlFor="email" className="text-body-sm text-muted-foreground">
                E-mail institucional
              </Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-placeholder" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@labtrack.edu.br"
                  className="pl-8"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <span className="text-body-sm text-destructive">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-body-sm text-muted-foreground">
                  Senha
                </Label>
                <a href="#" className="text-body-sm text-primary hover:underline">
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-placeholder" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-8"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <span className="text-body-sm text-destructive">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-xs">
              {isSubmitting ? 'Entrando...' : (
                <>
                  Entrar <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-lg flex gap-xs rounded-md border border-dashed border-border bg-muted p-sm text-body-sm text-muted-foreground">
            <Info className="size-4 shrink-0" />
            <span>
              Protótipo de validação — clique em "Entrar" com os dados
              preenchidos para ver o painel web.
            </span>
          </div>

          <p className="mt-lg text-center text-caption text-muted-foreground">
            LabTrack © 2026 · Apenas técnicos autenticados registram
            empréstimos e devoluções
          </p>
        </Card>
      </div>
    </div>
  )
}