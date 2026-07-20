'use client';

interface SectionGroupProps {
  title: string;
  children: React.ReactNode;
}

export function SectionGroup({ title, children }: SectionGroupProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: 'var(--text-faint)',
        letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 6,
      }}>
        {title}
      </div>
      <div style={{
        background: 'var(--surface)', borderRadius: 18,
        padding: '2px 16px',
        boxShadow: 'inset 0 0 0 1.5px var(--border)',
      }}>
        {children}
      </div>
    </div>
  );
}
