import { createFileRoute } from '@tanstack/react-router'
import { LoansPage } from '@/features/loans/components/loans-page'

export const Route = createFileRoute('/_app/loans/')({
  staticData: {
    title: 'Empréstimos',
    subtitle: 'Registre novos empréstimos e registre devoluções.',
  },
  component: LoansPage,
})
