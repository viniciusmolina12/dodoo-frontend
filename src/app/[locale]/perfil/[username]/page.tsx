'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { ViewedProfileCard, PublicTaskCard, PROFILE_TASK_FILTERS } from '@/components/profile/viewed-profile-card';
import { CategoryIcon } from '@/components/ui/icons';
import { CAT_BY_ID } from '@/data/categories';
import { getOtherUser } from '@/data/users';

interface PageProps {
  params: Promise<{ username: string; locale: string }>;
}

const FILTER_LABEL_KEYS: Record<string, string> = {
  all:           'filterAll',
  ativa:         'filterActive',
  'em-avaliacao':'filterInReview',
  validada:      'filterValidated',
};

export default function PerfilPage({ params }: PageProps) {
  const router = useRouter();
  const t = useTranslations('profile');
  const tCat = useTranslations('categories');
  const { username } = use(params);
  const user = getOtherUser(username.charAt(0).toUpperCase() + username.slice(1));

  const [following, setFollowing] = useState(false);
  const [filter, setFilter] = useState('all');

  const tasks = user.publicTasks || [];
  const filtered = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);

  const handleNav = (id: string) => {
    if (id === 'list')     router.push('../../tarefas');
    if (id === 'feed')     router.push('../../feed');
    if (id === 'settings') router.push('../../configuracoes');
  };

  const RightPanel = (
    <div style={{ padding: '28px 24px' }}>
      <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17, color: '#1F1530', marginBottom: 14 }}>
        {t('interests')}
      </div>
      {user.interests.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {user.interests.map(id => {
            const c = CAT_BY_ID[id];
            if (!c) return null;
            return (
              <span key={id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 11px 6px 6px', borderRadius: 999,
                background: c.bg, color: c.fg,
                fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12,
              }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: c.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CategoryIcon name={c.icon} size={12} color={c.bg} />
                </span>
                {tCat(id as Parameters<typeof tCat>[0])}
              </span>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: '#9A8DBA', fontWeight: 700 }}>{t('noInterests')}</div>
      )}

      <div style={{ marginTop: 28, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17, color: '#1F1530', marginBottom: 12 }}>
        {t('activity')}
      </div>
      {[
        { icon: 'star',  labelKey: 'statPrestige', val: user.stats.prestige,            bg: '#EFE6FF', clr: '#5B3FA1' },
        { icon: 'coin',  labelKey: 'statCoins',    val: user.stats.coins,               bg: '#FFF1B5', clr: '#8B6A14' },
        { icon: 'flame', labelKey: 'statStreak',   val: `${user.stats.streak}d`,        bg: '#FFD9D2', clr: '#C0392B' },
        { icon: 'check', labelKey: 'statValidated',val: user.stats.validated,           bg: '#D4F0D8', clr: '#2F7A3F' },
      ].map(s => (
        <div key={s.icon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1.5px solid #F4F0E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CategoryIcon name={s.icon} size={15} color={s.clr} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#5A4E70' }}>{t(s.labelKey as Parameters<typeof t>[0])}</span>
          </div>
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 18, color: '#1F1530' }}>{s.val}</span>
        </div>
      ))}
    </div>
  );

  return (
    <WebLayout active="feed" onNav={handleNav} onCreate={() => router.push('../../tarefas')} rightPanel={RightPanel} rightWidth={280}>
      <div style={{ padding: '32px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => router.back()} style={{
            border: 'none', cursor: 'pointer', background: '#FFFFFF',
            width: 38, height: 38, borderRadius: 19, padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1.5px #F1ECE0', flexShrink: 0,
          }}>
            <CategoryIcon name="back" size={18} color="#1F1530" />
          </button>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: '#1F1530' }}>
            @{user.handle}
          </div>
        </div>

        <ViewedProfileCard user={user} isFollowing={following} onToggleFollow={() => setFollowing(f => !f)} />

        <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 18, color: '#1F1530' }}>
            {t('publicTasks')}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', background: '#F4EFFF', padding: '3px 8px', borderRadius: 999 }}>
            <CategoryIcon name="globe" size={11} color="#5B3FA1" />
            {tasks.length}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {PROFILE_TASK_FILTERS.map(f => {
            const active = filter === f.id;
            const count = f.id === 'all' ? tasks.length : tasks.filter(task => task.status === f.id).length;
            const labelKey = FILTER_LABEL_KEYS[f.id] ?? 'filterAll';
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                border: 'none', cursor: 'pointer',
                padding: '7px 12px', borderRadius: 999, fontWeight: 800, fontSize: 12,
                background: active ? '#1F1530' : '#FFFFFF',
                color: active ? '#FFD93D' : '#5B3FA1',
                boxShadow: active ? 'none' : 'inset 0 0 0 1.5px #F1ECE0',
                fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {t(labelKey as Parameters<typeof t>[0])}
                <span style={{ background: active ? 'rgba(255,217,61,0.22)' : '#F4EFFF', color: active ? '#FFD93D' : '#9A8DBA', padding: '1px 6px', borderRadius: 999, fontSize: 10.5 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length > 0 ? (
            filtered.map(task => <PublicTaskCard key={task.id} task={task} />)
          ) : (
            <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '32px 20px', boxShadow: 'inset 0 0 0 1.5px #F1ECE0', textAlign: 'center' }}>
              <CategoryIcon name="lock" size={28} color="#C7BDE6" />
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: '#7A6E94' }}>{t('nothingPublic')}</div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: '#9A8DBA' }}>
                {t('noTasksMsg', { name: user.name, filter: t((FILTER_LABEL_KEYS[filter] ?? 'filterAll') as Parameters<typeof t>[0]).toLowerCase() })}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0 4px', color: '#9A8DBA', fontSize: 12, fontWeight: 700 }}>
          {t('privateNote')}
        </div>
      </div>
    </WebLayout>
  );
}
