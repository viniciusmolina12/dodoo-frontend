export type TaskStatus = 'ativa' | 'concluida' | 'em-avaliacao' | 'validada' | 'expirada';
export type TaskDiff = 'facil' | 'medio' | 'dificil';
export type TaskType = 'unica' | 'recorrente';

export interface TaskGoal {
  kind: 'texto';
  text: string;
}
export interface TaskGoalChecklist {
  kind: 'checklist';
  items: boolean[];
}

export interface Task {
  id: number | string;
  title: string;
  cat: string;
  diff: TaskDiff;
  type: TaskType;
  recur?: string;
  status: TaskStatus;
  goal: TaskGoal | TaskGoalChecklist | null;
  deadline?: string;
  private?: boolean;
  evidence?: boolean;
  evals?: number;
  evalsNeeded?: number;
  prestige?: number;
}

export const STATUS_META: Record<TaskStatus, { label: string; bg: string; fg: string }> = {
  ativa:          { label: 'Ativa',         bg: '#FFF8E7', fg: '#8B6A14' },
  concluida:      { label: 'Concluída',     bg: '#D4F0D8', fg: '#2F7A3F' },
  'em-avaliacao': { label: 'Em avaliação',  bg: '#EFE6FF', fg: '#5B3FA1' },
  validada:       { label: 'Validada',      bg: '#FFE9A8', fg: '#8B6A14' },
  expirada:       { label: 'Expirada',      bg: '#F0E6E2', fg: '#8B5A3F' },
};

export const DIFF_META: Record<TaskDiff, { label: string; dots: number }> = {
  facil:   { label: 'Fácil',   dots: 1 },
  medio:   { label: 'Médio',   dots: 2 },
  dificil: { label: 'Difícil', dots: 3 },
};

export const SAMPLE_TASKS: Task[] = [
  { id: 1, title: 'Correr 5km no parque', cat: 'saude', diff: 'medio', type: 'recorrente', recur: 'diária', status: 'ativa', goal: { kind: 'texto', text: 'Tempo abaixo de 30 min' }, deadline: 'Hoje · 18h', private: false, evidence: false },
  { id: 2, title: 'Terminar capítulo de SwiftUI', cat: 'estudos', diff: 'dificil', type: 'unica', status: 'em-avaliacao', goal: { kind: 'checklist', items: [true, true, false] }, evidence: true, evals: 4, evalsNeeded: 5 },
  { id: 3, title: 'Organizar a estante de livros', cat: 'casa', diff: 'facil', type: 'unica', status: 'concluida', goal: null, evidence: true },
  { id: 4, title: 'Esboçar 3 ideias de capa', cat: 'criativa', diff: 'medio', type: 'unica', status: 'ativa', goal: { kind: 'checklist', items: [true, false, false] }, deadline: 'Amanhã', private: true },
  { id: 5, title: 'Revisar orçamento do mês', cat: 'financas', diff: 'facil', type: 'recorrente', recur: 'mensal', status: 'ativa', goal: { kind: 'texto', text: 'Categorizar todas as despesas' }, deadline: 'Sex · 20h' },
  { id: 6, title: 'Meditar 10 minutos', cat: 'mental', diff: 'facil', type: 'recorrente', recur: 'diária', status: 'validada', goal: null, evidence: false, prestige: 8 },
];
