'use client';

import { useTranslations } from 'next-intl';
import { CategoryIcon, CategoryBadge } from '@/components/ui/icons';
import { CAT_BY_API_KEY, DODOO_CATEGORIES } from '@/data/categories';
import type { PublicUserProfile, ProfileTask } from '@/lib/api/users';

function usernameColors(username: string): { fg: string; bg: string } {
  const hue = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return {
    fg: `hsl(${hue}, 50%, 35%)`,
    bg: `hsl(${hue}, 60%, 84%)`,
  };
}

function StatCell({ value, label, icon }: { value: string | number; label: string; icon: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <CategoryIcon name={icon} size={13} color="#FFD93D" />
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
  user: PublicUserProfile;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export function ViewedProfileCard({ user, isFollowing, onToggleFollow }: ViewedProfileCardProps) {
  const t = useTranslations('profile');
  const { fg, bg } = usernameColors(user.username);

  return (
    <div style={{
      background: `linear-gradient(135deg, ${fg} 0%, ${fg}D9 100%)`,
      borderRadius: 24, padding: 18, color: '#FFF8E7',
      position: 'relative', overflow: 'hidden',
      boxShadow: `0 8px 22px ${fg}40`,
    }}>
      <div style={{ position: 'absolute', top: -40, right: -30, width: 130, height: 130, borderRadius: 65, background: `${bg}55` }} />
      <div style={{ position: 'absolute', bottom: -50, left: -20, width: 110, height: 110, borderRadius: 55, background: 'rgba(255,255,255,0.06)' }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 40,
            background: bg, color: fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 34,
            border: '4px solid rgba(255,248,231,0.95)',
            boxShadow: `0 4px 12px rgba(0,0,0,0.18), 0 0 0 4px #FFD93D33`,
          }}>{(user.name || '?')[0]?.toUpperCase()}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, lineHeight: 1.1 }}>{user.name}</div>
          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 700, marginTop: 2 }}>@{user.username}</div>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: 0, marginTop: 14, padding: '12px 0 0', borderTop: '1.5px dashed rgba(255,217,61,0.35)' }}>
        <StatCell value={user.prestige}    label={t('statPrestige')} icon="star"  />
        <Sep />
        <StatCell value={user.commonCoins} label={t('statCoins')}    icon="coin"  />
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
  { id: 'all'    },
  { id: 'ACTIVE' },
  { id: 'EXPIRED'},
];

const TASK_STATUS_META: Record<string, { bg: string; fg: string; labelKey: string }> = {
  ACTIVE:  { bg: '#FFF8E7', fg: '#8B6A14', labelKey: 'ACTIVE'  },
  EXPIRED: { bg: '#F0E6E2', fg: '#8B5A3F', labelKey: 'EXPIRED' },
};

export function PublicTaskCard({ task }: { task: ProfileTask }) {
  const tStatus = useTranslations('status');
  const cat = CAT_BY_API_KEY[task.category] ?? DODOO_CATEGORIES[0];
  const sm = TASK_STATUS_META[task.status] ?? TASK_STATUS_META.ACTIVE;

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 22, padding: 14, display: 'flex', gap: 12,
      boxShadow: '0 1px 0 rgba(31,21,48,0.04), 0 6px 18px rgba(91,63,161,0.06)',
      border: '1.5px solid var(--border)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: cat.fg, opacity: 0.85 }} />
      <CategoryBadge cat={cat} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, fontWeight: 800, fontSize: 15, color: 'var(--dark)', lineHeight: 1.25 }}>
            {task.title}
          </div>
          <CategoryIcon name="globe" size={13} color="var(--text-faint)" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 999, background: sm.bg, color: sm.fg, fontSize: 11, fontWeight: 800 }}>
            {tStatus(sm.labelKey as Parameters<typeof tStatus>[0])}
          </span>
          {task.type === 'RECURRING' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800, color: 'var(--purple)', background: 'var(--purple-bg)', padding: '3px 8px', borderRadius: 999 }}>
              <CategoryIcon name="clock" size={11} color="var(--purple)" />
              Recorrente
            </span>
          )}
          {task.goalType !== 'NONE' && task.goalText && (
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', background: 'var(--surface-alt)', padding: '3px 8px', borderRadius: 999 }}>
              {task.goalText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
