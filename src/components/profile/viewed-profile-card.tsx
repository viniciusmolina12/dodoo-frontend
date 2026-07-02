'use client';

import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { CategoryBadge } from '@/components/ui/icons';
import { CAT_BY_ID } from '@/data/categories';
import { DIFF_META, STATUS_META, type Task } from '@/data/tasks';
import type { OtherUser } from '@/data/users';

const RECUR_KEY: Record<string, string> = {
  'diária': 'diaria',
  'semanal': 'semanal',
  'mensal': 'mensal',
};

function StatCell({ value, label, icon, fg }: { value: string | number; label: string; icon: string; fg: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <CategoryIcon name={icon} size={13} color={fg} />
        <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 18, color: '#FFF8E7', lineHeight: 1 }}>{value}</span>
      </div>
      <div style={{ fontSize: 10.5, color: 'rgba(255,248,231,0.6)', fontWeight: 800 }}>{label}</div>
    </div>
  );
}

function Sep() {
  return <div style={{ width: 1, background: 'rgba(255,217,61,0.2)', height: 36, alignSelf: 'center' }} />;
}

interface ViewedProfileCardProps {
  user: OtherUser;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export function ViewedProfileCard({ user, isFollowing, onToggleFollow }: ViewedProfileCardProps) {
  const t = useTranslations('profile');
  return (
    <div style={{
      background: `linear-gradient(135deg, ${user.fg} 0%, ${user.fg}D9 100%)`,
      borderRadius: 24, padding: 18, color: '#FFF8E7',
      position: 'relative', overflow: 'hidden',
      boxShadow: `0 8px 22px ${user.fg}40`,
    }}>
      <div style={{ position: 'absolute', top: -40, right: -30, width: 130, height: 130, borderRadius: 65, background: `${user.color}55` }} />
      <div style={{ position: 'absolute', bottom: -50, left: -20, width: 110, height: 110, borderRadius: 55, background: 'rgba(255,255,255,0.06)' }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 40,
            background: user.color, color: user.fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 34,
            border: '4px solid rgba(255,248,231,0.95)',
            boxShadow: `0 4px 12px rgba(0,0,0,0.18), 0 0 0 4px #FFD93D33`,
          }}>{(user.name || '?')[0]?.toUpperCase()}</div>
          <div style={{
            position: 'absolute', bottom: -2, right: -4,
            background: '#1F1530', color: '#FFD93D',
            padding: '3px 8px', borderRadius: 999,
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 11,
            border: `2px solid ${user.fg}`,
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <CategoryIcon name="star" size={10} color="#FFD93D" />
            nv {user.level}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, lineHeight: 1.1 }}>{user.name}</div>
          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 700, marginTop: 2 }}>@{user.handle}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6,
            padding: '4px 10px', background: 'rgba(255,217,61,0.22)', borderRadius: 999,
            fontSize: 11, fontWeight: 800, color: '#FFD93D',
            boxShadow: 'inset 0 0 0 1px rgba(255,217,61,0.3)',
          }}>
            <CategoryIcon name="trophy" size={10} color="#FFD93D" />
            {user.title}
          </div>
        </div>
      </div>

      {user.bio && (
        <div style={{ position: 'relative', marginTop: 12, fontSize: 12.5, lineHeight: 1.4, fontWeight: 700, color: 'rgba(255,248,231,0.92)' }}>
          {user.bio}
        </div>
      )}

      <div style={{ position: 'relative', display: 'flex', gap: 0, marginTop: 14, padding: '12px 0 0', borderTop: '1.5px dashed rgba(255,217,61,0.35)' }}>
        <StatCell value={user.stats.prestige}       label={t('statPrestige')} icon="star"  fg="#FFD93D" />
        <Sep />
        <StatCell value={`${user.stats.streak}d`}   label={t('statStreak')}   icon="flame" fg="#FFD93D" />
        <Sep />
        <StatCell value={user.stats.validated}       label={t('statValidated')} icon="check" fg="#FFD93D" />
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={onToggleFollow} style={{
          flex: 1, border: 'none', cursor: 'pointer',
          padding: '11px 14px', borderRadius: 14,
          background: isFollowing ? 'rgba(255,255,255,0.16)' : '#FFD93D',
          color: isFollowing ? '#FFF8E7' : '#1F1530',
          fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 14,
          boxShadow: isFollowing ? 'inset 0 0 0 1.5px rgba(255,217,61,0.35)' : '0 4px 10px rgba(255,167,0,0.28), inset 0 -2px 0 rgba(0,0,0,0.08)',
        }}>
          {isFollowing ? t('following') : t('follow')}
        </button>
        <button style={{
          width: 44, height: 44, borderRadius: 14, padding: 0, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.16)', color: '#FFF8E7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 0 0 1.5px rgba(255,217,61,0.35)',
        }}>
          <CategoryIcon name="text" size={18} color="#FFF8E7" />
        </button>
      </div>
    </div>
  );
}

export const PROFILE_TASK_FILTERS: { id: string }[] = [
  { id: 'all'          },
  { id: 'ativa'        },
  { id: 'em-avaliacao' },
  { id: 'validada'     },
];

function DiffDots({ diff }: { diff: string }) {
  const t = useTranslations('diff');
  const d = DIFF_META[diff as keyof typeof DIFF_META];
  if (!d) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i <= d.dots ? '#5B3FA1' : '#E5DDF3' }} />
      ))}
      <span style={{ fontSize: 12, fontWeight: 700, color: '#5B3FA1', marginLeft: 4 }}>
        {t(diff as Parameters<typeof t>[0])}
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const t = useTranslations('status');
  const m = STATUS_META[status as keyof typeof STATUS_META];
  if (!m) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 999, background: m.bg, color: m.fg, fontSize: 11, fontWeight: 800 }}>
      {t(status as Parameters<typeof t>[0])}
    </span>
  );
}

export function PublicTaskCard({ task }: { task: Task }) {
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
      background: '#FFFFFF', borderRadius: 22, padding: 14, display: 'flex', gap: 12,
      boxShadow: '0 1px 0 rgba(31,21,48,0.04), 0 6px 18px rgba(91,63,161,0.06)',
      border: '1.5px solid #F1ECE0', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: cat.fg, opacity: 0.85 }} />
      <CategoryBadge cat={cat} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, fontWeight: 800, fontSize: 15, color: '#1F1530', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1, lineHeight: 1.25 }}>
            {task.title}
          </div>
          <CategoryIcon name="globe" size={13} color="#9A8DBA" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
          <StatusPill status={task.status} />
          <DiffDots diff={task.diff} />
          {task.type === 'recorrente' && recurLabel && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800, color: '#5B3FA1', background: '#F4EFFF', padding: '3px 8px', borderRadius: 999 }}>
              <CategoryIcon name="clock" size={11} color="#5B3FA1" />{recurLabel}
            </span>
          )}
          {task.goal?.kind === 'checklist' && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#2F7A3F', background: '#E4F4E7', padding: '3px 8px', borderRadius: 999 }}>
              {checklistDone}/{checklistTotal}
            </span>
          )}
          {task.status === 'em-avaliacao' && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#5B3FA1' }}>{task.evals ?? 0}/{task.evalsNeeded ?? 5} avaliações</span>
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
    </div>
  );
}
