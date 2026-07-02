'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { CategoryBadge } from '@/components/ui/icons';
import { CoinPill } from '@/components/ui/coin-pill';
import { CAT_BY_ID } from '@/data/categories';
import { DIFF_META } from '@/data/tasks';
import type { FeedTask, Attachment } from '@/data/feed';

function Avatar({ name, color, fg, size = 36 }: { name: string; color: string; fg: string; size?: number }) {
  const initial = (name || '?').trim()[0]?.toUpperCase() || '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: color, color: fg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: size * 0.45,
      boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.06)',
    }}>{initial}</div>
  );
}

const TONES: Record<string, [string, string]> = {
  mint:   ['#B8E6D4', '#6BCFA5'],
  peach:  ['#FFD9C2', '#FFB088'],
  sky:    ['#C2DFFF', '#88AEDD'],
  rose:   ['#FFD2E0', '#E289B0'],
  lemon:  ['#FFEFAA', '#FFD060'],
  lilac:  ['#DDD0FF', '#A88FE3'],
  dusk:   ['#7857C8', '#3A2868'],
  forest: ['#7BB89D', '#2F6B4F'],
};

function AttachmentImage({ tone = 'mint', caption }: { tone?: string; caption?: string; motif?: string }) {
  const [a, b] = TONES[tone] ?? TONES.mint;
  return (
    <div style={{
      flex: 1, aspectRatio: '1', borderRadius: 14, minWidth: 0,
      background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
      position: 'relative', overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35)',
    }}>
      <div style={{ position: 'absolute', top: '15%', left: '12%', width: '45%', aspectRatio: '1', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
      {caption && (
        <div style={{
          position: 'absolute', bottom: 5, left: 5, right: 5,
          padding: '3px 6px', borderRadius: 6,
          background: 'rgba(31,21,48,0.6)', color: '#FFF8E7',
          fontSize: 9.5, fontFamily: 'monospace', fontWeight: 700,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>📷 {caption}</div>
      )}
    </div>
  );
}

function AttachmentDoc({ name, size, ext = 'PDF' }: { name: string; size?: string; ext?: string }) {
  const colors: Record<string, string> = { PDF: '#E0245E', DOC: '#2E5BB0', XLS: '#2F7A3F' };
  return (
    <div style={{
      flex: 1, aspectRatio: '1', borderRadius: 14, background: '#FFF8E7',
      boxShadow: 'inset 0 0 0 1.5px #F1ECE0', minWidth: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: 10,
    }}>
      <div style={{
        width: 30, height: 36, borderRadius: 4,
        background: colors[ext] ?? '#5B3FA1', color: '#FFF8E7',
        fontSize: 9, fontWeight: 800, fontFamily: 'Fredoka, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{ext}</div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 800, color: '#1F1530', lineHeight: 1.15, marginBottom: 2 }}>{name}</div>
        {size && <div style={{ fontSize: 9, color: '#9A8DBA', fontFamily: 'monospace' }}>{size}</div>}
      </div>
    </div>
  );
}

function AttachmentText({ text }: { text: string }) {
  return (
    <div style={{
      flex: 1, aspectRatio: '1', borderRadius: 14, minWidth: 0,
      background: 'linear-gradient(135deg, #FFF1B5 0%, #FFE08A 100%)',
      boxShadow: 'inset 0 0 0 1.5px rgba(229,184,0,0.3)',
      padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{
        fontFamily: 'Fredoka, sans-serif', fontWeight: 500, fontSize: 11,
        color: '#1F1530', lineHeight: 1.3,
        display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      } as React.CSSProperties}>"{text}"</div>
      <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: '#8B6A14' }}>NOTA</div>
    </div>
  );
}

function AttachmentRow({ items }: { items: Attachment[] }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
      {items.slice(0, 5).map((a, i) => {
        if (a.kind === 'image') return <AttachmentImage key={i} tone={a.tone} caption={a.caption} motif={a.motif} />;
        if (a.kind === 'doc')   return <AttachmentDoc   key={i} name={a.name} size={a.size} ext={a.ext} />;
        if (a.kind === 'text')  return <AttachmentText  key={i} text={a.text} />;
        return null;
      })}
    </div>
  );
}

function RatingDots({ value, onChange, max = 5 }: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value;
        return (
          <button key={i} onClick={() => onChange(i + 1)} style={{
            border: 'none', cursor: 'pointer', padding: 0,
            width: 30, height: 30, borderRadius: 15,
            background: filled ? '#FFD93D' : '#FFFFFF',
            boxShadow: filled ? 'inset 0 -2px 0 rgba(0,0,0,0.08), 0 2px 4px rgba(255,167,0,0.25)' : 'inset 0 0 0 2px #F1ECE0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {filled && <CategoryIcon name="star" size={14} color="#1F1530" />}
          </button>
        );
      })}
    </div>
  );
}

function DifficultyRel({ value, onChange, t }: { value: string | null; onChange: (v: string) => void; t: ReturnType<typeof useTranslations> }) {
  const opts = [
    { v: 'easier', label: t('easier'), tone: '#D4F0D8', fg: '#2F7A3F' },
    { v: 'same',   label: t('same'),   tone: '#FFF1B5', fg: '#8B6A14' },
    { v: 'harder', label: t('harder'), tone: '#FFD9D2', fg: '#C0392B' },
  ];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {opts.map(o => {
        const active = value === o.v;
        return (
          <button key={o.v} onClick={() => onChange(o.v)} style={{
            flex: 1, border: 'none', cursor: 'pointer',
            padding: '9px 4px', borderRadius: 12,
            background: active ? o.tone : '#FFFFFF',
            color: active ? o.fg : '#9A8DBA',
            boxShadow: active ? `inset 0 0 0 2px ${o.fg}` : 'inset 0 0 0 1.5px #F1ECE0',
            fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12,
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function EvalRow({ label, hint, children, last }: { label: string; hint?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ paddingBottom: last ? 0 : 12, marginBottom: last ? 0 : 12, borderBottom: last ? 'none' : '1.5px dashed rgba(91,63,161,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 14, color: '#1F1530' }}>{label}</div>
        {hint && <div style={{ fontSize: 10.5, color: '#9A8DBA', fontWeight: 700 }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

interface FeedCardProps {
  task: FeedTask;
  onSubmit?: (id: string, data: unknown) => void;
  submitted?: boolean;
  onUserClick?: (name: string) => void;
}

export function FeedCard({ task, onSubmit, submitted, onUserClick }: FeedCardProps) {
  const t = useTranslations('feed');
  const tDiff = useTranslations('diff');
  const cat = CAT_BY_ID[task.cat];
  const [effort, setEffort] = useState(0);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [result, setResult] = useState(0);
  const hasGoal = !!task.goal;
  const checklistDone = task.goal?.kind === 'checklist' ? task.goal.items.filter(Boolean).length : 0;
  const checklistTotal = task.goal?.kind === 'checklist' ? task.goal.items.length : 0;
  const diffMeta = DIFF_META[task.diff as keyof typeof DIFF_META];
  const diffLabel = diffMeta ? tDiff(task.diff as Parameters<typeof tDiff>[0]) : task.diff;
  const ready = effort > 0 && difficulty !== null && (!hasGoal || result > 0);

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 24, padding: 16, marginBottom: 12,
      boxShadow: '0 1px 0 rgba(31,21,48,0.04), 0 6px 18px rgba(91,63,161,0.06)',
      border: '1.5px solid #F1ECE0',
      opacity: submitted ? 0.65 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onUserClick?.(task.user.name)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, textAlign: 'left' }}
        >
          <Avatar name={task.user.name} color={task.user.color} fg={task.user.fg} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1F1530', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {task.user.name}
              <CategoryIcon name="chevron-r" size={12} color="#C7BDE6" />
            </div>
            <div style={{ fontSize: 11.5, color: '#9A8DBA', fontWeight: 700 }}>{t('completed', { time: task.completedAt })}</div>
          </div>
        </button>
        {cat && <CategoryBadge cat={cat} size={34} />}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 500, fontSize: 17, color: '#1F1530', lineHeight: 1.25 }}>
          {task.title}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1' }}>{t('declared', { diff: diffLabel })}</span>
          {task.goal?.kind === 'checklist' && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#2F7A3F', background: '#E4F4E7', padding: '3px 8px', borderRadius: 999 }}>
              {t('doneItems', { done: checklistDone, total: checklistTotal })}
            </span>
          )}
        </div>
      </div>

      {task.goal?.kind === 'texto' && (
        <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 12, background: '#FAF7EE', boxShadow: 'inset 0 0 0 1.5px #F1ECE0', fontSize: 12.5, color: '#5B3FA1', fontWeight: 700 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#9A8DBA', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 }}>{t('goalLabel')}</div>
          {task.goal.text}
        </div>
      )}

      {task.note && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#1F1530', lineHeight: 1.4, fontWeight: 600 }}>{task.note}</div>
      )}

      {task.attachments && task.attachments.length > 0 && <AttachmentRow items={task.attachments} />}

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderTop: '1.5px dashed #F1ECE0' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#9A8DBA' }}>
          {t('evalsCollected', { done: task.evals, needed: task.evalsNeeded })}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800, color: '#8B6A14' }}>
          {t('youEarn')} <CoinPill amount={2} kind="common" />
        </div>
      </div>

      {submitted ? (
        <div style={{ marginTop: 10, padding: '12px 14px', borderRadius: 16, background: '#D4F0D8', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: '#2F7A3F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CategoryIcon name="check" size={16} color="#FFF8E7" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#2F7A3F' }}>{t('submittedTitle')}</div>
            <div style={{ fontSize: 11, color: '#2F7A3F', fontWeight: 700 }}>{t('submittedCoins')}</div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, padding: 14, borderRadius: 18, background: '#FAF7EE', boxShadow: 'inset 0 0 0 1.5px #F1ECE0' }}>
          <EvalRow label={t('effort')} hint={t('effortHint')}>
            <RatingDots value={effort} onChange={setEffort} />
          </EvalRow>
          <EvalRow label={t('difficulty')} hint={t('diffHint', { diff: diffLabel.toLowerCase() })}>
            <DifficultyRel value={difficulty} onChange={setDifficulty} t={t} />
          </EvalRow>
          {hasGoal && (
            <EvalRow label={t('result')} hint={t('resultHint')} last>
              <RatingDots value={result} onChange={setResult} />
            </EvalRow>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => onSubmit?.(task.id, 'skip')} style={{
              border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 14,
              background: 'transparent', color: '#9A8DBA',
              fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13,
            }}>{t('skip')}</button>
            <button
              disabled={!ready}
              onClick={() => onSubmit?.(task.id, { effort, difficulty, result })}
              style={{
                flex: 1, border: 'none', cursor: ready ? 'pointer' : 'not-allowed',
                padding: '12px 14px', borderRadius: 14,
                background: ready ? '#FFD93D' : '#F1ECE0',
                color: ready ? '#1F1530' : '#9A8DBA',
                fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15,
                boxShadow: ready ? '0 4px 12px rgba(255,167,0,0.35), inset 0 -2px 0 rgba(0,0,0,0.08)' : 'none',
              }}>
              {t('submitEval')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
