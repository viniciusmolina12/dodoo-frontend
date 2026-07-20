'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { CAT_BY_API_KEY, DODOO_CATEGORIES } from '@/data/categories';
import { submitEvaluation, type FeedItem } from '@/lib/api/feed';

const DIFF_KEY: Record<string, 'facil' | 'medio' | 'dificil'> = {
  EASY: 'facil', MEDIUM: 'medio', HARD: 'dificil',
};

function timeAgo(dateStr: string, locale: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (mins < 60) return rtf.format(-mins, 'minute');
  const hours = Math.floor(mins / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  return rtf.format(-Math.floor(hours / 24), 'day');
}

interface FeedCardProps {
  item: FeedItem;
  token: string;
  onEvaluated: () => void;
  onSkip: () => void;
}

export function FeedCard({ item, token, onEvaluated, onSkip }: FeedCardProps) {
  const t = useTranslations('feed');
  const tDiff = useTranslations('diff');
  const locale = useLocale();

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cat = CAT_BY_API_KEY[item.task.category] ?? DODOO_CATEGORIES[0];
  const hue = [...item.task.owner.username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const diffKey = item.task.declaredDifficulty ? DIFF_KEY[item.task.declaredDifficulty] : null;

  const hasGoal =
    !!item.task.goalText ||
    (Array.isArray(item.task.goalChecklist) && item.task.goalChecklist.length > 0);

  const handleSubmit = async () => {
    if (score === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitEvaluation(item.taskId, item.instanceId, score, comment, token);
      onEvaluated();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar avaliação');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.06)',
      }}
    >
      {/* Category accent */}
      <div className="h-1" style={{ background: cat.fg }} />

      <div className="p-5">
        {/* User + time */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: `hsl(${hue},60%,84%)`,
              color: `hsl(${hue},50%,35%)`,
              fontFamily: 'Fredoka, sans-serif',
            }}
          >
            {item.task.owner.username[0].toUpperCase()}
          </div>
          <div className="text-sm">
            <span className="font-extrabold" style={{ color: 'var(--dark)' }}>
              @{item.task.owner.username}
            </span>
            <span className="font-bold" style={{ color: 'var(--text-faint)' }}>
              {' · '}{t('completed', { time: timeAgo(item.completedAt, locale) })}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-xl font-semibold mb-2 leading-tight"
          style={{ fontFamily: 'Fredoka, sans-serif', color: 'var(--dark)' }}
        >
          {item.task.title}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="text-xs font-extrabold px-2.5 py-1 rounded-full"
            style={{ background: cat.bg, color: cat.fg }}
          >
            {cat.name}
          </span>
          {diffKey && (
            <span
              className="text-xs font-extrabold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}
            >
              {t('declared', { diff: tDiff(diffKey) })}
            </span>
          )}
        </div>

        {/* Goal — cat.bg is always a light pastel, so text stays #1F1530 for contrast */}
        {hasGoal && (
          <div className="rounded-xl p-3 mb-3" style={{ background: cat.bg }}>
            <div
              className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5"
              style={{ color: cat.fg }}
            >
              {t('goalLabel')}
            </div>
            {item.task.goalText && (
              <p className="text-sm font-bold" style={{ color: '#1F1530' }}>
                {item.task.goalText}
              </p>
            )}
            {Array.isArray(item.task.goalChecklist) && (
              <ul className="space-y-1">
                {item.task.goalChecklist.map((text, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold" style={{ color: '#1F1530' }}>
                    <span className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: cat.fg }} />
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Description */}
        {item.task.description && (
          <p className="text-sm font-semibold mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {item.task.description}
          </p>
        )}

        {/* Eval count + reward */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderTop: '1.5px dashed var(--border)',
            marginTop: 12,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)' }}>
            {t('evalsCollected', { done: item.evaluationCount, needed: item.evaluationsNeeded })}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800, color: '#8B6A14' }}>
            {t('youEarn')}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                background: 'rgba(255,185,0,0.18)',
                borderRadius: 999,
                padding: '2px 7px 2px 4px',
              }}
            >
              <CategoryIcon name="coin" size={13} color="#FFB627" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#8B6A14' }}>+5</span>
            </span>
          </div>
        </div>

        {/* Evaluation form */}
        <div
          style={{
            marginTop: 10,
            padding: 14,
            borderRadius: 18,
            background: 'var(--surface-alt)',
            boxShadow: 'inset 0 0 0 1.5px var(--border)',
          }}
        >
          {/* Effort */}
          <div
            style={{
              paddingBottom: 12,
              marginBottom: 12,
              borderBottom: '1.5px dashed var(--border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'var(--dark)',
                }}
              >
                {t('effort')}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-faint)', fontWeight: 700 }}>
                {t('effortHint')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(i => {
                const filled = i <= score;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setScore(score === i ? 0 : i)}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      background: filled ? 'var(--accent)' : 'var(--surface)',
                      boxShadow: filled
                        ? 'inset 0 -2px 0 rgba(0,0,0,0.08), 0 2px 4px rgba(255,167,0,0.25)'
                        : 'inset 0 0 0 2px var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {filled && <CategoryIcon name="star" size={14} color="#1F1530" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: 14 }}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={t('commentPlaceholder')}
              rows={2}
              style={{
                fontFamily: 'Nunito, sans-serif',
                width: '100%',
                fontSize: 13,
                borderRadius: 12,
                border: '1.5px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--dark)',
                padding: '8px 12px',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, fontWeight: 700, color: '#C0392B', marginBottom: 8 }}>
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={onSkip}
              disabled={submitting}
              style={{
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                padding: '12px 14px',
                borderRadius: 14,
                background: 'transparent',
                color: 'var(--text-faint)',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 13,
                opacity: submitting ? 0.5 : 1,
              }}
            >
              {t('skip')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={score === 0 || submitting}
              style={{
                flex: 1,
                border: 'none',
                cursor: score > 0 && !submitting ? 'pointer' : 'not-allowed',
                padding: '12px 14px',
                borderRadius: 14,
                background: score > 0 ? 'var(--accent)' : 'var(--border)',
                color: score > 0 ? '#1F1530' : 'var(--text-faint)',
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                boxShadow:
                  score > 0
                    ? '0 4px 12px rgba(255,167,0,0.35), inset 0 -2px 0 rgba(0,0,0,0.08)'
                    : 'none',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? '…' : t('submitEval')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
