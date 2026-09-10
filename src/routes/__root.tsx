import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'

export const Route = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
      <Toaster />
    </AppShell>
  ),
})
