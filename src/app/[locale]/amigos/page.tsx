'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { CategoryIcon } from '@/components/ui/icons';
import { useAuthStore } from '@/stores/auth-store';
import { useFriendshipsStore } from '@/stores/friendships-store';
import { sendFriendRequest as apiSendFriendRequest } from '@/lib/api/friendships';
import { getUserByUsername, type PublicUserProfile } from '@/lib/api/users';
import { ApiError } from '@/lib/api/auth';
import type { FriendshipItem } from '@/lib/api/friendships';

// ─── Avatar placeholder ───────────────────────────────────────────────────────

function UserAvatar({ username, size = 40 }: { username: string; size?: number }) {
  const letter = (username[0] ?? '?').toUpperCase();
  const hue = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, flexShrink: 0,
      background: `hsl(${hue}, 55%, 72%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
      fontSize: size * 0.42, color: `hsl(${hue}, 40%, 28%)`,
    }}>
      {letter}
    </div>
  );
}

// ─── Friend card ──────────────────────────────────────────────────────────────

function FriendCard({
  item, onRemove, onViewProfile, actioning,
}: {
  item: FriendshipItem;
  onRemove: () => void;
  onViewProfile: () => void;
  actioning: boolean;
}) {
  const t = useTranslations('friends');
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 18, padding: '14px 16px',
      boxShadow: '0 1px 0 rgba(31,21,48,0.04), 0 4px 12px rgba(91,63,161,0.06)',
      border: '1.5px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <UserAvatar username={item.user.username} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15.5, color: 'var(--dark)', lineHeight: 1.2 }}>
          @{item.user.username}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 800, color: '#FFB627' }}>
            <CategoryIcon name="coin" size={11} color="#FFB627" />
            {item.user.commonCoins}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 800, color: 'var(--purple)' }}>
            <CategoryIcon name="star" size={11} color="var(--purple)" />
            {item.user.prestige}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
        <button onClick={onViewProfile} style={{
          border: 'none', cursor: 'pointer', padding: '7px 12px', borderRadius: 10,
          background: 'var(--purple-bg)', fontFamily: 'Nunito, sans-serif',
          fontWeight: 800, fontSize: 12, color: 'var(--purple)',
        }}>
          {t('viewProfile')}
        </button>
        <button onClick={onRemove} disabled={actioning} style={{
          border: 'none', cursor: actioning ? 'default' : 'pointer',
          width: 32, height: 32, borderRadius: 9, padding: 0,
          background: '#FFF0EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: actioning ? 0.5 : 1,
        }}>
          <CategoryIcon name="trash" size={13} color="#C0392B" />
        </button>
      </div>
    </div>
  );
}

// ─── Pending received card ────────────────────────────────────────────────────

function ReceivedCard({
  item, onAccept, onDecline, actioning,
}: {
  item: FriendshipItem;
  onAccept: () => void;
  onDecline: () => void;
  actioning: boolean;
}) {
  const t = useTranslations('friends');
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 18, padding: '14px 16px',
      border: '1.5px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <UserAvatar username={item.user.username} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15.5, color: 'var(--dark)', lineHeight: 1.2 }}>
          @{item.user.username}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 800, color: '#FFB627' }}>
            <CategoryIcon name="coin" size={11} color="#FFB627" />
            {item.user.commonCoins}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 800, color: 'var(--purple)' }}>
            <CategoryIcon name="star" size={11} color="var(--purple)" />
            {item.user.prestige}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
        <button onClick={onDecline} disabled={actioning} style={{
          border: 'none', cursor: actioning ? 'default' : 'pointer', padding: '7px 12px', borderRadius: 10,
          background: 'var(--surface-alt)', boxShadow: 'inset 0 0 0 1.5px var(--border)',
          fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--text-faint)',
          opacity: actioning ? 0.5 : 1,
        }}>
          {t('decline')}
        </button>
        <button onClick={onAccept} disabled={actioning} style={{
          border: 'none', cursor: actioning ? 'default' : 'pointer', padding: '7px 14px', borderRadius: 10,
          background: 'var(--accent)',
          boxShadow: '0 4px 10px rgba(255,167,0,0.3), inset 0 -2px 0 rgba(0,0,0,0.07)',
          fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--dark)',
          opacity: actioning ? 0.5 : 1,
        }}>
          {t('accept')}
        </button>
      </div>
    </div>
  );
}

// ─── Pending sent card ────────────────────────────────────────────────────────

function SentCard({ item, onCancel, actioning }: {
  item: FriendshipItem;
  onCancel: () => void;
  actioning: boolean;
}) {
  const t = useTranslations('friends');
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 18, padding: '14px 16px',
      border: '1.5px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <UserAvatar username={item.user.username} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15.5, color: 'var(--dark)' }}>
          @{item.user.username}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-faint)', fontWeight: 700, marginTop: 3 }}>
          {t('pendingSent')}
        </div>
      </div>
      <button onClick={onCancel} disabled={actioning} style={{
        border: 'none', cursor: actioning ? 'default' : 'pointer', padding: '7px 12px', borderRadius: 10,
        background: 'var(--surface-alt)', boxShadow: 'inset 0 0 0 1.5px var(--border)',
        fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--text-faint)',
        opacity: actioning ? 0.5 : 1, flexShrink: 0,
      }}>
        {t('cancel')}
      </button>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionLabel({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {children}
      </span>
      <span style={{
        fontSize: 10.5, fontWeight: 800, color: 'var(--purple)',
        background: 'var(--purple-bg)', padding: '1px 7px', borderRadius: 999,
      }}>
        {count}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AmigosPage() {
  const router = useRouter();
  const t = useTranslations('friends');
  const token = useAuthStore(s => s.token);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    friends, pending, isLoading, pendingLoading,
    fetchFriends, fetchPending,
    acceptFriendship, declineFriendship, removeFriendship,
    actioning,
  } = useFriendshipsStore();

  useEffect(() => {
    if (!mounted || !token) return;
    fetchFriends(token);
    fetchPending(token);
  }, [mounted, token, fetchFriends, fetchPending]);

  const [tab, setTab] = useState<'friends' | 'pending'>('friends');
  const [search, setSearch] = useState('');

  // Search state
  const [searchResult, setSearchResult] = useState<PublicUserProfile | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [requestSending, setRequestSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Confirm modals
  const [removingItem, setRemovingItem] = useState<FriendshipItem | null>(null);
  const [cancellingItem, setCancellingItem] = useState<FriendshipItem | null>(null);

  const handleSearch = async () => {
    const q = search.trim().replace(/^@/, '');
    if (!q) return;
    setSearchResult(null);
    setSearchError(null);
    setRequestSent(false);
    setSearchLoading(true);
    try {
      const found = await getUserByUsername(q);
      setSearchResult(found);
    } catch (e) {
      setSearchError(
        e instanceof ApiError && e.status === 404
          ? t('notFound')
          : e instanceof Error ? e.message : t('notFound'),
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult || !token) return;
    setRequestSending(true);
    setSearchError(null);
    try {
      await apiSendFriendRequest(searchResult.id, token);
      setRequestSent(true);
      fetchPending(token);
    } catch (e) {
      setSearchError(
        e instanceof ApiError && e.status === 409
          ? t('alreadyConnected')
          : e instanceof Error ? e.message : 'Erro',
      );
    } finally {
      setRequestSending(false);
    }
  };

  const handleNav = (id: string) => {
    if (id === 'list')     router.push('../tarefas');
    if (id === 'feed')     router.push('../feed');
    if (id === 'trophy')   router.push('../conquistas');
    if (id === 'settings') router.push('../configuracoes');
  };

  const pendingCount = pending.received.length;

  return (
    <>
      <ConfirmModal
        open={!!removingItem}
        title={t('removeModalTitle')}
        description={t('removeModalDesc')}
        confirmLabel={t('removeConfirm')}
        cancelLabel={t('removeCancel')}
        danger
        loading={removingItem ? (actioning[removingItem.friendshipId] ?? false) : false}
        onConfirm={async () => {
          if (!removingItem || !token) return;
          await removeFriendship(removingItem.friendshipId, token);
          setRemovingItem(null);
        }}
        onCancel={() => setRemovingItem(null)}
      />

      <ConfirmModal
        open={!!cancellingItem}
        title={t('cancelModalTitle')}
        description={t('cancelModalDesc')}
        confirmLabel={t('cancelConfirm')}
        cancelLabel={t('removeCancel')}
        danger={false}
        loading={cancellingItem ? (actioning[cancellingItem.friendshipId] ?? false) : false}
        onConfirm={async () => {
          if (!cancellingItem || !token) return;
          await removeFriendship(cancellingItem.friendshipId, token);
          setCancellingItem(null);
        }}
        onCancel={() => setCancellingItem(null)}
      />

      <WebLayout active="friends" onNav={handleNav} onCreate={() => router.push('../tarefas')}>
        <div style={{ padding: '36px 40px', maxWidth: 720 }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 30, color: 'var(--dark)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>
              {t('title')}
            </div>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)', borderRadius: 14, padding: '10px 16px',
                boxShadow: 'inset 0 0 0 1.5px var(--border)',
              }}>
                <CategoryIcon name="user" size={15} color="var(--text-faint)" />
                <input
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    if (searchResult || searchError) {
                      setSearchResult(null);
                      setSearchError(null);
                      setRequestSent(false);
                    }
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder={t('searchPlaceholder')}
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: 'Nunito, sans-serif', fontSize: 14, color: 'var(--dark)',
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searchLoading || !search.trim()}
                style={{
                  border: 'none', padding: '10px 20px', borderRadius: 14,
                  background: 'var(--accent)',
                  cursor: searchLoading || !search.trim() ? 'not-allowed' : 'pointer',
                  opacity: searchLoading || !search.trim() ? 0.45 : 1,
                  fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15, color: 'var(--dark)',
                  boxShadow: '0 4px 12px rgba(255,167,0,0.25)',
                }}
              >
                {searchLoading ? '…' : t('searchBtn')}
              </button>
            </div>

            {/* Search result / error */}
            {searchError && (
              <div style={{ marginTop: 10, fontSize: 13, color: '#C0392B', fontWeight: 700, padding: '2px 4px' }}>
                {searchError}
              </div>
            )}
            {searchResult && !searchError && (
              <div style={{
                marginTop: 10,
                background: 'var(--surface)', borderRadius: 18, padding: '14px 16px',
                border: '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <UserAvatar username={searchResult.username} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15.5, color: 'var(--dark)', lineHeight: 1.2 }}>
                    @{searchResult.username}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-faint)', fontWeight: 700, marginTop: 1 }}>
                    {searchResult.name}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 800, color: '#FFB627' }}>
                      <CategoryIcon name="coin" size={11} color="#FFB627" />
                      {searchResult.commonCoins}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 800, color: 'var(--purple)' }}>
                      <CategoryIcon name="star" size={11} color="var(--purple)" />
                      {searchResult.prestige}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => router.push(`../perfil/${searchResult.username}`)}
                    style={{
                      border: 'none', cursor: 'pointer', padding: '7px 12px', borderRadius: 10,
                      background: 'var(--purple-bg)', fontFamily: 'Nunito, sans-serif',
                      fontWeight: 800, fontSize: 12, color: 'var(--purple)',
                    }}
                  >
                    {t('viewProfile')}
                  </button>
                  {requestSent ? (
                    <span style={{
                      fontSize: 12.5, fontWeight: 800, color: '#2F7A3F', textAlign: 'center',
                      background: '#D4F0D8', padding: '7px 12px', borderRadius: 10,
                    }}>
                      {t('requestSentOk')}
                    </span>
                  ) : (
                    <button
                      onClick={handleSendRequest}
                      disabled={requestSending}
                      style={{
                        border: 'none',
                        cursor: requestSending ? 'not-allowed' : 'pointer',
                        padding: '7px 14px', borderRadius: 10,
                        background: 'var(--accent)',
                        boxShadow: '0 4px 10px rgba(255,167,0,0.3), inset 0 -2px 0 rgba(0,0,0,0.07)',
                        fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--dark)',
                        opacity: requestSending ? 0.5 : 1,
                      }}
                    >
                      {requestSending ? '…' : t('sendRequest')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {([
              { id: 'friends', label: t('tabFriends'), count: friends.length },
              { id: 'pending', label: t('tabPending'), count: pendingCount },
            ] as const).map(({ id, label, count }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  border: 'none', cursor: 'pointer', padding: '9px 18px', borderRadius: 999,
                  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13,
                  background: active ? 'var(--dark)' : 'var(--surface)',
                  color: active ? 'var(--accent)' : 'var(--purple)',
                  boxShadow: active ? 'none' : 'inset 0 0 0 1.5px var(--border)',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  {label}
                  {count > 0 && (
                    <span style={{
                      background: active ? 'rgba(255,248,231,0.18)' : 'var(--purple-bg)',
                      color: active ? 'var(--accent)' : 'var(--purple)',
                      borderRadius: 999, padding: '1px 7px', fontSize: 11.5,
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Tab: Amigos ── */}
          {tab === 'friends' && (
            <>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton" style={{ height: 72, borderRadius: 18 }} />
                  ))}
                </div>
              ) : friends.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
                  <CategoryIcon name="people" size={48} color="var(--border)" />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: 'var(--dark)' }}>
                      {t('emptyFriends')}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-faint)', marginTop: 4 }}>
                      {t('emptyFriendsDesc')}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <SectionLabel count={friends.length}>{t('tabFriends')}</SectionLabel>
                  {friends.map(item => (
                    <FriendCard
                      key={item.friendshipId}
                      item={item}
                      actioning={actioning[item.friendshipId] ?? false}
                      onViewProfile={() => router.push(`../perfil/${item.user.username}`)}
                      onRemove={() => setRemovingItem(item)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Tab: Pendentes ── */}
          {tab === 'pending' && (
            <>
              {pendingLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 18 }} />)}
                </div>
              ) : pending.received.length === 0 && pending.sent.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
                  <CategoryIcon name="check" size={48} color="var(--border)" />
                  <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: 'var(--dark)', textAlign: 'center' }}>
                    {t('emptyPending')}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {pending.received.length > 0 && (
                    <div>
                      <SectionLabel count={pending.received.length}>{t('received')}</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {pending.received.map(item => (
                          <ReceivedCard
                            key={item.friendshipId}
                            item={item}
                            actioning={actioning[item.friendshipId] ?? false}
                            onAccept={() => token && acceptFriendship(item.friendshipId, token)}
                            onDecline={() => token && declineFriendship(item.friendshipId, token)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {pending.sent.length > 0 && (
                    <div>
                      <SectionLabel count={pending.sent.length}>{t('sent')}</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {pending.sent.map(item => (
                          <SentCard
                            key={item.friendshipId}
                            item={item}
                            actioning={actioning[item.friendshipId] ?? false}
                            onCancel={() => setCancellingItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </WebLayout>
    </>
  );
}
