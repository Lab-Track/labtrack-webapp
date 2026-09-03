import { Link } from '@tanstack/react-router'
import {
  ArrowLeftRight,
  Bell,
  Cpu,
  FileText,
  History,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

const SIDEBAR_COLLAPSED_KEY = 'labtrack-sidebar-collapsed'

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

function NavRow({ item, expanded }: { item: NavItem; expanded: boolean }) {
  const content = (
    <>
      <item.icon className="size-4 shrink-0" />
      {expanded ? (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge ? (
            <span className="text-xs text-sidebar-foreground/60">
              · {item.badge}
            </span>
          ) : null}
        </>
      ) : null}
    </>
  )

  const rowClassName = cn(
    'flex items-center gap-2.5 rounded-lg py-2 text-sm transition-colors',
    expanded ? 'px-3' : 'justify-center px-2'
  )

  if (!item.to) {
    return (
      <div
        className={cn(
          rowClassName,
          'cursor-default text-sidebar-foreground/50'
        )}
        title={expanded ? undefined : item.label}
      >
        {content}
      </div>
    )
  }

  return (
    <Link
      to={item.to}
      className={cn(
        rowClassName,
        'cursor-pointer text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
      )}
      activeProps={{
        className: cn(
          rowClassName,
          'cursor-pointer bg-sidebar-primary text-sidebar-primary-foreground'
        ),
      }}
      title={expanded ? undefined : item.label}
    >
      {content}
    </Link>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }, [collapsed])

  const expanded = !collapsed || hovering

  return (
    <aside
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        'flex h-screen shrink-0 flex-col justify-between bg-sidebar px-4 py-5 text-sidebar-foreground transition-[width] duration-200',
        expanded ? 'w-72' : 'w-20'
      )}
    >
      <div className="flex flex-col gap-6">
        <div
          className={cn(
            'flex items-center gap-2',
            expanded ? 'px-2' : 'flex-col'
          )}
        >
          <Logo className={expanded ? 'h-14 w-auto' : 'h-10 w-auto'} />
          {expanded ? (
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                LabTrack
              </span>
              <span className="text-[11px] text-sidebar-foreground/50">
                Rastreio de equipamentos de laboratório
              </span>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="shrink-0 cursor-pointer rounded-lg p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
          >
            {expanded ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {MAIN_NAV.map((item) => (
            <NavRow key={item.label} item={item} expanded={expanded} />
          ))}
        </nav>

        <div className="flex flex-col gap-1">
          {expanded ? (
            <span className="px-3 text-[11px] font-medium tracking-wide text-sidebar-foreground/40">
              SISTEMA
            </span>
          ) : (
            <div className="mx-2 h-px bg-sidebar-border" />
          )}
          {SYSTEM_NAV.map((item) => (
            <NavRow key={item.label} item={item} expanded={expanded} />
          ))}
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-2 py-2',
          !expanded && 'justify-center px-0'
        )}
        title={expanded ? undefined : 'Kênia Oliveira · Técnica de laboratório'}
      >
        <Avatar size="sm">
          <AvatarFallback>KO</AvatarFallback>
        </Avatar>
        {expanded ? (
          <div className="flex flex-col">
            <span className="text-sm text-sidebar-foreground">
              Kênia Oliveira
            </span>
            <span className="text-xs text-sidebar-foreground/50">
              Técnica de laboratório
            </span>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
