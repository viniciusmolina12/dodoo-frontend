export interface FeedUser {
  name: string;
  color: string;
  fg: string;
}

export type AttachmentKind = 'image' | 'doc' | 'text';

export interface AttachmentImage {
  kind: 'image';
  tone: string;
  caption: string;
  motif?: string;
}

export interface AttachmentDoc {
  kind: 'doc';
  ext: string;
  name: string;
  size: string;
}

export interface AttachmentText {
  kind: 'text';
  text: string;
}

export type Attachment = AttachmentImage | AttachmentDoc | AttachmentText;

export interface FeedTask {
  id: string;
  user: FeedUser;
  completedAt: string;
  cat: string;
  title: string;
  diff: 'facil' | 'medio' | 'dificil';
  goal: { kind: 'texto'; text: string } | { kind: 'checklist'; items: boolean[] } | null;
  note: string | null;
  attachments: Attachment[];
  evals: number;
  evalsNeeded: number;
}

export const FEED_TASKS: FeedTask[] = [
  {
    id: 'f1',
    user: { name: 'Carla', color: '#FFD9D2', fg: '#C0392B' },
    completedAt: 'há 12 min',
    cat: 'saude',
    title: 'Correr 8 km no parque',
    diff: 'dificil',
    goal: { kind: 'texto', text: 'Tempo abaixo de 50 min' },
    note: 'Cheguei em 47:32 — primeira vez quebrando os 50 minutos!',
    attachments: [
      { kind: 'image', tone: 'mint',  caption: 'strava · rota',   motif: 'route' },
      { kind: 'image', tone: 'peach', caption: 'tempo final',     motif: 'timer' },
    ],
    evals: 2, evalsNeeded: 5,
  },
  {
    id: 'f2',
    user: { name: 'Bruno', color: '#D6E6FF', fg: '#2E5BB0' },
    completedAt: 'há 38 min',
    cat: 'estudos',
    title: 'Terminar capítulo 7 — Cálculo II',
    diff: 'dificil',
    goal: { kind: 'checklist', items: [true, true, true, true, true] },
    note: null,
    attachments: [
      { kind: 'image', tone: 'sky',   caption: 'caderno · resumo', motif: 'notebook' },
      { kind: 'doc',   ext: 'PDF',    name: 'cap7-anotacoes.pdf', size: '2.4 MB' },
    ],
    evals: 4, evalsNeeded: 5,
  },
  {
    id: 'f3',
    user: { name: 'Marina', color: '#D4F0D8', fg: '#2F7A3F' },
    completedAt: 'há 2 h',
    cat: 'casa',
    title: 'Organizar guarda-roupa de inverno',
    diff: 'medio',
    goal: { kind: 'texto', text: 'Doar peças não usadas há 1 ano' },
    note: 'Saíram 14 peças pra doação. Tudo dobrado por categoria.',
    attachments: [
      { kind: 'image', tone: 'lilac', caption: 'antes',   motif: 'closet-before' },
      { kind: 'image', tone: 'mint',  caption: 'depois',  motif: 'closet-after' },
      { kind: 'image', tone: 'peach', caption: 'doação',  motif: 'closet-after' },
    ],
    evals: 1, evalsNeeded: 3,
  },
  {
    id: 'f4',
    user: { name: 'Pedro', color: '#FFD9EC', fg: '#B33B7C' },
    completedAt: 'há 4 h',
    cat: 'criativa',
    title: 'Esboçar 3 conceitos de capa',
    diff: 'medio',
    goal: { kind: 'checklist', items: [true, true, true] },
    note: null,
    attachments: [
      { kind: 'image', tone: 'rose',  caption: 'conceito A', motif: 'poster' },
      { kind: 'image', tone: 'lemon', caption: 'conceito B', motif: 'poster' },
      { kind: 'image', tone: 'sky',   caption: 'conceito C', motif: 'poster' },
      { kind: 'text', text: 'A direção B parece mais alinhada com o público — mais quente e direta.' },
    ],
    evals: 0, evalsNeeded: 5,
  },
  {
    id: 'f5',
    user: { name: 'Ana', color: '#CFEDE6', fg: '#177264' },
    completedAt: 'há 6 h',
    cat: 'mental',
    title: 'Meditar 20 minutos',
    diff: 'facil',
    goal: null,
    note: 'Sessão guiada — Insight Timer.',
    attachments: [
      { kind: 'text', text: 'Comecei o dia mais leve. A respiração ficou mais funda na metade.' },
    ],
    evals: 2, evalsNeeded: 3,
  },
];
