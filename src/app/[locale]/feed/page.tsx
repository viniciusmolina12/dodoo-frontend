'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { FeedCard } from '@/components/feed/feed-card';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { CAT_BY_API_KEY } from '@/data/categories';
import { useAuthStore } from '@/stores/auth-store';
import { getFeed, type FeedItem } from '@/lib/api/feed';

const COINS_PER_EVAL = 5;

export default function FeedPage() {
  const router = useRouter();
  const t = useTranslations('feed');

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = useAuthStore(s => s.user);
  const token = useAuthStore(s => s.token);
  const displayUser = mounted ? user : null;
  const displayToken = mounted ? token : null;

  const [items, setItems] = useState<FeedItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [evaluatedCount, setEvaluatedCount] = useState(0);

  const fetchFeed = useCallback(
    async (cursor?: string) => {
      if (!displayToken) return;
      const isLoadMore = !!cursor;
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await getFeed(displayToken, cursor);
        setItems(prev => (isLoadMore ? [...prev, ...res.items] : res.items));
        setNextCursor(res.nextCursor);
      } catch (e) {
        setError(e instanceof Error ? e.message : t('loadError'));
      } finally {
        if (isLoadMore) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [displayToken, t],
  );

  useEffect(() => {
    if (mounted && displayToken) fetchFeed();
  }, [mounted, displayToken, fetchFeed]);

  const handleEvaluated = (instanceId: string) => {
    setItems(prev => prev.filter(i => i.instanceId !== instanceId));
    setEvaluatedCount(c => c + 1);
  };

  const handleSkip = (instanceId: string) => {
    setItems(prev => prev.filter(i => i.instanceId !== instanceId));
  };

  const handleNav = (id: string) => {
    if (id === 'list') router.push('tarefas');
    if (id === 'trophy') router.push('conquistas');
    if (id === 'settings') router.push('configuracoes');
    if (id === 'friends') router.push('amigos');
  };

  const interestFilters = (displayUser?.interests ?? [])
    .map(key => {
      const cat = CAT_BY_API_KEY[key];
      return cat ? ({ key: String(key), label: cat.name } as { key: string; label: string }) : null;
    })
    .filter((x): x is { key: string; label: string } => x !== null);

  const allFilters = [{ key: 'all', label: t('filterAll') }, ...interestFilters];

  const filteredItems =
    filter === 'all' ? items : items.filter(i => i.task.category === filter);

  const coinsEarned = evaluatedCount * COINS_PER_EVAL;

  const RightPanel = (
    <div style={{ padding: '28px 24px' }}>
      <div
        style={{
          fontFamily: 'Fredoka, sans-serif',
          fontWeight: 600,
          fontSize: 18,
          color: 'var(--dark)',
          marginBottom: 18,
        }}
      >
        {t('sessionTitle')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {(
          [
            { icon: 'eye',   label: t('waiting'),        val: items.length,      bg: '#FFE9A8', fg: '#8B6A14' },
            { icon: 'check', label: t('evaluatedToday'), val: evaluatedCount,    bg: '#D4F0D8', fg: '#2F7A3F' },
            { icon: 'coin',  label: t('coinsEarned'),    val: `+${coinsEarned}`, bg: '#FFF1B5', fg: '#8B6A14' },
          ] as const
        ).map(s => (
          <div
            key={s.icon}
            style={{
              background: 'var(--surface-alt)',
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: 'inset 0 0 0 1.5px var(--border)',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CategoryIcon name={s.icon} size={18} color={s.fg} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 600,
                  fontSize: 20,
                  color: 'var(--dark)',
                  lineHeight: 1,
                }}
              >
                {s.val}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: 'var(--purple-bg)',
          borderRadius: 16,
          padding: '14px 16px',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}
      >
        <DodooMascot size={38} />
        <div style={{ fontSize: 12.5, color: 'var(--purple)', fontWeight: 700, lineHeight: 1.4 }}>
          {t('tip')}
        </div>
      </div>
    </div>
  );

  return (
    <WebLayout
      active="feed"
      onNav={handleNav}
      onCreate={() => router.push('tarefas')}
      rightPanel={RightPanel}
      rightWidth={300}
    >
      <div className="px-10 py-9">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ fontFamily: 'Fredoka, sans-serif', color: 'var(--dark)' }}
          >
            {t('pageTitle')}
          </h1>
          <p className="text-sm font-bold mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('subtitle', { count: items.length })}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span
            className="text-xs font-extrabold uppercase tracking-wider mr-1"
            style={{ color: 'var(--text-faint)' }}
          >
            {t('filterMyCategories')}
          </span>
          {allFilters.map(f => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3.5 py-2 rounded-full text-sm font-extrabold transition-all duration-150 whitespace-nowrap"
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'var(--dark)' : 'var(--surface)',
                  color: active ? 'var(--accent)' : 'var(--purple)',
                  boxShadow: active ? 'none' : 'inset 0 0 0 1.5px var(--border)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Feed */}
        <div className="max-w-[680px]">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton rounded-2xl h-52" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-sm font-bold mb-3" style={{ color: '#C0392B' }}>{error}</p>
              <button
                onClick={() => fetchFeed()}
                className="px-4 py-2 rounded-xl text-sm font-extrabold"
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  background: 'var(--purple-bg)',
                  color: 'var(--purple)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {t('retry')}
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm font-extrabold" style={{ color: 'var(--text-faint)' }}>
                {t('allDone')}
              </p>
            </div>
          ) : (
            <>
              {filteredItems.map(item => (
                <FeedCard
                  key={item.instanceId}
                  item={item}
                  token={displayToken ?? ''}
                  onEvaluated={() => handleEvaluated(item.instanceId)}
                  onSkip={() => handleSkip(item.instanceId)}
                />
              ))}

              {nextCursor && (
                <div className="text-center py-4">
                  <button
                    onClick={() => fetchFeed(nextCursor)}
                    disabled={loadingMore}
                    className="px-6 py-2.5 rounded-full text-sm font-extrabold transition-all"
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      border: 'none',
                      cursor: loadingMore ? 'not-allowed' : 'pointer',
                      background: 'var(--dark)',
                      color: 'var(--accent)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                      opacity: loadingMore ? 0.7 : 1,
                    }}
                  >
                    {loadingMore ? '…' : t('loadMore')}
                  </button>
                </div>
              )}

              {!nextCursor && (
                <div
                  className="text-center py-5 text-xs font-extrabold"
                  style={{ color: 'var(--text-faint)' }}
                >
                  {t('allDone')}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </WebLayout>
  );
}
