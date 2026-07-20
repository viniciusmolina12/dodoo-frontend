import { DodooMascot } from '@/components/ui/logo';

interface ComingSoonViewProps {
  title: string;
  description: string;
}

export function ComingSoonView({ title, description }: ComingSoonViewProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '60px 40px',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255,217,61,0.18)',
        border: '1px solid rgba(255,217,61,0.38)',
        borderRadius: 99,
        padding: '5px 14px',
        marginBottom: 28,
      }}>
        <span style={{
          fontSize: 11.5,
          fontWeight: 800,
          fontFamily: 'Fredoka, sans-serif',
          letterSpacing: 0.6,
          color: '#8B6A14',
        }}>
          Preview
        </span>
      </div>

      <DodooMascot size={88} />

      <h2 style={{
        fontFamily: 'Fredoka, sans-serif',
        fontWeight: 600,
        fontSize: 28,
        color: '#1F1530',
        margin: '22px 0 12px',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>

      <p style={{
        fontSize: 14.5,
        color: '#7A6E94',
        fontWeight: 700,
        maxWidth: 400,
        lineHeight: 1.65,
        margin: 0,
      }}>
        {description}
      </p>
    </div>
  );
}
