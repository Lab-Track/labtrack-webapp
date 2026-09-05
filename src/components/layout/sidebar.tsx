import { Link } from '@tanstack/react-router'
import {
  ArrowLeftRight,
  Bell,
  Cpu,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  PanelLeftOpen,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { Logo, LogoFull } from './logo'

const SIDEBAR_COLLAPSED_KEY = 'labtrack-sidebar-collapsed'

interface NavItem {
  label: string
  icon: ComponentType<{ className?: string }>
  to?: '/equipment'
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Equipamentos', icon: Cpu, to: '/equipment' },
  { label: 'Empréstimos', icon: ArrowLeftRight },
  { label: 'Alunos', icon: Users },
  { label: 'Histórico', icon: History },
  { label: 'Alertas', icon: Bell, badge: 3 },
  { label: 'Relatórios', icon: FileText },
  { label: 'Configurações', icon: Settings },
]

function NavRow({ item, expanded }: { item: NavItem; expanded: boolean }) {
  const content = (
    <>
      <item.icon className="size-5 shrink-0" />
      {expanded ? (
        <>
          <span className="flex-1 font-medium">{item.label}</span>
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
    'flex items-center gap-3 rounded-lg py-2.5 text-[15px] transition-colors',
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
        'relative flex h-screen shrink-0 flex-col justify-between bg-sidebar px-4 py-5 text-sidebar-foreground transition-[width] duration-400 ',
        expanded ? 'w-72' : 'w-20'
      )}
    >
      {expanded ? (
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute right-3 top-3 shrink-0 cursor-pointer rounded-lg p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
        >
          <PanelLeftOpen 
            className={cn('size-5 transition-transform duration-200', expanded && 'rotate-180' )}
          /> 
        </button>
      ) : null}
      
      <div className="flex flex-col gap-6">
        <div
          className={cn(
            'flex flex-col gap-4',
            expanded ? 'px-2 pt-8' : 'items-center'
          )}
        >
          {expanded ? (
            <div className='flex justify-center px-4 py-4'>
              <LogoFull className="h-18 w-auto" />              
            </div>
          ) : (
            <div className='flex justify-center'>
              <Logo className="h-14 w-auto" />
            </div>
          )}

          {expanded ? (
            <div className="flex items-center gap-2 rounded-full bg-sidebar-accent px-3 py-2 text-sidebar-foreground/50">
              <Search className="size-4 shrink-0" />
              <span className="text-sm">Buscar</span>
            </div>
          ) : null}
        </div>

        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <NavRow key={item.label} item={item} expanded={expanded} />
          ))}
        </nav>
      </div>
      <button type='button' className={cn(
        'flex items-center gap-2 rounded-lg py-2 px-2 transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
        !expanded && 'justify-center px-0'
        )}
        aria-label="Sair"
        title={expanded ? undefined : 'Sair'}
      >
        <LogOut className="size-5 shrink-0" />
        {expanded ? <span className="text-sm">Sair da conta</span> : null}
      </button>
    </aside>
  )
}
