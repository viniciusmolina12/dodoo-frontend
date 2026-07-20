import { env } from '@/env';
import { ApiError } from './auth';

export interface FeedTask {
  title: string;
  description: string | null;
  category: string;
  declaredDifficulty: 'EASY' | 'MEDIUM' | 'HARD' | null;
  goalType: 'NONE' | 'TEXT' | 'CHECKLIST';
  goalText: string | null;
  goalChecklist: string[] | null;
  owner: { username: string };
}

export interface FeedItem {
  instanceId: string;
  taskId: string;
  completedAt: string;
  evaluationCount: number;
  evaluationsNeeded: number;
  task: FeedTask;
}

export interface FeedResponse {
  items: FeedItem[];
  nextCursor: string | null;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }
  let body: { message?: string | string[] } = {};
  try {
    body = await res.json();
  } catch { /* no-op */ }
  const message = Array.isArray(body.message)
    ? body.message.join(', ')
    : (body.message ?? 'Erro desconhecido');
  throw new ApiError(res.status, message);
}

function h(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function getFeed(
  token: string,
  cursor?: string,
  limit = 10,
): Promise<FeedResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/tasks/feed?${params}`, {
    headers: h(token),
  });
  return handleResponse<FeedResponse>(res);
}

export async function submitEvaluation(
  taskId: string,
  instanceId: string,
  score: number,
  comment: string,
  token: string,
): Promise<void> {
  const body: { score: number; comment?: string } = { score };
  if (comment.trim()) body.comment = comment.trim();
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/instances/${instanceId}/evaluations`,
    { method: 'POST', headers: h(token), body: JSON.stringify(body) },
  );
  return handleResponse<void>(res);
}
