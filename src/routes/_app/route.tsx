import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/app-shell'
import { isAuthenticated } from '@/lib/auth'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})