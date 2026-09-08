import { Bell, ChevronDown } from 'lucide-react'
import { useMatches } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function Topbar() {
  const matches = useMatches()
  const { title, subtitle } = matches[matches.length - 1].staticData

  return (
    <header className="flex items-center gap-4 border-b border-border px-6 py-3">
      {title ? (
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
        </div>
      ) : null}
      <div className="ml-auto flex items-center gap-3">
        <Button type="button" variant="outline" size="icon">
          <Bell className="size-4" />
        </Button>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted"
        >
          <Avatar size="sm">
            <AvatarFallback>KO</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">Kênia</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}
