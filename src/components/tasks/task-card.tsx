'use client';

import { useState } from 'react';
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

interface TaskCardProps {
  task: Task;
  completing?: boolean;
  onComplete?: (checklistProgress?: Record<string, boolean>) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, completing = false, onComplete, onEdit, onDelete }: TaskCardProps) {
  const t = useTranslations('tasks');
  const tRecur = useTranslations('recur');
  const tStatus = useTranslations('status');
  const tDiff = useTranslations('diff');
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

  const isCompletable = instanceStatus === 'ACTIVE' && !!onComplete;
  const isEditable =
    !!onEdit &&
    effectiveStatus !== 'UNDER_EVALUATION' &&
    effectiveStatus !== 'COMPLETED' &&
    effectiveStatus !== 'VALIDATED';
  // tarefas concluídas/validadas: só excluir, sem editar
  const isDeleteOnly =
    !!onDelete &&
    !isEditable &&
    (effectiveStatus === 'UNDER_EVALUATION' ||
     effectiveStatus === 'COMPLETED' ||
     effectiveStatus === 'VALIDATED');
  const isChecklist = task.goalType === 'CHECKLIST' && (task.goalChecklist?.length ?? 0) > 0;

  const [expanded, setExpanded] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((task.goalChecklist ?? []).map((_, i) => [String(i), false]))
  );

  const checklistTotal = task.goalChecklist?.length ?? 0;
  const checklistDone = Object.values(checks).filter(Boolean).length;

  const statusMeta = STATUS_META[effectiveStatus];
  const diffDots = task.declaredDifficulty ? (DIFF_DOTS[task.declaredDifficulty] ?? 1) : null;

  const deadlineStr = task.deadline
    ? fmt.dateTime(new Date(task.deadline), { day: 'numeric', month: 'short' })
    : null;

  const handleComplete = () => onComplete?.(isChecklist ? checks : undefined);

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 18,
      padding: '10px 12px', display: 'flex', flexDirection: 'column',
      boxShadow: '0 1px 0 rgba(31,21,48,0.04), 0 4px 12px rgba(91,63,161,0.06)',
      border: '1.5px solid var(--border)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: cat.fg, opacity: 0.85 }} />

      <div
        style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: isChecklist && isCompletable ? 'pointer' : 'default' }}
        onClick={isChecklist && isCompletable ? () => setExpanded(e => !e) : undefined}
      >
        <CategoryBadge cat={cat} size={34} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{
              fontWeight: 800, fontSize: 13.5, color: 'var(--dark)', lineHeight: 1.3,
              textDecoration: isDone ? 'line-through' : 'none',
              opacity: isDone ? 0.5 : 1, flex: 1,
            }}>{task.title}</span>
            {task.privacy === 'PRIVATE' && <CategoryIcon name="lock" size={12} color="#9A8DBA" />}
          </div>

          {/* Meta row: status + recurrence + checklist + diff + prestige */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5, alignItems: 'center' }}>
            {statusMeta && (
              <span style={{
                padding: '2px 7px', borderRadius: 999,
                background: statusMeta.bg, color: statusMeta.fg,
                fontSize: 10.5, fontWeight: 800,
              }}>
                {tStatus(effectiveStatus as Parameters<typeof tStatus>[0])}
              </span>
            )}

            {task.type === 'RECURRING' && task.recurrence && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 10.5, fontWeight: 800, color: 'var(--purple)',
                background: 'var(--purple-bg)', padding: '2px 7px', borderRadius: 999,
              }}>
                <CategoryIcon name="clock" size={10} color="#5B3FA1" />
                {tRecur(task.recurrence as Parameters<typeof tRecur>[0])}
              </span>
            )}

            {isChecklist && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 800, color: '#2F7A3F', background: '#E4F4E7', padding: '2px 7px', borderRadius: 999 }}>
                {checklistDone}/{checklistTotal}
                <span style={{ fontSize: 8, opacity: 0.7 }}>{expanded ? '▲' : '▼'}</span>
              </span>
            )}

            {diffDots !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, marginLeft: 2 }}>
                {[1, 2, 3].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: 3, background: i <= diffDots ? 'var(--purple)' : 'var(--border)' }} />
                ))}
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--purple)', marginLeft: 3 }}>
                  {tDiff(task.declaredDifficulty! as Parameters<typeof tDiff>[0])}
                </span>
              </span>
            )}

            {effectiveStatus === 'VALIDATED' && (task.activeInstance?.prestigeEarned ?? 0) > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10.5, fontWeight: 800, color: '#8B6A14' }}>
                +<CategoryIcon name="star" size={10} color="#5B3FA1" />{task.activeInstance!.prestigeEarned}
              </span>
            )}

            {deadlineStr && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, marginLeft: 'auto' }}>
                <CategoryIcon name="calendar" size={10} color="var(--text-muted)" />
                {deadlineStr}
              </span>
            )}
          </div>
        </div>

        {/* Edit button (tarefas editáveis) */}
        {isEditable && (
          <button
            onClick={e => { e.stopPropagation(); onEdit?.(); }}
            aria-label="Editar tarefa"
            style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: 9, border: 'none',
              background: 'var(--purple-bg)', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CategoryIcon name="pen" size={12} color="var(--purple)" />
          </button>
        )}

        {/* Delete button (tarefas concluídas/em validação/validadas) */}
        {isDeleteOnly && (
          <button
            onClick={e => { e.stopPropagation(); onDelete?.(); }}
            aria-label="Excluir tarefa"
            style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: 9, border: 'none',
              background: '#FFF0EE', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CategoryIcon name="trash" size={12} color="#C0392B" />
          </button>
        )}

        {/* Complete button (non-checklist) */}
        {isCompletable && !isChecklist && (
          <button
            onClick={handleComplete}
            disabled={completing}
            aria-label={t('markDone')}
            style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: 14,
              border: 'none', cursor: completing ? 'default' : 'pointer', padding: 0,
              background: 'transparent', opacity: completing ? 0.4 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 10, border: '2px solid #C7BDE6' }} />
          </button>
        )}
      </div>

      {/* Checklist expand — grid-rows trick allows transition on height:auto */}
      {isChecklist && isCompletable && (
        <div style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.28s ease',
        }}>
          <div style={{ overflow: 'hidden' }}>
            <div
              onClick={e => e.stopPropagation()}
              style={{ paddingTop: 8, paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 5 }}
            >
              {task.goalChecklist!.map((item, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checks[String(i)] ?? false}
                    onChange={e => setChecks(prev => ({ ...prev, [String(i)]: e.target.checked }))}
                    style={{ accentColor: '#5B3FA1', width: 13, height: 13, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 12, color: checks[String(i)] ? 'var(--text-faint)' : 'var(--dark)', textDecoration: checks[String(i)] ? 'line-through' : 'none' }}>
                    {item}
                  </span>
                </label>
              ))}
              <button
                onClick={handleComplete}
                disabled={completing}
                style={{
                  alignSelf: 'flex-start', marginTop: 4, marginBottom: 4,
                  border: 'none', cursor: completing ? 'default' : 'pointer',
                  padding: '6px 14px', borderRadius: 999,
                  fontWeight: 800, fontSize: 11.5, background: 'var(--dark)', color: 'var(--accent)',
                  fontFamily: 'Nunito, sans-serif', opacity: completing ? 0.5 : 1,
                }}
              >
                {completing ? '...' : t('markDone')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 18,
      padding: '10px 12px', display: 'flex', gap: 10,
      border: '1.5px solid var(--border)',
      position: 'relative', overflow: 'hidden',
      minHeight: 72,
    }}>
      <div className="skeleton" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 }} />
      <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 14, borderRadius: 5, width: '65%' }} />
        <div style={{ display: 'flex', gap: 5 }}>
          <div className="skeleton" style={{ height: 18, borderRadius: 999, width: 56 }} />
          <div className="skeleton" style={{ height: 18, borderRadius: 999, width: 40 }} />
        </div>
      </div>
    </div>
  );
}
