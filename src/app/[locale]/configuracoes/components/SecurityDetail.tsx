'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { Toggle } from '@/components/ui/toggle';
import { SectionGroup } from '@/components/ui/section-group';
import { SettingRow } from '@/components/ui/setting-row';
import { useAuthStore } from '@/stores/auth-store';

// ─── Session row ──────────────────────────────────────────────────────────────

interface Session {
  id: string;
  device: string;
  location: string;
  icon: string;
  iconBg: string;
  iconFg: string;
  time: string;
  isCurrent?: boolean;
  isSuspect?: boolean;
}

const MOCK_SESSIONS: Session[] = [
  { id: '1', device: 'iPhone 15', location: 'Pernambuco', icon: 'phone',   iconBg: '#D4F5E3', iconFg: '#177264', time: 'agora',    isCurrent: true  },
  { id: '2', device: 'MacBook Pro', location: 'Pernambuco', icon: 'monitor', iconBg: '#EFE6FF', iconFg: '#5B3FA1', time: 'há 2 dias' },
  { id: '3', device: 'Chrome',    location: 'Lisboa, Portugal', icon: 'globe',   iconBg: '#FFD9D2', iconFg: '#C0392B', time: 'há 1 mês', isSuspect: true  },
];

function SessionRow({ session, onTerminate, t }: { session: Session; onTerminate: (id: string) => void; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className={`flex items-center gap-3 py-[11px] ${session.id !== MOCK_SESSIONS[MOCK_SESSIONS.length - 1].id ? 'border-b border-[#F4F0E5]' : ''}`}>
      <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0" style={{ background: session.iconBg }}>
        <CategoryIcon name={session.icon} size={17} color={session.iconFg} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-extrabold text-[13.5px] text-foreground">{session.device} · {session.location}</span>
          {session.isCurrent && (
            <span className="text-[10px] font-extrabold text-[#177264] bg-[#D4F5E3] px-1.5 py-px rounded-full">
              {t('secThis')}
            </span>
          )}
          {session.isSuspect && (
            <span className="text-[10px] font-extrabold text-[#C0392B] bg-[#FFD9D2] px-1.5 py-px rounded-full">
              {t('secSuspect')}
            </span>
          )}
        </div>
        <div className="text-[11.5px] text-faint font-bold mt-px">{session.time}</div>
      </div>

      {!session.isCurrent && (
        <button
          onClick={() => onTerminate(session.id)}
          className="border-none bg-transparent cursor-pointer text-[13px] font-extrabold text-purple shrink-0 px-1"
        >
          {t('secTerminate')}
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SecurityDetail() {
  const t    = useTranslations('settings');
  const user = useAuthStore(s => s.user);

  const [twoFactor, setTwoFactor] = useState(false);
  const [pin,       setPin]       = useState(true);
  const [sessions,  setSessions]  = useState(MOCK_SESSIONS);

  const emailVerifySub = user?.email ? `${user.email} · ${t('secEmailVerifySub')}` : t('secEmailVerifySub');

  function handleTerminate(id: string) {
    setSessions(s => s.filter(x => x.id !== id));
  }

  function handleTerminateAll() {
    setSessions(s => s.filter(x => x.isCurrent));
  }

  return (
    <div className="py-8 px-9">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] font-extrabold text-faint tracking-[0.07em] uppercase mb-1">{t('groupAccount')}</div>
        <div className="font-fredoka font-semibold text-[30px] text-foreground tracking-[-0.02em]">{t('securityTitle')}</div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_auto] gap-6 items-start">

        {/* Left column */}
        <div className="min-w-0">
          {/* SENHA */}
          <SectionGroup title={t('secPassword')}>
            <SettingRow
              icon="lock"
              iconBg="#EFE6FF"
              iconFg="#5B3FA1"
              title={t('secPassTitle')}
              subtitle={t('secPassSub')}
              onClick={() => {}}
            />
            <SettingRow
              icon="check-fill"
              iconBg="#D4F5E3"
              iconFg="#177264"
              title={t('secEmailVerifyTitle')}
              subtitle={emailVerifySub}
              onClick={() => {}}
              last
            />
          </SectionGroup>

          {/* ACESSO */}
          <SectionGroup title={t('secAccess')}>
            <SettingRow
              icon="shield"
              iconBg="#FFF1B5"
              iconFg="#8B6A14"
              title={t('sec2faTitle')}
              subtitle={t('sec2faSub')}
              right={<Toggle value={twoFactor} onChange={setTwoFactor} />}
              chevron={false}
            />
            <SettingRow
              icon="lock"
              iconBg="#EFE6FF"
              iconFg="#5B3FA1"
              title={t('secPinTitle')}
              subtitle={t('secPinSub')}
              right={<Toggle value={pin} onChange={setPin} />}
              chevron={false}
              last
            />
          </SectionGroup>

          {/* ZONA DELICADA */}
          <SectionGroup title={t('secDanger')}>
            <SettingRow
              icon="dash"
              iconBg="#FFD9D2"
              iconFg="#C0392B"
              title={t('secPauseTitle')}
              subtitle={t('secPauseSub')}
              onClick={() => {}}
            />
            <SettingRow
              icon="dash"
              iconBg="#FFD9D2"
              iconFg="#C0392B"
              title={t('secDeleteTitle')}
              subtitle={t('secDeleteSub')}
              onClick={() => {}}
              last
            />
          </SectionGroup>
        </div>

        {/* Right column — SESSÕES ATIVAS */}
        <div className="w-[300px] shrink-0">
          <div className="text-[11px] font-extrabold text-faint tracking-[0.07em] uppercase mb-1.5">{t('secSessions')}</div>

          {/* Sessions card */}
          <div className="bg-surface rounded-[18px] px-4 py-px shadow-[inset_0_0_0_1.5px_#F1ECE0] mb-3">
            {sessions.map(session => (
              <SessionRow key={session.id} session={session} onTerminate={handleTerminate} t={t} />
            ))}
          </div>

          {/* Terminate all */}
          <button
            onClick={handleTerminateAll}
            className="w-full bg-surface rounded-[18px] shadow-[inset_0_0_0_1.5px_#F1ECE0] py-3.5 border-none cursor-pointer text-[13.5px] font-extrabold text-purple"
          >
            {t('secTerminateAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
