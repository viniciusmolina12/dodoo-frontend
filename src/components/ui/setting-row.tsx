'use client';

import { CategoryIcon } from './icons';

interface SettingRowProps {
  icon: string;
  iconBg: string;
  iconFg: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  chevron?: boolean;
  last?: boolean;
  onClick?: () => void;
}

export function SettingRow({ icon, iconBg, iconFg, title, subtitle, right, chevron = true, last, onClick }: SettingRowProps) {
  const inner = (
    <>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <CategoryIcon name={icon} size={17} color={iconFg} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13.5, color: '#1F1530' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11.5, color: '#9A8DBA', fontWeight: 700, marginTop: 1 }}>{subtitle}</div>}
      </div>
      {right ?? (chevron && <CategoryIcon name="chevron-r" size={16} color="#C4B8D8" />)}
    </>
  );

  const rowStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 0',
    borderBottom: last ? 'none' : '1.5px solid #F4F0E5',
    display: 'flex', alignItems: 'center', gap: 12,
  };

  if (onClick) {
    return (
      <button onClick={onClick} style={{ ...rowStyle, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left', borderBottom: last ? 'none' : '1.5px solid #F4F0E5' }}>
        {inner}
      </button>
    );
  }

  return <div style={rowStyle}>{inner}</div>;
}
