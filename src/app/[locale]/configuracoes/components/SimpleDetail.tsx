'use client';

import { useTranslations } from 'next-intl';

interface Props {
  titleKey: string;
  children?: React.ReactNode;
}

export function SimpleDetail({ titleKey, children }: Props) {
  const t = useTranslations('settings');
  return (
    <div className="py-8 px-9">
      <div className="font-fredoka font-semibold text-[22px] text-foreground mb-5">
        {t(titleKey as Parameters<typeof t>[0])}
      </div>
      {children ?? <div className="text-faint text-[14px] font-bold">{t('soon')}</div>}
    </div>
  );
}
