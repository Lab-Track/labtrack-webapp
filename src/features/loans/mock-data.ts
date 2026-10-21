import type { AlunoResumo, Emprestimo, Professor } from './types'

export const TECNICO_RESPONSAVEL = 'Kênia Oliveira'

export const PROFESSORES_MOCK: Professor[] = [
  { id: '1', nome: 'Prof. Marcos Andrade' },
  { id: '2', nome: 'Profa. Camila Rocha' },
  { id: '3', nome: 'Prof. Simone' },
  { id: '4', nome: 'Prof.ª Daniel' },
]

export const MOCK_ALUNOS: Record<string, AlunoResumo> = {
  '2021045123': {
    nome: 'João Silva',
    matricula: '2021045123',
    email: 'joao.silva@aluno.ifma.edu.br',
    telefone: '(98) 99876-5432',
  },
  '2020011987': {
    nome: 'Pedro Costa',
    matricula: '2020011987',
    email: 'pedro.costa@aluno.ifma.edu.br',
    telefone: '(98) 99123-4567',
  },
  '2022078841': {
    nome: 'Maria Lima',
    matricula: '2022078841',
    email: 'maria.lima@aluno.ifma.edu.br',
    telefone: '(98) 99888-2211',
  },
}

export const MOCK_EMPRESTIMOS: Emprestimo[] = [
  {
    id: 'emp-1',
    equipamentoId: '1',
    equipamentoNome: 'Arduino Uno R3',
    quantidade: 1,
    aluno: MOCK_ALUNOS['2021045123'],
    professor: 'Prof. Marcos Andrade',
    tecnicoResponsavel: TECNICO_RESPONSAVEL,
    dataSaida: '2026-10-14T10:30:00',
    previsaoDevolucao: '2026-10-21',
    status: 'EMPRESTADO',
  },
  {
    id: 'emp-2',
    equipamentoId: '3',
    equipamentoNome: 'Motor Shield L298N',
    quantidade: 2,
    aluno: MOCK_ALUNOS['2020011987'],
    professor: 'Prof. Marcos Andrade',
    tecnicoResponsavel: TECNICO_RESPONSAVEL,
    dataSaida: '2026-10-05T09:15:00',
    previsaoDevolucao: '2026-10-12',
    status: 'ATRASADO',
  },
  {
    id: 'emp-3',
    equipamentoId: '6',
    equipamentoNome: 'Osciloscópio Tektronix',
    quantidade: 1,
    aluno: MOCK_ALUNOS['2022078841'],
    professor: 'Profa. Camila Rocha',
    tecnicoResponsavel: TECNICO_RESPONSAVEL,
    dataSaida: '2026-10-16T14:00:00',
    previsaoDevolucao: '2026-10-23',
    status: 'EMPRESTADO',
  },
]
