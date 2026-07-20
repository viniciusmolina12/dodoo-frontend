import { env } from '@/env';
import { ApiError } from './auth';

export type TaskType = 'ONCE' | 'RECURRING';
export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type TaskCategory =
  | 'HEALTH_EXERCISE'
  | 'STUDIES_LEARNING'
  | 'WORK_CAREER'
  | 'HOME_ORGANIZATION'
  | 'FINANCES'
  | 'CREATIVITY'
  | 'MENTAL_WELLNESS'
  | 'RELATIONSHIPS';
export type TaskPrivacy = 'PUBLIC' | 'PRIVATE';
export type TaskStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED';
export type InstanceStatus = 'ACTIVE' | 'COMPLETED' | 'UNDER_EVALUATION' | 'VALIDATED' | 'EXPIRED';
export type GoalType = 'NONE' | 'TEXT' | 'CHECKLIST';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface TaskInstance {
  id: string;
  taskId: string;
  status: InstanceStatus;
  scheduledFor: string | null;
  completedAt: string | null;
  checklistProgress: Record<string, boolean> | null;
  prestigeEarned: number;
  commonCoinsEarned: number;
  averageEvaluationScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  tags: string[];
  type: TaskType;
  recurrence: RecurrenceType | null;
  startDate: string | null;
  privacy: TaskPrivacy;
  declaredDifficulty: Difficulty | null;
  goalType: GoalType;
  goalText: string | null;
  goalChecklist: string[] | null;
  status: TaskStatus;
  deadline: string | null;
  activeInstance: TaskInstance | null;
  createdAt: string;
  updatedAt: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;
  let body: { message?: string | string[] } = {};
  try { body = await res.json(); } catch { /* no-op */ }
  const message = Array.isArray(body.message)
    ? body.message.join(', ')
    : (body.message ?? 'Erro desconhecido');
  throw new ApiError(res.status, message);
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  tags?: string[];
  declaredDifficulty?: Difficulty;
  privacy?: TaskPrivacy;
  deadline?: string | null;
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload, token: string): Promise<Task> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export interface CreateTaskPayload {
  title: string;
  category: TaskCategory;
  type: TaskType;
  recurrence?: RecurrenceType;
  startDate?: string;
  privacy?: TaskPrivacy;
  goalType?: GoalType;
  goalText?: string;
  goalChecklist?: string[];
  description?: string;
  tags?: string[];
  declaredDifficulty?: Difficulty;
  deadline?: string;
}

export async function activateTask(taskId: string, token: string): Promise<{ task: Task; instance: TaskInstance }> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/activate`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<{ task: Task; instance: TaskInstance }>(res);
}

export async function createTask(payload: CreateTaskPayload, token: string): Promise<Task> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(taskId: string, token: string): Promise<void> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let body: { message?: string | string[] } = {};
    try { body = await res.json(); } catch { /* no-op */ }
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : (body.message ?? 'Erro desconhecido');
    throw new ApiError(res.status, message);
  }
}

export async function getTasks(token: string): Promise<Task[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<Task[]>(res);
}

export async function completeTask(
  taskId: string,
  token: string,
  checklistProgress?: Record<string, boolean>,
): Promise<TaskInstance> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/complete`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(checklistProgress ? { checklistProgress } : {}),
  });
  return handleResponse<TaskInstance>(res);
}
