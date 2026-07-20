import { useTranslations } from 'next-intl';

type PasswordStrength = 0 | 1 | 2 | 3 | 4;

const STRENGTH_BAR_COLOR: Record<PasswordStrength, string> = {
  0: 'bg-border',
  1: 'bg-error',
  2: 'bg-[#E5B800]',
  3: 'bg-[#2F7A3F]',
  4: 'bg-[#2F7A3F]',
};

export function PasswordStrengthMeter({ strength }: { strength: number }) {
  const t = useTranslations('auth');
  const level = Math.max(0, Math.min(4, strength)) as PasswordStrength;

  const STRENGTH_LABELS: Record<PasswordStrength, string> = {
    0: '',
    1: t('passWeak'),
    2: t('passOk'),
    3: t('passGood'),
    4: t('passExcellent'),
  };

  const barColor = STRENGTH_BAR_COLOR[level];

  return (
    <div className="-mt-1.5 mb-3.5 px-1">
      <div className="flex gap-[3px] mb-1">
        {([1, 2, 3, 4] as const).map(step => (
          <span
            key={step}
            className={`flex-1 h-1 rounded-sm ${step <= level ? barColor : 'bg-border'}`}
          />
        ))}
      </div>
      <p className="text-[11px] font-extrabold text-faint">
        {STRENGTH_LABELS[level]}
      </p>
    </div>
  );
}
