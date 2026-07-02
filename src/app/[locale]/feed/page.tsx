'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { FeedCard } from '@/components/feed/feed-card';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { FEED_TASKS } from '@/data/feed';

type FeedFilter = 'my-cats' | 'all' | 'saude' | 'estudos' | 'casa' | 'criativa';

function WebFeedSidepanel({ submitted }: { submitted: Record<string, boolean> }) {
  const t = useTranslations('feed');
  const earned = Object.keys(submitted).length * 2;
  const remaining = FEED_TASKS.length - Object.keys(submitted).length;
  return (
    <div style={{ padding: '28px 24px' }}>
      <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 18, color: '#1F1530', marginBottom: 18 }}>
        {t('sessionTitle')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { icon: 'eye',   label: t('waiting'),        val: remaining,                     bg: '#FFE9A8', fg: '#8B6A14' },
          { icon: 'check', label: t('evaluatedToday'),  val: Object.keys(submitted).length, bg: '#D4F0D8', fg: '#2F7A3F' },
          { icon: 'coin',  label: t('coinsEarned'),     val: `+${earned}`,                  bg: '#FFF1B5', fg: '#8B6A14' },
        ].map(s => (
          <div key={s.icon} style={{ background: '#FAF7EE', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'inset 0 0 0 1.5px #F1ECE0' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CategoryIcon name={s.icon} size={18} color={s.fg} />
            </div>
            <div>
              <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: '#1F1530', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#9A8DBA', fontWeight: 800, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#EFE6FF', borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <DodooMascot size={38} />
        <div style={{ fontSize: 12.5, color: '#5B3FA1', fontWeight: 700, lineHeight: 1.4 }}>
          {t('tip')}
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const t = useTranslations('feed');
  const tCat = useTranslations('categories');
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FeedFilter>('my-cats');
  const remaining = FEED_TASKS.length - Object.keys(submitted).length;

  const FEED_FILTERS: { id: FeedFilter; label: string }[] = [
    { id: 'my-cats',  label: t('filterMyCategories') },
    { id: 'all',      label: t('filterAll')          },
    { id: 'saude',    label: tCat('saude')            },
    { id: 'estudos',  label: tCat('estudos')          },
    { id: 'casa',     label: tCat('casa')             },
    { id: 'criativa', label: tCat('criativa')         },
  ];

  const handleNav = (id: string) => {
    if (id === 'list') router.push('tarefas');
    if (id === 'settings') router.push('configuracoes');
  };

  const handleSubmit = (id: string) => setSubmitted(s => ({ ...s, [id]: true }));

  return (
    <WebLayout
      active="feed"
      onNav={handleNav}
      onCreate={() => router.push('tarefas')}
      rightPanel={<WebFeedSidepanel submitted={submitted} />}
      rightWidth={300}
    >
      <div style={{ padding: '36px 40px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 30, color: '#1F1530', letterSpacing: '-0.02em' }}>
            {t('pageTitle')}
          </div>
          <div style={{ fontSize: 13.5, color: '#7A6E94', fontWeight: 700, marginTop: 4 }}>
            {t('subtitle', { count: remaining })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {FEED_FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 999,
                fontWeight: 800, fontSize: 13,
                background: active ? '#1F1530' : '#FFFFFF', color: active ? '#FFD93D' : '#5B3FA1',
                boxShadow: active ? 'none' : 'inset 0 0 0 1.5px #F1ECE0',
                fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap',
              }}>{f.label}</button>
            );
          })}
        </div>

        <div style={{ maxWidth: 680 }}>
          {FEED_TASKS.map(task => (
            <FeedCard
              key={task.id}
              task={task}
              onSubmit={handleSubmit}
              submitted={!!submitted[task.id]}
              onUserClick={name => router.push(`perfil/${name.toLowerCase()}`)}
            />
          ))}
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#9A8DBA', fontSize: 12, fontWeight: 700 }}>
            {t('allDone')}
          </div>
        </div>
      </div>
    </WebLayout>
  );
}
