import { Bell, ChevronDown, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Topbar() {
  return (
    <header className="flex items-center gap-4 border-b border-border px-6 py-3">
      <div className="relative w-80">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          readOnly
          placeholder="Buscar equipamento, aluno, matrícula..."
          className="pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button type="button" variant="outline" size="icon">
          <Bell className="size-4" />
        </Button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted"
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
