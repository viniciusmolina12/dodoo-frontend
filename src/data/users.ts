import type { Task } from './tasks';

export interface OtherUser {
  name: string;
  handle: string;
  color: string;
  fg: string;
  level: number;
  title: string;
  bio: string;
  stats: { prestige: number; coins: number; streak: number; validated: number };
  interests: string[];
  publicTasks: Task[];
}

export const OTHER_USERS: Record<string, OtherUser> = {
  Carla: {
    name: 'Carla', handle: 'carla.run', color: '#FFD9D2', fg: '#C0392B',
    level: 18, title: 'Corredora de Domingo',
    bio: 'Buscando o próximo PR. Sempre antes do café.',
    stats: { prestige: 142, coins: 320, streak: 22, validated: 96 },
    interests: ['saude', 'mental', 'estudos'],
    publicTasks: [
      { id: 'c1', title: 'Correr 8 km no parque', cat: 'saude', diff: 'dificil', type: 'recorrente', recur: 'semanal', status: 'em-avaliacao', goal: { kind: 'texto', text: 'Tempo abaixo de 50 min' }, evals: 2, evalsNeeded: 5 },
      { id: 'c2', title: 'Treino de força — pernas', cat: 'saude', diff: 'medio', type: 'recorrente', recur: 'semanal', status: 'validada', prestige: 6, goal: null },
      { id: 'c3', title: '10 min de respiração guiada', cat: 'mental', diff: 'facil', type: 'recorrente', recur: 'diária', status: 'validada', prestige: 3, goal: null },
      { id: 'c4', title: 'Ler artigo sobre VO2 máx', cat: 'estudos', diff: 'facil', type: 'unica', status: 'concluida', goal: null },
      { id: 'c5', title: 'Meia maratona — treino longo', cat: 'saude', diff: 'dificil', type: 'unica', status: 'ativa', deadline: 'Domingo', goal: { kind: 'checklist', items: [true, true, false, false] } },
    ],
  },
  Bruno: {
    name: 'Bruno', handle: 'bru.no', color: '#D6E6FF', fg: '#2E5BB0',
    level: 9, title: 'Cabeça de Cálculo',
    bio: 'Engenharia + violão. Aceito sugestões de livros.',
    stats: { prestige: 64, coins: 180, streak: 4, validated: 31 },
    interests: ['estudos', 'criativa'],
    publicTasks: [
      { id: 'b1', title: 'Terminar capítulo 7 — Cálculo II', cat: 'estudos', diff: 'dificil', type: 'unica', status: 'em-avaliacao', goal: { kind: 'checklist', items: [true, true, true, true, true] }, evals: 4, evalsNeeded: 5 },
      { id: 'b2', title: 'Resolver lista de séries de Taylor', cat: 'estudos', diff: 'medio', type: 'unica', status: 'validada', prestige: 5, goal: null },
      { id: 'b3', title: 'Compor uma melodia curta', cat: 'criativa', diff: 'medio', type: 'unica', status: 'concluida', goal: null },
      { id: 'b4', title: 'Revisar fichamento de Álgebra', cat: 'estudos', diff: 'facil', type: 'recorrente', recur: 'semanal', status: 'ativa', deadline: 'Sex · 20h', goal: null },
    ],
  },
  Marina: {
    name: 'Marina', handle: 'mari.casa', color: '#D4F0D8', fg: '#2F7A3F',
    level: 14, title: 'Curadora do Cotidiano',
    bio: 'Menos coisas, mais espaço. Casa em obra eterna.',
    stats: { prestige: 88, coins: 410, streak: 12, validated: 58 },
    interests: ['casa', 'mental'],
    publicTasks: [
      { id: 'm1', title: 'Organizar guarda-roupa de inverno', cat: 'casa', diff: 'medio', type: 'unica', status: 'em-avaliacao', goal: { kind: 'texto', text: 'Doar peças não usadas há 1 ano' }, evals: 1, evalsNeeded: 3 },
      { id: 'm2', title: 'Limpar varanda e regar plantas', cat: 'casa', diff: 'facil', type: 'recorrente', recur: 'semanal', status: 'validada', prestige: 2, goal: null },
      { id: 'm3', title: 'Reorganizar a despensa por categoria', cat: 'casa', diff: 'medio', type: 'unica', status: 'concluida', goal: { kind: 'checklist', items: [true, true, true] } },
      { id: 'm4', title: 'Yoga restaurativa antes de dormir', cat: 'mental', diff: 'facil', type: 'recorrente', recur: 'diária', status: 'ativa', goal: null },
    ],
  },
  Pedro: {
    name: 'Pedro', handle: 'pdr.draws', color: '#FFD9EC', fg: '#B33B7C',
    level: 21, title: 'Caderno Cheio',
    bio: 'Ilustração editorial. Direção de arte freelancer.',
    stats: { prestige: 203, coins: 540, streak: 31, validated: 122 },
    interests: ['criativa', 'trabalho'],
    publicTasks: [
      { id: 'p1', title: 'Esboçar 3 conceitos de capa', cat: 'criativa', diff: 'medio', type: 'unica', status: 'em-avaliacao', goal: { kind: 'checklist', items: [true, true, true] }, evals: 0, evalsNeeded: 5 },
      { id: 'p2', title: 'Estudo de cor — paleta outono', cat: 'criativa', diff: 'facil', type: 'unica', status: 'validada', prestige: 4, goal: null },
      { id: 'p3', title: 'Apresentar mood board ao cliente', cat: 'trabalho', diff: 'medio', type: 'unica', status: 'concluida', goal: null },
      { id: 'p4', title: 'Postar processo no portfólio', cat: 'trabalho', diff: 'facil', type: 'recorrente', recur: 'semanal', status: 'ativa', deadline: 'Qui', goal: null },
      { id: 'p5', title: 'Caderno de esboços — 1 página/dia', cat: 'criativa', diff: 'facil', type: 'recorrente', recur: 'diária', status: 'validada', prestige: 1, goal: null },
    ],
  },
  Ana: {
    name: 'Ana', handle: 'ana.b', color: '#CFEDE6', fg: '#177264',
    level: 7, title: 'Respira Fundo',
    bio: 'Devagar com calma. Buscando o meio termo.',
    stats: { prestige: 38, coins: 95, streak: 9, validated: 18 },
    interests: ['mental', 'saude'],
    publicTasks: [
      { id: 'a1', title: 'Meditar 20 minutos', cat: 'mental', diff: 'facil', type: 'recorrente', recur: 'diária', status: 'em-avaliacao', goal: null, evals: 2, evalsNeeded: 3 },
      { id: 'a2', title: 'Escrever 3 gratidões antes de dormir', cat: 'mental', diff: 'facil', type: 'recorrente', recur: 'diária', status: 'validada', prestige: 2, goal: null },
      { id: 'a3', title: 'Caminhada longa no fim de semana', cat: 'saude', diff: 'medio', type: 'recorrente', recur: 'semanal', status: 'ativa', deadline: 'Sáb', goal: null },
    ],
  },
};

export function getOtherUser(name: string): OtherUser {
  return OTHER_USERS[name] ?? {
    name,
    handle: (name || 'user').toLowerCase().replace(/\s+/g, '.'),
    color: '#EFE6FF',
    fg: '#5B3FA1',
    level: 1,
    title: 'Novo por aqui',
    bio: 'Sem bio ainda.',
    stats: { prestige: 0, coins: 0, streak: 0, validated: 0 },
    interests: [],
    publicTasks: [],
  };
}
