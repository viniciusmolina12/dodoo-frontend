'use client';

import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function CategoryIcon({ name, size = 22, color = '#1F1530' }: IconProps) {
  const s = { width: size, height: size, display: 'block' as const };
  const stroke = {
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
  switch (name) {
    case 'heart':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path
            d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
            fill={color}
          />
        </svg>
      );
    case 'book':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <rect x="4" y="5" width="16" height="14" rx="2" fill={color} />
          <rect x="11" y="5" width="2" height="14" fill="#FFF8E7" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <rect x="3" y="8" width="18" height="12" rx="2" fill={color} />
          <rect x="9" y="5" width="6" height="3" rx="1" fill={color} />
          <rect x="3" y="13" width="18" height="1.5" fill="#FFF8E7" />
        </svg>
      );
    case 'house':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M3 11 L12 4 L21 11 V20 H3 Z" fill={color} />
          <rect x="10" y="13" width="4" height="7" fill="#FFF8E7" />
        </svg>
      );
    case 'coin':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill={color} />
          <circle cx="12" cy="12" r="6" fill="none" stroke="#FFF8E7" strokeWidth="2" />
        </svg>
      );
    case 'spark':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" fill={color} />
        </svg>
      );
    case 'moon':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M20 14a8 8 0 1 1-9-10 6 6 0 0 0 9 10Z" fill={color} />
        </svg>
      );
    case 'people':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="8" cy="9" r="3.2" fill={color} />
          <circle cx="16" cy="9" r="3.2" fill={color} />
          <path d="M2 20c0-3 2.7-5 6-5s6 2 6 5" fill={color} />
          <path d="M10 20c0-3 2.7-5 6-5s6 2 6 5" fill={color} opacity="0.7" />
        </svg>
      );
    case 'plus':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" {...stroke} />
        </svg>
      );
    case 'back':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M15 5l-7 7 7 7" {...stroke} />
        </svg>
      );
    case 'flame':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0-3 2-4 3-6Z" fill={color} />
        </svg>
      );
    case 'check':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M5 12l5 5 9-10" {...stroke} />
        </svg>
      );
    case 'check-fill':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill={color} />
          <path
            d="M7 12l3 3 7-7"
            stroke="#FFF8E7"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'circle':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'clock':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <path d="M12 7v5l3 2" {...stroke} />
        </svg>
      );
    case 'lock':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="9" rx="2" fill={color} />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth="2.2" fill="none" />
        </svg>
      );
    case 'globe':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill={color} />
          <path
            d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"
            stroke="#FFF8E7"
            strokeWidth="1.4"
            fill="none"
          />
        </svg>
      );
    case 'star':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path
            d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"
            fill={color}
          />
        </svg>
      );
    case 'tag':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M3 12 12 3h8v8l-9 9z" fill={color} />
          <circle cx="16" cy="8" r="1.5" fill="#FFF8E7" />
        </svg>
      );
    case 'camera':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="13" rx="2" fill={color} />
          <circle cx="12" cy="13.5" r="3.5" fill="#FFF8E7" />
          <rect x="9" y="5" width="6" height="3" rx="1" fill={color} />
        </svg>
      );
    case 'chevron-r':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" {...stroke} />
        </svg>
      );
    case 'chevron-d':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M5 9l7 7 7-7" {...stroke} />
        </svg>
      );
    case 'list':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="5" cy="6" r="1.5" fill={color} />
          <circle cx="5" cy="12" r="1.5" fill={color} />
          <circle cx="5" cy="18" r="1.5" fill={color} />
          <path d="M10 6h11M10 12h11M10 18h11" {...stroke} />
        </svg>
      );
    case 'home':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M3 11 L12 4 L21 11 V20 H3 Z" fill={color} />
        </svg>
      );
    case 'trophy':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M7 4h10v5a5 5 0 0 1-10 0Z" fill={color} />
          <rect x="9" y="16" width="6" height="3" fill={color} />
          <path
            d="M5 6H3v2a3 3 0 0 0 4 2M19 6h2v2a3 3 0 0 1-4 2"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    case 'user':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <circle cx="12" cy="9" r="4" fill={color} />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" fill={color} />
        </svg>
      );
    case 'eye':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" fill={color} />
          <circle cx="12" cy="12" r="3" fill="#FFF8E7" />
        </svg>
      );
    case 'text':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M5 7h14M5 12h14M5 17h9" {...stroke} />
        </svg>
      );
    case 'dash':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <path d="M7 12h10" {...stroke} />
        </svg>
      );
    case 'calendar':
      return (
        <svg style={s} viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="15" rx="2" fill={color} />
          <rect x="3" y="6" width="18" height="4" fill={color} opacity="0.7" />
          <rect x="7" y="3" width="2" height="5" rx="1" fill={color} />
          <rect x="15" y="3" width="2" height="5" rx="1" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

interface BadgeProps {
  cat: { id: string; name: string; bg: string; fg: string; icon: string };
  size?: number;
  withLabel?: boolean;
}

export function CategoryBadge({ cat, size = 40, withLabel = false }: BadgeProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.32,
          background: cat.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CategoryIcon name={cat.icon} size={size * 0.55} color={cat.fg} />
      </div>
      {withLabel && <div style={{ fontWeight: 700, color: cat.fg, fontSize: 14 }}>{cat.name}</div>}
    </div>
  );
}
