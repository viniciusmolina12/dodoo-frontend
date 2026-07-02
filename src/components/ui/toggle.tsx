'use client';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onChange, disabled }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={value}
      disabled={disabled}
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 26, borderRadius: 13, border: 'none', cursor: disabled ? 'default' : 'pointer',
        background: value ? '#5B3FA1' : '#D8D0E8',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
        boxShadow: value ? '0 2px 6px rgba(91,63,161,0.35)' : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 20, height: 20, borderRadius: 10,
        background: '#FFFFFF', transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }} />
    </button>
  );
}
