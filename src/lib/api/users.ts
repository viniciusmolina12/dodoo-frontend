import { env } from '@/env';
import { ApiError } from './auth';

export interface ProfileTask {
  id: string;
  title: string;
  category: string;
  status: 'ACTIVE' | 'EXPIRED';
  type: 'RECURRING' | 'ONE_TIME';
  goalType: 'NONE' | 'CHECKLIST' | 'TARGET' | 'EXTERNAL';
  goalText: string | null;
  createdAt: string;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  name: string;
  commonCoins: number;
  prestige: number;
  interests: string[];
  tasks: ProfileTask[];
}

export async function getUserByUsername(username: string): Promise<PublicUserProfile> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/${encodeURIComponent(username)}`);
  if (res.ok) return res.json() as Promise<PublicUserProfile>;
  let body: { message?: string | string[] } = {};
  try {
    body = await res.json();
  } catch {
    /* no-op */
  }
  const message = Array.isArray(body.message)
    ? body.message.join(', ')
    : (body.message ?? 'Erro desconhecido');
  throw new ApiError(res.status, message);
}
