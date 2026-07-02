'use client';

import { useState } from 'react';
import { CategoryIcon } from './icons';

interface AuthInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: string;
  placeholder?: string;
  suffix?: React.ReactNode;
  error?: string;
  autoFocus?: boolean;
  compact?: boolean;
}

export function AuthInput({ label, value, onChange, type = 'text', icon, placeholder, suffix, error, autoFocus, compact }: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPass = type === 'password';
  const realType = isPass ? (showPass ? 'text' : 'password') : type;

  return (
    <div style={{ marginBottom: compact ? 10 : 12 }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: compact ? 4 : 6, padding: '0 4px' }}>
        {label}
      </div>
      <div style={{
        background: '#FFFFFF', borderRadius: 14, padding: compact ? '11px 14px' : '14px 14px',
        boxShadow: error
          ? 'inset 0 0 0 2px #C0392B'
          : (focused ? 'inset 0 0 0 2px #5B3FA1' : 'inset 0 0 0 1.5px #F1ECE0'),
        display: 'flex', alignItems: 'center', gap: 10,
        transition: 'box-shadow 0.15s',
      }}>
        {icon && <CategoryIcon name={icon} size={18} color={focused ? '#5B3FA1' : '#9A8DBA'} />}
        <input
          type={realType} value={value} placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 700, color: '#1F1530',
          }}
        />
        {isPass && (
          <button onClick={() => setShowPass(!showPass)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'flex',
          }}>
            <CategoryIcon name="eye" size={18} color="#9A8DBA" />
          </button>
        )}
        {suffix}
      </div>
      {error && (
        <div style={{ fontSize: 11.5, color: '#C0392B', fontWeight: 800, padding: '6px 4px 0' }}>{error}</div>
      )}
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7z" />
    </svg>
  );
}

interface SocialButtonProps {
  provider: 'google' | 'apple';
  iconOnly?: boolean;
  compact?: boolean;
}

export function SocialButton({ provider, iconOnly, compact }: SocialButtonProps) {
  const meta = {
    google: { label: 'Continuar com Google', glyph: <GoogleG /> },
    apple:  { label: 'Continuar com Apple',  glyph: (
      <svg width="18" height="20" viewBox="0 0 384 512" fill="#1F1530">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
      </svg>
    )},
  }[provider];

  return (
    <button style={{
      flex: iconOnly ? '0 0 auto' : 1,
      border: 'none', cursor: 'pointer',
      padding: compact ? (iconOnly ? '12px 16px' : '12px 14px') : '14px 16px',
      borderRadius: 16, minWidth: 0,
      background: '#FFFFFF', boxShadow: 'inset 0 0 0 1.5px #F1ECE0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13.5, color: '#1F1530',
    }}>
      {meta.glyph}
      {!iconOnly && meta.label}
    </button>
  );
}
