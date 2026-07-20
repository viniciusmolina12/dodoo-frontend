import { env } from '@/env';
import { ApiError } from './auth';

export interface FriendshipUser {
  id: string;
  username: string;
  commonCoins: number;
  prestige: number;
}

export interface FriendshipItem {
  friendshipId: string;
  status: 'PENDING' | 'ACCEPTED';
  user: FriendshipUser;
  createdAt: string;
}

export interface PendingFriendships {
  received: FriendshipItem[];
  sent: FriendshipItem[];
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }
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

function h(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function getFriendships(token: string): Promise<FriendshipItem[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/friendships`, { headers: h(token) });
  return handleResponse<FriendshipItem[]>(res);
}

export async function getPendingFriendships(token: string): Promise<PendingFriendships> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/friendships/pending`, { headers: h(token) });
  return handleResponse<PendingFriendships>(res);
}

export async function sendFriendRequest(
  addresseeId: string,
  token: string
): Promise<FriendshipItem> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/friendships`, {
    method: 'POST',
    headers: h(token),
    body: JSON.stringify({ addresseeId }),
  });
  return handleResponse<FriendshipItem>(res);
}

export async function acceptFriendship(id: string, token: string): Promise<FriendshipItem> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/friendships/${id}/accept`, {
    method: 'PATCH',
    headers: h(token),
    body: JSON.stringify({}),
  });
  return handleResponse<FriendshipItem>(res);
}

export async function declineFriendship(id: string, token: string): Promise<void> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/friendships/${id}/decline`, {
    method: 'PATCH',
    headers: h(token),
  });
  return handleResponse<void>(res);
}

export async function removeFriendship(id: string, token: string): Promise<void> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/friendships/${id}`, {
    method: 'DELETE',
    headers: h(token),
  });
  return handleResponse<void>(res);
}
