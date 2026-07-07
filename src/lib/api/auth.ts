import { env } from '@/env';

export type TaskCategory =
  | 'HEALTH_EXERCISE'
  | 'STUDIES_LEARNING'
  | 'WORK_CAREER'
  | 'HOME_ORGANIZATION'
  | 'FINANCES'
  | 'CREATIVITY'
  | 'MENTAL_WELLNESS'
  | 'RELATIONSHIPS';

export const CATEGORY_MAP: Record<string, TaskCategory> = {
  saude:    'HEALTH_EXERCISE',
  estudos:  'STUDIES_LEARNING',
  trabalho: 'WORK_CAREER',
  casa:     'HOME_ORGANIZATION',
  financas: 'FINANCES',
  criativa: 'CREATIVITY',
  mental:   'MENTAL_WELLNESS',
  relac:    'RELATIONSHIPS',
};

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  commonCoins: number;
  prestige: number;
  interests: TaskCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  interests: TaskCategory[];
}

export interface LoginPayload {
  login: string;
  password: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
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

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ message: string }>(res);
}

export async function verifyEmail(email: string, token: string): Promise<AuthResponse> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function resendVerification(email: string): Promise<void> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  await handleResponse<unknown>(res);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}
