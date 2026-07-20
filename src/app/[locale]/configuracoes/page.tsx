'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WebLayout } from '@/components/layout/web-layout';
import { WebSettingsNav } from './components/WebSettingsNav';
import { ProfileDetail } from './components/ProfileDetail';
import { AvatarDetail } from './components/AvatarDetail';
import { TitleDetail } from './components/TitleDetail';
import { ThemeDetail } from './components/ThemeDetail';
import { AccountDetail } from './components/AccountDetail';
import { SecurityDetail } from './components/SecurityDetail';
import { TermsDetail } from './components/TermsDetail';
import { InviteDetail } from './components/InviteDetail';
import { SimpleDetail } from './components/SimpleDetail';
import type { SettingsSection } from './components/types';

function SettingsDetail({ sub }: { sub: SettingsSection }) {
  switch (sub) {
    case 'profile':  return <ProfileDetail />;
    case 'avatar':   return <AvatarDetail />;
    case 'border':   return <SimpleDetail titleKey="borderTitle" />;
    case 'title':    return <TitleDetail />;
    case 'theme':    return <ThemeDetail />;
    case 'account':  return <AccountDetail />;
    case 'security': return <SecurityDetail />;
    case 'terms':    return <TermsDetail />;
    case 'invite':   return <InviteDetail />;
  }
}

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [activeSub, setActiveSub] = useState<SettingsSection>('profile');

  const handleNav = (id: string) => {
    if (id === 'list')    router.push('../tarefas');
    if (id === 'feed')    router.push('../feed');
    if (id === 'trophy')  router.push('../conquistas');
    if (id === 'friends') router.push('../amigos');
  };

  return (
    <WebLayout active="settings" onNav={handleNav} onCreate={() => router.push('../tarefas')}>
      <div className="flex h-screen">
        <WebSettingsNav active={activeSub} onSelect={setActiveSub} />
        <div className="flex-1 overflow-auto bg-background">
          <SettingsDetail sub={activeSub} />
        </div>
      </div>
    </WebLayout>
  );
}
