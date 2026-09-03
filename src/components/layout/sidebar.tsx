import { Link } from '@tanstack/react-router'
import {
  ArrowLeftRight,
  Bell,
  Cpu,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

interface NavItem {
  label: string
  icon: ComponentType<{ className?: string }>
  to?: '/equipment'
  badge?: number
}

const MAIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Equipamentos', icon: Cpu, to: '/equipment' },
  { label: 'Empréstimos', icon: ArrowLeftRight },
  { label: 'Alunos', icon: Users },
  { label: 'Histórico', icon: History },
  { label: 'Alertas', icon: Bell, badge: 3 },
]

const SYSTEM_NAV: NavItem[] = [
  { label: 'Relatórios', icon: FileText },
  { label: 'Configurações', icon: Settings },
]

function NavRow({ item }: { item: NavItem }) {
  const content = (
    <>
      <item.icon className="size-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className="text-xs text-sidebar-foreground/60">
          · {item.badge}
        </span>
      ) : null}
    </>
  )

  if (!item.to) {
    return (
      <div className="flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50">
        {content}
      </div>
    )
  }

  return (
    <Link
      to={item.to}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      activeProps={{
        className: cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
          'bg-sidebar-primary text-sidebar-primary-foreground'
        ),
      }}
    >
      {content}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between bg-sidebar px-4 py-5 text-sidebar-foreground">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 px-2">
          <Logo className="h-10 w-auto" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              LabTrack
            </span>
            <span className="text-[11px] text-sidebar-foreground/50">
              Rastreio de equipamentos de laboratório
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {MAIN_NAV.map((item) => (
            <NavRow key={item.label} item={item} />
          ))}
        </nav>

        <div className="flex flex-col gap-1">
          <span className="px-3 text-[11px] font-medium tracking-wide text-sidebar-foreground/40">
            SISTEMA
          </span>
          {SYSTEM_NAV.map((item) => (
            <NavRow key={item.label} item={item} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg px-2 py-2">
        <Avatar size="sm">
          <AvatarFallback>KO</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm text-sidebar-foreground">
            Kênia Oliveira
          </span>
          <span className="text-xs text-sidebar-foreground/50">
            Técnica de laboratório
          </span>
        </div>
      </div>
    </aside>
  )
}
