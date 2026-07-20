'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { ViewedProfileCard, PublicTaskCard, PROFILE_TASK_FILTERS } from '@/components/profile/viewed-profile-card';
import { CategoryIcon } from '@/components/ui/icons';
import { CAT_BY_API_KEY } from '@/data/categories';
import { getUserByUsername } from '@/lib/api/users';
import { ApiError } from '@/lib/api/auth';
import type { PublicUserProfile } from '@/lib/api/users';

interface PageProps {
  params: Promise<{ username: string; locale: string }>;
}

const FILTER_LABEL_KEYS: Record<string, string> = {
  all:     'filterAll',
  ACTIVE:  'filterActive',
  EXPIRED: 'filterExpired',
};

export default function PerfilPage({ params }: PageProps) {
  const router = useRouter();
  const t = useTranslations('profile');
  const tCat = useTranslations('categories');
  const { username } = use(params);

  const [user, setUser]       = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [following, setFollowing] = useState(false);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getUserByUsername(username)
      .then(setUser)
      .catch(e => {
        if (e instanceof ApiError && e.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  const handleNav = (id: string) => {
    if (id === 'list')     router.push('../../tarefas');
    if (id === 'feed')     router.push('../../feed');
    if (id === 'settings') router.push('../../configuracoes');
    if (id === 'friends')  router.push('../../amigos');
  };

  const tasks    = user?.tasks ?? [];
  const filtered = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);

  const RightPanel = (
    <div style={{ padding: '28px 24px' }}>
      <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17, color: 'var(--dark)', marginBottom: 14 }}>
        {t('interests')}
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 28, width: 70 + i * 20, borderRadius: 999 }} />
          ))}
        </div>
      ) : (user?.interests ?? []).length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(user?.interests ?? []).map(apiKey => {
            const c = CAT_BY_API_KEY[apiKey];
            if (!c) return null;
            return (
              <span key={apiKey} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 11px 6px 6px', borderRadius: 999,
                background: c.bg, color: c.fg,
                fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12,
              }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: c.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CategoryIcon name={c.icon} size={12} color={c.bg} />
                </span>
                {tCat(c.id as Parameters<typeof tCat>[0])}
              </span>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 700 }}>{t('noInterests')}</div>
      )}

      <div style={{ marginTop: 28, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17, color: 'var(--dark)', marginBottom: 12 }}>
        {t('activity')}
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 42, borderRadius: 10 }} />)}
        </div>
      ) : (
        [
          { icon: 'star',  labelKey: 'statPrestige', val: user?.prestige     ?? 0, bg: '#EFE6FF', clr: '#5B3FA1' },
          { icon: 'coin',  labelKey: 'statCoins',    val: user?.commonCoins  ?? 0, bg: '#FFF1B5', clr: '#8B6A14' },
        ].map(s => (
          <div key={s.icon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CategoryIcon name={s.icon} size={15} color={s.clr} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)' }}>{t(s.labelKey as Parameters<typeof t>[0])}</span>
            </div>
            <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 18, color: 'var(--dark)' }}>{s.val}</span>
          </div>
        ))
      )}
    </div>
  );

  if (notFound) {
    return (
      <WebLayout active="feed" onNav={handleNav} onCreate={() => router.push('../../tarefas')}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', gap: 14 }}>
          <CategoryIcon name="user" size={48} color="var(--border)" />
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 22, color: 'var(--dark)', textAlign: 'center' }}>
            {t('notFound')}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-faint)', fontWeight: 700 }}>@{username}</div>
          <button onClick={() => router.back()} style={{
            border: 'none', cursor: 'pointer', padding: '10px 24px', borderRadius: 999,
            fontWeight: 800, fontSize: 13, background: 'var(--dark)', color: 'var(--accent)',
            fontFamily: 'Nunito, sans-serif',
          }}>
            Voltar
          </button>
        </div>
      </WebLayout>
    );
  }

  return (
    <WebLayout active="feed" onNav={handleNav} onCreate={() => router.push('../../tarefas')} rightPanel={RightPanel} rightWidth={280}>
      <div style={{ padding: '32px 32px' }}>

        {/* Back header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => router.back()} style={{
            border: 'none', cursor: 'pointer', background: 'var(--surface)',
            width: 38, height: 38, borderRadius: 19, padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1.5px var(--border)', flexShrink: 0,
          }}>
            <CategoryIcon name="back" size={18} color="var(--dark)" />
          </button>
          {loading ? (
            <div className="skeleton" style={{ height: 24, width: 120, borderRadius: 8 }} />
          ) : (
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: 'var(--dark)' }}>
              @{user?.username ?? username}
            </div>
          )}
        </div>

        {/* Profile hero card */}
        {loading ? (
          <div className="skeleton" style={{ height: 200, borderRadius: 24 }} />
        ) : user && (
          <ViewedProfileCard user={user} isFollowing={following} onToggleFollow={() => setFollowing(f => !f)} />
        )}

        {/* Tasks header */}
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 18, color: 'var(--dark)' }}>
            {t('publicTasks')}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', background: 'var(--purple-bg)', padding: '3px 8px', borderRadius: 999 }}>
            <CategoryIcon name="globe" size={11} color="var(--purple)" />
            {tasks.length}
          </div>
        </div>

        {/* Task filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {PROFILE_TASK_FILTERS.map(f => {
            const active = filter === f.id;
            const count = f.id === 'all' ? tasks.length : tasks.filter(task => task.status === f.id).length;
            const labelKey = FILTER_LABEL_KEYS[f.id] ?? 'filterAll';
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                border: 'none', cursor: 'pointer',
                padding: '7px 12px', borderRadius: 999, fontWeight: 800, fontSize: 12,
                background: active ? 'var(--dark)' : 'var(--surface)',
                color: active ? 'var(--accent)' : 'var(--purple)',
                boxShadow: active ? 'none' : 'inset 0 0 0 1.5px var(--border)',
                fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {t(labelKey as Parameters<typeof t>[0])}
                <span style={{ background: active ? 'rgba(255,217,61,0.22)' : 'var(--purple-bg)', color: active ? 'var(--accent)' : '#9A8DBA', padding: '1px 6px', borderRadius: 999, fontSize: 10.5 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tasks list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 22 }} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(task => <PublicTaskCard key={task.id} task={task} />)}
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '32px 20px', boxShadow: 'inset 0 0 0 1.5px var(--border)', textAlign: 'center' }}>
            <CategoryIcon name="lock" size={28} color="var(--border)" />
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: 'var(--purple)' }}>{t('nothingPublic')}</div>
            <div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: 'var(--text-faint)' }}>
              {t('noTasksMsg', { name: user?.name ?? username, filter: t((FILTER_LABEL_KEYS[filter] ?? 'filterAll') as Parameters<typeof t>[0]).toLowerCase() })}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '20px 0 4px', color: 'var(--text-faint)', fontSize: 12, fontWeight: 700 }}>
          {t('privateNote')}
        </div>

      </div>
    </WebLayout>
  );
}
