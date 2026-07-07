'use client';

import { useTranslations, useFormatter } from 'next-intl';
import { CategoryIcon, CategoryBadge } from '@/components/ui/icons';
import { CAT_BY_API_KEY, DODOO_CATEGORIES } from '@/data/categories';
import type { Task } from '@/lib/api/tasks';

const STATUS_META: Record<string, { bg: string; fg: string }> = {
  ACTIVE:           { bg: '#FFF8E7', fg: '#8B6A14' },
  EXPIRED:          { bg: '#F0E6E2', fg: '#8B5A3F' },
  DRAFT:            { bg: '#F4EFFF', fg: '#5B3FA1' },
  UNDER_EVALUATION: { bg: '#EFE6FF', fg: '#5B3FA1' },
  VALIDATED:        { bg: '#FFE9A8', fg: '#8B6A14' },
  COMPLETED:        { bg: '#D4F0D8', fg: '#2F7A3F' },
};

const DIFF_DOTS: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };

function DiffDots({ diff }: { diff: string }) {
  const t = useTranslations('diff');
  const dots = DIFF_DOTS[diff] ?? 1;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: 3,
          background: i <= dots ? '#5B3FA1' : '#E5DDF3',
        }} />
      ))}
      <span style={{ fontSize: 12, fontWeight: 700, color: '#5B3FA1', marginLeft: 4 }}>
        {t(diff as Parameters<typeof t>[0])}
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const t = useTranslations('status');
  const m = STATUS_META[status];
  if (!m) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
      borderRadius: 999, background: m.bg, color: m.fg,
      fontSize: 11, fontWeight: 800, letterSpacing: 0.2,
    }}>{t(status as Parameters<typeof t>[0])}</span>
  );
}

export function TaskCard({ task }: { task: Task }) {
  const t = useTranslations('tasks');
  const tRecur = useTranslations('recur');
  const fmt = useFormatter();

  const cat = CAT_BY_API_KEY[task.category] ?? DODOO_CATEGORIES[0];

  const instanceStatus = task.activeInstance?.status;
  const effectiveStatus =
    instanceStatus === 'UNDER_EVALUATION' ||
    instanceStatus === 'VALIDATED' ||
    instanceStatus === 'COMPLETED'
      ? instanceStatus
      : task.status;

  const isDone =
    effectiveStatus === 'UNDER_EVALUATION' ||
    effectiveStatus === 'VALIDATED' ||
    effectiveStatus === 'COMPLETED';

  const checklistTotal = task.goalChecklist?.length ?? 0;
  const checklistDone = task.activeInstance?.checklistProgress
    ? Object.values(task.activeInstance.checklistProgress).filter(Boolean).length
    : 0;

  const deadlineStr = task.deadline
    ? fmt.dateTime(new Date(task.deadline), { day: 'numeric', month: 'short' })
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
            textDecoration: isDone ? 'line-through' : 'none',
            opacity: isDone ? 0.55 : 1, lineHeight: 1.25,
          }}>{task.title}</div>
          {task.privacy === 'PRIVATE' && <CategoryIcon name="lock" size={14} color="#9A8DBA" />}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
          <StatusPill status={effectiveStatus} />
          {task.type === 'RECURRING' && task.recurrence && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 800, color: '#5B3FA1',
              background: '#F4EFFF', padding: '3px 8px', borderRadius: 999,
            }}>
              <CategoryIcon name="clock" size={11} color="#5B3FA1" />
              {tRecur(task.recurrence as Parameters<typeof tRecur>[0])}
            </span>
          )}
          {task.goalType === 'CHECKLIST' && checklistTotal > 0 && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#2F7A3F', background: '#E4F4E7', padding: '3px 8px', borderRadius: 999 }}>
              {t('evals', { done: checklistDone, needed: checklistTotal })}
            </span>
          )}
          {effectiveStatus === 'VALIDATED' && (task.activeInstance?.prestigeEarned ?? 0) > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 800, color: '#8B6A14' }}>
              +<CategoryIcon name="star" size={11} color="#5B3FA1" />{task.activeInstance!.prestigeEarned}
            </span>
          )}
        </div>

        {task.declaredDifficulty && (
          <div style={{ marginTop: 6 }}>
            <DiffDots diff={task.declaredDifficulty} />
          </div>
        )}

        {deadlineStr && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#7A6E94', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CategoryIcon name="calendar" size={12} color="#7A6E94" />
            {deadlineStr}
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 22,
      padding: 14, display: 'flex', gap: 12,
      border: '1.5px solid #F1ECE0',
      position: 'relative', overflow: 'hidden',
      minHeight: 90,
    }}>
      <div className="skeleton" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 }} />
      <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 14, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 16, borderRadius: 6, width: '70%' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton" style={{ height: 22, borderRadius: 999, width: 64 }} />
          <div className="skeleton" style={{ height: 22, borderRadius: 999, width: 48 }} />
        </div>
      </div>
    </div>
  );
}
