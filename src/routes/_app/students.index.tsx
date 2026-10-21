import { createFileRoute } from '@tanstack/react-router'
import { StudentLoansPage } from '@/features/students/components/student-loans-page'

export const Route = createFileRoute('/_app/students/')({
  staticData: {
    title: 'Alunos',
    subtitle: 'Consulte os equipamentos emprestados a um aluno pela matrícula.',
  },
  component: StudentLoansPage,
})
