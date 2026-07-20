import { create } from 'zustand';
import {
  getTasks,
  completeTask as completeTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  type Task,
  type UpdateTaskPayload,
} from '@/lib/api/tasks';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  completing: Record<string, boolean>;
  updating: Record<string, boolean>;
  deleting: Record<string, boolean>;
  fetchTasks: (token: string) => Promise<void>;
  completeTask: (taskId: string, token: string, checklistProgress?: Record<string, boolean>) => Promise<void>;
  updateTask: (taskId: string, payload: UpdateTaskPayload, token: string) => Promise<void>;
  deleteTask: (taskId: string, token: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  completing: {},
  updating: {},
  deleting: {},

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

  completeTask: async (taskId, token, checklistProgress) => {
    set(s => ({ completing: { ...s.completing, [taskId]: true } }));
    try {
      const updatedInstance = await completeTaskApi(taskId, token, checklistProgress);
      set(s => ({
        completing: { ...s.completing, [taskId]: false },
        tasks: s.tasks.map(t =>
          t.id === taskId ? { ...t, activeInstance: updatedInstance } : t
        ),
      }));
    } catch {
      set(s => ({ completing: { ...s.completing, [taskId]: false } }));
      await get().fetchTasks(token);
    }
  },

  deleteTask: async (taskId, token) => {
    set(s => ({ deleting: { ...s.deleting, [taskId]: true } }));
    try {
      await deleteTaskApi(taskId, token);
      set(s => ({
        deleting: { ...s.deleting, [taskId]: false },
        tasks: s.tasks.filter(t => t.id !== taskId),
      }));
    } catch (err) {
      set(s => ({ deleting: { ...s.deleting, [taskId]: false } }));
      throw err;
    }
  },

  updateTask: async (taskId, payload, token) => {
    set(s => ({ updating: { ...s.updating, [taskId]: true } }));
    try {
      const updated = await updateTaskApi(taskId, payload, token);
      set(s => ({
        updating: { ...s.updating, [taskId]: false },
        tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...updated } : t),
      }));
    } catch (err) {
      set(s => ({ updating: { ...s.updating, [taskId]: false } }));
      throw err;
    }
  },
}));
