export interface AvatarPalette {
  body: string; belly: string; accent: string;
  beak: string; beakStroke: string; cheek: string;
}

export interface AvatarOption {
  id: string; name: string; cost: number; owned: boolean;
  equipped?: boolean; rare?: boolean; palette: AvatarPalette;
}

export interface BorderOption {
  id: string; name: string; cost: number; owned: boolean;
  equipped?: boolean; rare?: boolean;
  draw: 'none' | 'solid' | 'dash' | 'gradient' | 'stars' | 'wave' | 'pixel';
  color?: string; width?: number;
}

export interface TitleOption {
  id: string; name: string; unlock: string; unlocked: boolean;
  equipped?: boolean; rare?: boolean;
  bg: string; fg: string; icon: string;
  progress?: number; needed?: number;
}

export interface ThemeOption {
  id: string; name: string; cost: number; owned: boolean;
  equipped?: boolean; rare?: boolean;
  gradient: [string, string]; accent: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'classic',  name: 'Clássico',  cost: 0,   owned: true,  equipped: true,
    palette: { body: '#7857C8', belly: '#9D81E0', accent: '#5B3FA1', beak: '#FFD93D', beakStroke: '#E5B800', cheek: '#FFB3C6' } },
  { id: 'sunny',    name: 'Sol',       cost: 0,   owned: true,
    palette: { body: '#FFB627', belly: '#FFD060', accent: '#E08A00', beak: '#FF6B9D', beakStroke: '#C03A6E', cheek: '#FFE0EC' } },
  { id: 'mint',     name: 'Hortelã',   cost: 40,  owned: true,
    palette: { body: '#6BCFA5', belly: '#A5DFC9', accent: '#2F7A3F', beak: '#FFD93D', beakStroke: '#E5B800', cheek: '#FFD2E0' } },
  { id: 'rose',     name: 'Rosa',      cost: 40,  owned: false,
    palette: { body: '#E289B0', belly: '#FFB8D0', accent: '#B33B7C', beak: '#FFD93D', beakStroke: '#E5B800', cheek: '#FFE0EC' } },
  { id: 'sky',      name: 'Céu',       cost: 40,  owned: false,
    palette: { body: '#5B9CDD', belly: '#88BFE0', accent: '#2E5BB0', beak: '#FFD93D', beakStroke: '#E5B800', cheek: '#FFB3C6' } },
  { id: 'coal',     name: 'Carvão',    cost: 60,  owned: false,
    palette: { body: '#3A3148', belly: '#5C4F6E', accent: '#1F1530', beak: '#FFD93D', beakStroke: '#E5B800', cheek: '#FFB3C6' } },
  { id: 'butter',   name: 'Manteiga',  cost: 60,  owned: false,
    palette: { body: '#FFE885', belly: '#FFF1B5', accent: '#E5B800', beak: '#FF8FB1', beakStroke: '#C03A6E', cheek: '#FFE0EC' } },
  { id: 'galaxy',   name: 'Galáxia',   cost: 120, owned: false, rare: true,
    palette: { body: '#5B3FA1', belly: '#8B5FD0', accent: '#FFD93D', beak: '#FFD93D', beakStroke: '#E5B800', cheek: '#FFB3C6' } },
];

export const BORDER_OPTIONS: BorderOption[] = [
  { id: 'none',       name: 'Sem aro',    cost: 0,   owned: true,  equipped: true, draw: 'none' },
  { id: 'sol',        name: 'Sol',        cost: 30,  owned: true,                  draw: 'solid',    color: '#FFD93D', width: 5 },
  { id: 'uva',        name: 'Uva',        cost: 30,  owned: true,                  draw: 'solid',    color: '#5B3FA1', width: 5 },
  { id: 'tracejada',  name: 'Tracejada',  cost: 50,  owned: false,                 draw: 'dash',     color: '#FFD93D' },
  { id: 'gradiente',  name: 'Aurora',     cost: 80,  owned: false,                 draw: 'gradient' },
  { id: 'estrelas',   name: 'Estrelas',   cost: 100, owned: false,                 draw: 'stars' },
  { id: 'ondas',      name: 'Ondas',      cost: 80,  owned: false,                 draw: 'wave' },
  { id: 'pixel',      name: 'Pixel',      cost: 120, owned: false, rare: true,     draw: 'pixel' },
];

export const TITLE_OPTIONS: TitleOption[] = [
  { id: 'manha',     name: 'Mestre da Manhã',  unlock: 'streak 30 dias',       unlocked: true,  equipped: true,  bg: '#FFD93D', fg: '#1F1530', icon: 'flame' },
  { id: 'filo',      name: 'Filósofo',         unlock: '10 tarefas de Estudos', unlocked: true,                  bg: '#D6E6FF', fg: '#2E5BB0', icon: 'book' },
  { id: 'organiza',  name: 'Casa Limpa',       unlock: '20 tarefas de Casa',    unlocked: true,                  bg: '#D4F0D8', fg: '#2F7A3F', icon: 'house' },
  { id: 'artista',   name: 'Mente Criativa',   unlock: '15 de Criatividade',    unlocked: false, progress: 9,  needed: 15, bg: '#FFD9EC', fg: '#B33B7C', icon: 'spark' },
  { id: 'ferreo',    name: 'Punho de Ferro',   unlock: 'streak 100 dias',       unlocked: false, progress: 7,  needed: 100, bg: '#FFD9D2', fg: '#C0392B', icon: 'flame' },
  { id: 'avaliador', name: 'Olho Justo',       unlock: 'avalie 50 tarefas',     unlocked: false, progress: 12, needed: 50,  bg: '#EFE6FF', fg: '#5B3FA1', icon: 'eye' },
  { id: 'rico',      name: 'Tesouro',          unlock: 'acumule 500 moedas',    unlocked: false, progress: 240, needed: 500, bg: '#FFE9A8', fg: '#8B6A14', icon: 'coin' },
  { id: 'lenda',     name: 'Lenda Dodoo',      unlock: 'prestígio 500',         unlocked: false, progress: 87, needed: 500, bg: '#1F1530', fg: '#FFD93D', icon: 'trophy', rare: true },
];

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'lavanda',  name: 'Lavanda doce', cost: 0,   owned: true,  equipped: true, gradient: ['#5B3FA1', '#7857C8'], accent: '#FFD93D' },
  { id: 'sol',      name: 'Sol da manhã', cost: 30,  owned: true,                  gradient: ['#FFB627', '#FFD93D'], accent: '#5B3FA1' },
  { id: 'floresta', name: 'Floresta',     cost: 50,  owned: false,                 gradient: ['#2F7A3F', '#6BCFA5'], accent: '#FFD93D' },
  { id: 'aurora',   name: 'Aurora',       cost: 80,  owned: false,                 gradient: ['#E289B0', '#A88FE3'], accent: '#FFD93D' },
  { id: 'crepusc',  name: 'Crepúsculo',   cost: 80,  owned: false,                 gradient: ['#3A2868', '#E0245E'], accent: '#FFD93D' },
  { id: 'oceano',   name: 'Oceano',       cost: 100, owned: false,                 gradient: ['#2E5BB0', '#88BFE0'], accent: '#FFD93D' },
  { id: 'noite',    name: 'Noite',        cost: 100, owned: false, rare: true,     gradient: ['#1F1530', '#3A3148'], accent: '#FFD93D' },
];
