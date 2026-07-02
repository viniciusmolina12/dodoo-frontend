'use client';

import { CategoryIcon } from '@/components/ui/icons';

interface StreakBannerProps {
  days?: number;
}

export function StreakBanner({ days = 7 }: StreakBannerProps) {
  return (
    <div style={{
      position: 'relative', borderRadius: 24, overflow: 'hidden',
      background: 'linear-gradient(135deg, #FFD93D 0%, #FFB627 100%)',
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 4px 14px rgba(255,167,0,0.25)',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 26,
        background: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}>
        <CategoryIcon name="flame" size={30} color="#E5650F" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, lineHeight: 1, color: '#3A2206' }}>
          {days} dias seguidos!
        </div>
        <div style={{ fontSize: 12, color: '#5C3A0E', marginTop: 4, fontWeight: 600 }}>
          Mais 3 dias até a próxima conquista
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} style={{
              flex: 1, height: 5, borderRadius: 3,
              background: i < days ? '#3A2206' : 'rgba(58,34,6,0.18)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
