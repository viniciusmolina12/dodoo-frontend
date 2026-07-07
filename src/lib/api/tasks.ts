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

export async function getTasks(token: string): Promise<Task[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks`, {
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
  return res.json() as Promise<Task[]>;
}
