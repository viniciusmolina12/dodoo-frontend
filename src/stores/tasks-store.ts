import { create } from 'zustand';
import { getTasks, type Task } from '@/lib/api/tasks';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (token: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await getTasks(token);
      set({ tasks, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar tarefas';
      set({ error: message, isLoading: false });
    }
  },
}));
