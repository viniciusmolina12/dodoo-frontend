'use client';

import { CategoryIcon } from './icons';

interface CoinCostProps {
  amount: number;
  owned: boolean;
}

export function CoinCost({ amount, owned }: CoinCostProps) {
  if (owned) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 7px', borderRadius: 999, background: '#D4F0D8',
        color: '#2F7A3F', fontSize: 10, fontWeight: 800,
      }}>
        <CategoryIcon name="check" size={9} color="#2F7A3F" />
        Meu
      </div>
    );
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 7px', borderRadius: 999, background: '#FFF1B5',
      color: '#8B6A14', fontSize: 10, fontWeight: 800,
    }}>
      <CategoryIcon name="coin" size={10} color="#E5B800" />
      {amount}
    </div>
  );
}
