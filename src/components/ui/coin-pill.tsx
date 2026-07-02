'use client';

import { CategoryIcon } from './icons';

interface CoinPillProps {
  amount: number;
  kind?: 'common' | 'prestige';
}

export function CoinPill({ amount, kind = 'common' }: CoinPillProps) {
  const isPrestige = kind === 'prestige';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px 6px 8px', borderRadius: 999,
      background: isPrestige ? '#EFE6FF' : '#FFF1B5',
      color: isPrestige ? '#5B3FA1' : '#8B6A14',
      fontWeight: 800, fontSize: 14,
    }}>
      {isPrestige
        ? <CategoryIcon name="star" size={18} color="#5B3FA1" />
        : <CategoryIcon name="coin" size={18} color="#E5B800" />}
      <span style={{ fontFamily: 'Fredoka, sans-serif', fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
    </div>
  );
}
