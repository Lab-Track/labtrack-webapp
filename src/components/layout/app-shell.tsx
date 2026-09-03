import type { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Topbar />
        {children}
      </div>
    </div>
  )
}
