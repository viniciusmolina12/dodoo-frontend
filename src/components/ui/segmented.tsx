'use client';

import { CategoryIcon } from './icons';

interface SegOption {
  value: string;
  label: string;
  icon?: string;
}

interface SegmentedProps {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div style={{
      display: 'inline-flex', padding: 4, borderRadius: 14,
      background: '#F4EFFF', gap: 2,
    }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              border: 'none', cursor: 'pointer',
              padding: '7px 16px', borderRadius: 11,
              background: active ? '#FFFFFF' : 'transparent',
              color: active ? '#5B3FA1' : '#9A8DBA',
              fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: active ? '0 1px 3px rgba(91,63,161,0.12)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {o.icon && <CategoryIcon name={o.icon} size={13} color={active ? '#5B3FA1' : '#9A8DBA'} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
