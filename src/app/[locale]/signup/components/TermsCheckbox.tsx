import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';

interface TermsCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export function TermsCheckbox({ checked, onToggle }: TermsCheckboxProps) {
  const t = useTranslations('auth');

  return (
    <button
      onClick={onToggle}
      className="w-full border-0 bg-transparent cursor-pointer flex items-start gap-2.5 py-1.5 text-left"
    >
      <span
        className={`w-5 h-5 rounded-[6px] shrink-0 mt-px flex items-center justify-center ${
          checked
            ? 'bg-accent shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]'
            : 'bg-surface shadow-[inset_0_0_0_1.5px_#F1ECE0]'
        }`}
      >
        {checked && <CategoryIcon name="check" size={12} color="#1F1530" />}
      </span>
      <span className="text-[12.5px] text-purple font-bold leading-snug">
        {t('termsAccept')}{' '}
        <span className="underline">{t('termsLink')}</span>
        {' '}e a{' '}
        <span className="underline">{t('privacyLink')}</span>.
      </span>
    </button>
  );
}
