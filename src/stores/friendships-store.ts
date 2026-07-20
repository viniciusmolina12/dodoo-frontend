import { create } from 'zustand';
import {
  getFriendships,
  getPendingFriendships,
  acceptFriendship as acceptApi,
  declineFriendship as declineApi,
  removeFriendship as removeApi,
  type FriendshipItem,
  type PendingFriendships,
} from '@/lib/api/friendships';

interface FriendshipsState {
  friends: FriendshipItem[];
  pending: PendingFriendships;
  isLoading: boolean;
  pendingLoading: boolean;
  error: string | null;
  actioning: Record<string, boolean>;

  fetchFriends: (token: string) => Promise<void>;
  fetchPending: (token: string) => Promise<void>;
  acceptFriendship: (id: string, token: string) => Promise<void>;
  declineFriendship: (id: string, token: string) => Promise<void>;
  removeFriendship: (id: string, token: string) => Promise<void>;
}

export const useFriendshipsStore = create<FriendshipsState>((set) => ({
  friends: [],
  pending: { received: [], sent: [] },
  isLoading: false,
  pendingLoading: false,
  error: null,
  actioning: {},

  fetchFriends: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const friends = await getFriendships(token);
      set({ friends, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Erro' });
    }
  },

  fetchPending: async (token) => {
    set({ pendingLoading: true });
    try {
      const pending = await getPendingFriendships(token);
      set({ pending, pendingLoading: false });
    } catch {
      set({ pendingLoading: false });
    }
  },

  acceptFriendship: async (id, token) => {
    set(s => ({ actioning: { ...s.actioning, [id]: true } }));
    try {
      await acceptApi(id, token);
      set(s => {
        const accepted = s.pending.received.find(r => r.friendshipId === id);
        return {
          actioning: { ...s.actioning, [id]: false },
          pending: {
            ...s.pending,
            received: s.pending.received.filter(r => r.friendshipId !== id),
          },
          friends: accepted
            ? [...s.friends, { ...accepted, status: 'ACCEPTED' as const }]
            : s.friends,
        };
      });
    } catch (err) {
      set(s => ({ actioning: { ...s.actioning, [id]: false } }));
      throw err;
    }
  },

  declineFriendship: async (id, token) => {
    set(s => ({ actioning: { ...s.actioning, [id]: true } }));
    try {
      await declineApi(id, token);
      set(s => ({
        actioning: { ...s.actioning, [id]: false },
        pending: {
          ...s.pending,
          received: s.pending.received.filter(r => r.friendshipId !== id),
        },
      }));
    } catch (err) {
      set(s => ({ actioning: { ...s.actioning, [id]: false } }));
      throw err;
    }
  },

  removeFriendship: async (id, token) => {
    set(s => ({ actioning: { ...s.actioning, [id]: true } }));
    try {
      await removeApi(id, token);
      set(s => ({
        actioning: { ...s.actioning, [id]: false },
        friends: s.friends.filter(f => f.friendshipId !== id),
        pending: {
          ...s.pending,
          sent: s.pending.sent.filter(r => r.friendshipId !== id),
        },
      }));
    } catch (err) {
      set(s => ({ actioning: { ...s.actioning, [id]: false } }));
      throw err;
    }
  },
}));
