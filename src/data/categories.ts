export interface Category {
  id: string;
  name: string;
  long: string;
  bg: string;
  fg: string;
  icon: string;
}

export const DODOO_CATEGORIES: Category[] = [
  { id: 'saude',    name: 'Saúde',        long: 'Saúde & Exercício',     bg: '#FFD9D2', fg: '#C0392B', icon: 'heart'     },
  { id: 'estudos',  name: 'Estudos',      long: 'Estudos & Aprendizado', bg: '#D6E6FF', fg: '#2E5BB0', icon: 'book'      },
  { id: 'trabalho', name: 'Trabalho',     long: 'Trabalho & Carreira',   bg: '#E1DBFF', fg: '#5B3FA1', icon: 'briefcase' },
  { id: 'casa',     name: 'Casa',         long: 'Casa & Organização',    bg: '#D4F0D8', fg: '#2F7A3F', icon: 'house'     },
  { id: 'financas', name: 'Finanças',     long: 'Finanças',              bg: '#FFE9A8', fg: '#8B6A14', icon: 'coin'      },
  { id: 'criativa', name: 'Criatividade', long: 'Criatividade',          bg: '#FFD9EC', fg: '#B33B7C', icon: 'spark'     },
  { id: 'mental',   name: 'Bem-estar',    long: 'Bem-estar Mental',      bg: '#CFEDE6', fg: '#177264', icon: 'moon'      },
  { id: 'relac',    name: 'Relações',     long: 'Relacionamentos',       bg: '#FFE0C2', fg: '#B05A1C', icon: 'people'    },
];

export const CAT_BY_ID: Record<string, Category> = Object.fromEntries(
  DODOO_CATEGORIES.map(c => [c.id, c])
);

export const CAT_BY_API_KEY: Record<string, Category> = {
  HEALTH_EXERCISE:   DODOO_CATEGORIES[0],
  STUDIES_LEARNING:  DODOO_CATEGORIES[1],
  WORK_CAREER:       DODOO_CATEGORIES[2],
  HOME_ORGANIZATION: DODOO_CATEGORIES[3],
  FINANCES:          DODOO_CATEGORIES[4],
  CREATIVITY:        DODOO_CATEGORIES[5],
  MENTAL_WELLNESS:   DODOO_CATEGORIES[6],
  RELATIONSHIPS:     DODOO_CATEGORIES[7],
};
