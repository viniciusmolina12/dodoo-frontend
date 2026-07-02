'use client';

import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { CategoryBadge } from '@/components/ui/icons';
import { CAT_BY_ID } from '@/data/categories';
import { DIFF_META, STATUS_META, type Task } from '@/data/tasks';

const RECUR_KEY: Record<string, string> = {
  'diária': 'diaria',
  'semanal': 'semanal',
  'mensal': 'mensal',
};

export function DiffDots({ diff }: { diff: string }) {
  const t = useTranslations('diff');
  const d = DIFF_META[diff as keyof typeof DIFF_META];
  if (!d) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: 3,
          background: i <= d.dots ? '#5B3FA1' : '#E5DDF3',
        }} />
      ))}
      <span style={{ fontSize: 12, fontWeight: 700, color: '#5B3FA1', marginLeft: 4 }}>
        {t(diff as Parameters<typeof t>[0])}
      </span>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const t = useTranslations('status');
  const m = STATUS_META[status as keyof typeof STATUS_META];
  if (!m) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
      borderRadius: 999, background: m.bg, color: m.fg,
      fontSize: 11, fontWeight: 800, letterSpacing: 0.2,
    }}>{t(status as Parameters<typeof t>[0])}</span>
  );
}

interface TaskCardProps {
  task: Task;
  onComplete?: (id: Task['id']) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const t = useTranslations('tasks');
  const tRecur = useTranslations('recur');
  const cat = CAT_BY_ID[task.cat];
  const done = task.status === 'concluida' || task.status === 'validada' || task.status === 'em-avaliacao';
  const checklistDone = task.goal?.kind === 'checklist' ? task.goal.items.filter(Boolean).length : 0;
  const checklistTotal = task.goal?.kind === 'checklist' ? task.goal.items.length : 0;

  const recurLabel = task.recur
    ? (() => {
        const key = RECUR_KEY[task.recur];
        return key ? tRecur(key as Parameters<typeof tRecur>[0]) : task.recur;
      })()
    : null;

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 22,
      padding: 14, display: 'flex', gap: 12,
      boxShadow: '0 1px 0 rgba(31,21,48,0.04), 0 6px 18px rgba(91,63,161,0.06)',
      border: '1.5px solid #F1ECE0',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: cat.fg, opacity: 0.85 }} />

      <CategoryBadge cat={cat} size={42} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontWeight: 800, fontSize: 15, color: '#1F1530',
            textDecoration: done ? 'line-through' : 'none',
            opacity: done ? 0.55 : 1, lineHeight: 1.25,
          }}>{task.title}</div>
          {task.private && <CategoryIcon name="lock" size={14} color="#9A8DBA" />}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
          <StatusPill status={task.status} />
          {task.type === 'recorrente' && recurLabel && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 800, color: '#5B3FA1',
              background: '#F4EFFF', padding: '3px 8px', borderRadius: 999,
            }}>
              <CategoryIcon name="clock" size={11} color="#5B3FA1" />
              {recurLabel}
            </span>
          )}
          {task.goal?.kind === 'checklist' && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#2F7A3F', background: '#E4F4E7', padding: '3px 8px', borderRadius: 999 }}>
              {checklistDone}/{checklistTotal}
            </span>
          )}
          {task.status === 'em-avaliacao' && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#5B3FA1' }}>
              {t('evals', { done: task.evals ?? 0, needed: task.evalsNeeded ?? 5 })}
            </span>
          )}
          {task.status === 'validada' && task.prestige && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 800, color: '#8B6A14' }}>
              +<CategoryIcon name="star" size={11} color="#5B3FA1" />{task.prestige}
            </span>
          )}
        </div>

        {task.deadline && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#7A6E94', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CategoryIcon name="calendar" size={12} color="#7A6E94" />
            {task.deadline}
          </div>
        )}
      </div>

      <button
        onClick={() => onComplete?.(task.id)}
        aria-label={done ? t('markedDone') : t('markDone')}
        style={{
          alignSelf: 'flex-start', marginTop: 2,
          width: 32, height: 32, borderRadius: 16,
          border: 'none', cursor: 'pointer', padding: 0,
          background: done ? '#FFD93D' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {done
          ? <CategoryIcon name="check" size={18} color="#1F1530" />
          : <div style={{ width: 24, height: 24, borderRadius: 12, border: '2.4px solid #C7BDE6' }} />}
      </button>
    </div>
  );
}
