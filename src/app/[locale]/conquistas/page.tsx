'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { featureFlags } from '@/lib/feature-flags';
import { ComingSoonView } from '@/components/ui/coming-soon-view';

export default function ConquistasPage() {
  const router = useRouter();
  const t      = useTranslations('achievements');

  const handleNav = (id: string) => {
    if (id === 'list')     router.push('../tarefas');
    if (id === 'feed')     router.push('../feed');
    if (id === 'settings') router.push('../configuracoes');
    if (id === 'friends')  router.push('../amigos');
  };

  return (
    <WebLayout active="trophy" onNav={handleNav} onCreate={() => router.push('../tarefas')}>
      {featureFlags.achievementsComingSoon && (
        <ComingSoonView title={t('previewTitle')} description={t('previewDesc')} />
      )}
    </WebLayout>
  );
}
