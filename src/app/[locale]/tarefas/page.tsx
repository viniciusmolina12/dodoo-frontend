'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { TaskCard } from '@/components/tasks/task-card';
import { WebCreatePanel } from '@/components/tasks/create-panel';
import { CategoryIcon } from '@/components/ui/icons';
import { CoinPill } from '@/components/ui/coin-pill';
import { SAMPLE_TASKS, type Task } from '@/data/tasks';

type FilterId = 'today' | 'recurring' | 'in-review' | 'validated' | 'all';

function WebStreakBanner({ days }: { days: number }) {
  const t = useTranslations('tasks');
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFD93D 0%, #FFB627 100%)',
      borderRadius: 18, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 4px 14px rgba(255,167,0,0.2)',
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0, background: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CategoryIcon name="flame" size={26} color="#E5650F" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17, color: '#3A2206' }}>
          {t('streakBanner', { days, remaining: 10 - days })}
        </div>
        <div style={{ display: 'flex', gap: 3, marginTop: 7 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < days ? '#3A2206' : 'rgba(58,34,6,0.16)' }} />
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(58,34,6,0.13)', borderRadius: 12, padding: '8px 14px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12.5, color: '#3A2206', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <CategoryIcon name="trophy" size={14} color="#3A2206" />
        {t('streakProtection')}
      </div>
    </div>
  );
}

export default function TarefasPage() {
  const router = useRouter();
  const t = useTranslations('tasks');
  const format = useFormatter();
  const [filter, setFilter] = useState<FilterId>('today');
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [showCreate, setShowCreate] = useState(false);

  const WEB_FILTERS: { id: FilterId; label: string }[] = [
    { id: 'today',     label: t('today')     },
    { id: 'recurring', label: t('recurring') },
    { id: 'in-review', label: t('inReview')  },
    { id: 'validated', label: t('validated') },
    { id: 'all',       label: t('all')       },
  ];

  const filtered = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'recurring') return task.type === 'recorrente';
    if (filter === 'in-review') return task.status === 'em-avaliacao';
    if (filter === 'validated') return task.status === 'validada';
    return task.status === 'ativa' || task.status === 'concluida';
  });

  const completeTask = (id: Task['id']) => setTasks(ts => ts.map(task =>
    task.id === id ? { ...task, status: task.status === 'ativa' ? 'em-avaliacao' as const : 'ativa' as const, evals: 0, evalsNeeded: 5 } : task
  ));

  const handleNav = (id: string) => {
    if (id === 'feed') router.push('feed');
    if (id === 'settings') router.push('configuracoes');
  };

  const dateStr = format.dateTime(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <WebLayout
      active="list"
      onNav={handleNav}
      onCreate={() => setShowCreate(true)}
      rightPanel={showCreate ? <WebCreatePanel onClose={() => setShowCreate(false)} /> : undefined}
      rightWidth={440}
    >
      <div style={{ padding: '36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: '#9A8DBA', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
              {dateStr}
            </div>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 30, color: '#1F1530', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t('greeting', { name: 'Lia' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <CoinPill amount={240} kind="common" />
            <CoinPill amount={87} kind="prestige" />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <WebStreakBanner days={7} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {WEB_FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                border: 'none', cursor: 'pointer', padding: '9px 16px', borderRadius: 999,
                fontWeight: 800, fontSize: 13,
                background: active ? '#1F1530' : '#FFFFFF', color: active ? '#FFD93D' : '#5B3FA1',
                boxShadow: active ? 'none' : 'inset 0 0 0 1.5px #F1ECE0',
                fontFamily: 'Nunito, sans-serif',
              }}>{f.label}</button>
            );
          })}
        </div>

        <div style={{ marginBottom: 14, fontSize: 11.5, fontWeight: 800, color: '#9A8DBA', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {t('count', { count: filtered.length })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 460px))', gap: 12 }}>
          {filtered.map(task => <TaskCard key={task.id} task={task} onComplete={completeTask} />)}
        </div>
      </div>
    </WebLayout>
  );
}
