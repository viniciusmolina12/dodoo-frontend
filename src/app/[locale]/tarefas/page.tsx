'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { TaskCard, TaskCardSkeleton } from '@/components/tasks/task-card';
import { WebCreatePanel } from '@/components/tasks/create-panel';
import { WebEditPanel } from '@/components/tasks/edit-panel';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { CategoryIcon } from '@/components/ui/icons';
import { CoinPill } from '@/components/ui/coin-pill';
import { useAuthStore } from '@/stores/auth-store';
import { useTasksStore } from '@/stores/tasks-store';
import { useState } from 'react';
import type { Task } from '@/lib/api/tasks';

type FilterId = 'all' | 'active' | 'recurring' | 'in-review' | 'validated';

function WebStreakBanner({ days }: { days: number }) {
  const t = useTranslations('tasks');
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFD93D 0%, #FFB627 100%)',
      borderRadius: 18, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 4px 14px rgba(255,167,0,0.2)',
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0, background: 'rgba(255,248,231,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

function applyFilter(tasks: Task[], filter: FilterId): Task[] {
  if (filter === 'all') return tasks;
  if (filter === 'active') return tasks.filter(t => t.status === 'ACTIVE' && t.activeInstance?.status === 'ACTIVE');
  if (filter === 'recurring') return tasks.filter(t => t.type === 'RECURRING');
  if (filter === 'in-review') return tasks.filter(t => t.activeInstance?.status === 'UNDER_EVALUATION');
  if (filter === 'validated') return tasks.filter(t => t.activeInstance?.status === 'VALIDATED');
  return tasks;
}

export default function TarefasPage() {
  const router = useRouter();
  const t      = useTranslations('tasks');
  const format = useFormatter();

  const [filter,       setFilter]       = useState<FilterId>('all');
  const [showCreate,   setShowCreate]   = useState(false);
  const [editingTask,  setEditingTask]  = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => setMounted(true), []);

  const user  = useAuthStore(s => s.user);
  const token = useAuthStore(s => s.token);
  const displayUser = mounted ? user : null;
  const firstName   = displayUser?.name.split(' ')[0] ?? '...';

  const { tasks, isLoading, error, completing, deleting, fetchTasks, completeTask, deleteTask } = useTasksStore();

  const openCreate = () => { setEditingTask(null); setShowCreate(true); };
  const openEdit   = (task: Task) => { setShowCreate(false); setEditingTask(task); };
  const closePanel = () => { setShowCreate(false); setEditingTask(null); };

  const handleDeleteConfirm = async () => {
    if (!deletingTask || !token) return;
    await deleteTask(deletingTask.id, token);
    setDeletingTask(null);
  };

  useEffect(() => {
    if (mounted && token) fetchTasks(token);
  }, [mounted, token, fetchTasks]);

  const WEB_FILTERS: { id: FilterId; label: string }[] = [
    { id: 'all',       label: t('all')       },
    { id: 'active',    label: t('active')    },
    { id: 'recurring', label: t('recurring') },
    { id: 'in-review', label: t('inReview')  },
    { id: 'validated', label: t('validated') },
  ];

  const filtered = applyFilter(tasks, filter);

  const handleNav = (id: string) => {
    if (id === 'feed')     router.push('feed');
    if (id === 'trophy')   router.push('conquistas');
    if (id === 'settings') router.push('configuracoes');
    if (id === 'friends')  router.push('amigos');
  };

  const dateStr = format.dateTime(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
    <ConfirmModal
      open={!!deletingTask}
      title="Excluir tarefa?"
      description="Essa ação é permanente e não pode ser desfeita."
      confirmLabel="Sim, excluir"
      cancelLabel="Cancelar"
      danger
      loading={deletingTask ? (deleting[deletingTask.id] ?? false) : false}
      onConfirm={handleDeleteConfirm}
      onCancel={() => setDeletingTask(null)}
    />
    <WebLayout
      active="list"
      onNav={handleNav}
      onCreate={openCreate}
      rightPanel={
        showCreate ? (
          <WebCreatePanel
            onClose={closePanel}
            onCreated={() => { closePanel(); if (token) fetchTasks(token); }}
          />
        ) : editingTask ? (
          <WebEditPanel
            task={editingTask}
            onClose={closePanel}
            onSaved={() => { closePanel(); if (token) fetchTasks(token); }}
            onDeleted={closePanel}
          />
        ) : undefined
      }
      rightWidth={440}
    >
      <div style={{ padding: '36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
              {dateStr}
            </div>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 30, color: 'var(--dark)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t('greeting', { name: firstName })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <CoinPill amount={displayUser?.commonCoins ?? 0} kind="common" />
            <CoinPill amount={displayUser?.prestige     ?? 0} kind="prestige" />
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
                background: active ? 'var(--dark)' : 'var(--surface)', color: active ? 'var(--accent)' : 'var(--purple)',
                boxShadow: active ? 'none' : 'inset 0 0 0 1.5px var(--border)',
                fontFamily: 'Nunito, sans-serif',
              }}>{f.label}</button>
            );
          })}
        </div>

        {isLoading ? (
          <>
            <div style={{ marginBottom: 14, fontSize: 11.5, fontWeight: 800, color: 'var(--text-faint)', letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.4 }}>
              &nbsp;
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 460px))', gap: 12, alignItems: 'start' }}>
              {Array.from({ length: 4 }).map((_, i) => <TaskCardSkeleton key={i} />)}
            </div>
          </>
        ) : error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 14 }}>
            <CategoryIcon name="alert" size={36} color="#C0392B" />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#C0392B', textAlign: 'center' }}>{error}</div>
            <button
              onClick={() => token && fetchTasks(token)}
              style={{
                border: 'none', cursor: 'pointer', padding: '10px 24px', borderRadius: 999,
                fontWeight: 800, fontSize: 13, background: 'var(--dark)', color: 'var(--accent)',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              {t('retry')}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 14 }}>
            <CategoryIcon name="list" size={48} color="#E5DDF3" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: 'var(--dark)' }}>
                {t('emptyTitle')}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-faint)', marginTop: 4 }}>
                {t('emptyDesc')}
              </div>
            </div>
            {filter === 'all' && (
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  border: 'none', cursor: 'pointer', padding: '10px 24px', borderRadius: 999,
                  fontWeight: 800, fontSize: 13, background: 'var(--dark)', color: 'var(--accent)',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {t('createFirst')}
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 14, fontSize: 11.5, fontWeight: 800, color: 'var(--text-faint)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {t('count', { count: filtered.length })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 460px))', gap: 12, alignItems: 'start' }}>
              {filtered.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  completing={completing[task.id] ?? false}
                  onComplete={token ? (cp) => completeTask(task.id, token, cp) : undefined}
                  onEdit={() => openEdit(task)}
                  onDelete={() => setDeletingTask(task)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </WebLayout>
    </>
  );
}
