'use client';

interface MascotProps { size?: number }

export function DodooMascot({ size = 80 }: MascotProps) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <path d="M48 14 Q50 4 56 10 Q58 4 64 10 Q66 6 70 12 L 64 22 Z" fill="#5B3FA1" />
      <ellipse cx="50" cy="62" rx="34" ry="30" fill="#7857C8" />
      <ellipse cx="50" cy="70" rx="22" ry="18" fill="#9D81E0" />
      <circle cx="50" cy="38" r="24" fill="#7857C8" />
      <circle cx="34" cy="46" r="4" fill="#FFB3C6" opacity="0.7" />
      <circle cx="66" cy="46" r="4" fill="#FFB3C6" opacity="0.7" />
      <circle cx="42" cy="34" r="6" fill="#FFF8E7" />
      <circle cx="58" cy="34" r="6" fill="#FFF8E7" />
      <circle cx="43" cy="35" r="2.6" fill="#1F1530" />
      <circle cx="59" cy="35" r="2.6" fill="#1F1530" />
      <circle cx="44" cy="34" r="0.9" fill="#FFF8E7" />
      <circle cx="60" cy="34" r="0.9" fill="#FFF8E7" />
      <path d="M40 44 Q50 38 60 44 Q62 50 50 56 Q38 50 40 44 Z" fill="#FFD93D" stroke="#E5B800" strokeWidth="1.2" />
      <path d="M40 44 Q50 47 60 44" stroke="#E5B800" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="92" rx="8" ry="3.5" fill="#FFD93D" stroke="#E5B800" strokeWidth="1" />
      <ellipse cx="62" cy="92" rx="8" ry="3.5" fill="#FFD93D" stroke="#E5B800" strokeWidth="1" />
      <ellipse cx="78" cy="60" rx="6" ry="10" fill="#5B3FA1" transform="rotate(-20 78 60)" />
    </svg>
  );
}

export function DodooLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DodooMascot size={size} />
      <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: size * 0.75, color: '#FFF8E7', letterSpacing: 0.5 }}>
        dodoo
      </span>
    </div>
  );
}
