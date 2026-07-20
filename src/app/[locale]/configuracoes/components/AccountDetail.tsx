'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { useAuthStore } from '@/stores/auth-store';

interface SettingsInputProps {
  label: string;
  icon: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}

function SettingsInput({ label, icon, value, onChange, readOnly }: SettingsInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div className="text-[11.5px] font-extrabold text-purple tracking-[0.03em] mb-1.5 px-1">{label}</div>
      <div className={`bg-surface rounded-[14px] px-3.5 py-[11px] flex items-center gap-2.5 transition-shadow ${focused ? 'shadow-[inset_0_0_0_2px_#5B3FA1]' : 'shadow-[inset_0_0_0_1.5px_#F1ECE0]'}`}>
        <CategoryIcon name={icon} size={18} color={focused ? '#5B3FA1' : '#9A8DBA'} />
        <input
          type="text"
          readOnly={readOnly}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange?.(e.target.value)}
          className="flex-1 min-w-0 border-none outline-none bg-transparent font-sans text-[15px] font-bold text-foreground"
        />
      </div>
    </div>
  );
}

export function AccountDetail() {
  const t     = useTranslations('settings');
  const tAuth = useTranslations('auth');
  const user  = useAuthStore(s => s.user);

  const [name,     setName]     = useState(user?.name     ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [email,    setEmail]    = useState(user?.email    ?? '');
  const [bio,      setBio]      = useState('');
  const BIO_MAX = 120;

  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(user.createdAt))
    : '—';
  const shortId = user?.id ? `#${user.id.slice(0, 6)}` : '';

  return (
    <div className="py-8 px-9">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] font-extrabold text-faint tracking-[0.07em] uppercase mb-1">{t('groupAccount')}</div>
        <div className="font-fredoka font-semibold text-[30px] text-foreground tracking-[-0.02em]">{t('accountTitle')}</div>
      </div>

      {/* Body */}
      <div className="flex gap-12 items-start">

        {/* Avatar column */}
        <div className="flex flex-col items-center gap-3 shrink-0 w-[140px]">
          <div className="relative">
            <div
              className="w-[114px] h-[114px] rounded-full flex items-center justify-center border-4 border-white"
              style={{ background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)', boxShadow: '0 4px 16px rgba(91,63,161,0.15)' }}
            >
              <DodooMascot size={88} />
            </div>
            <button className="absolute bottom-1 right-1 w-[30px] h-[30px] rounded-full border-none cursor-pointer bg-foreground flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              <CategoryIcon name="camera" size={15} color="#FFD93D" />
            </button>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-faint">{t('memberSince')} {memberSince}</div>
            <div className="text-[11.5px] font-bold text-[#C2B8D8] mt-0.5">ID {shortId}</div>
          </div>
        </div>

        {/* Form column */}
        <div className="flex-1 min-w-0">
          {/* NOME + USUÁRIO */}
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <SettingsInput label={tAuth('name')} icon="user" value={name} onChange={setName} />
            <div>
              <SettingsInput label={tAuth('username')} icon="tag" value={username} onChange={setUsername} />
              <div className="text-[11.5px] font-bold text-faint mt-[5px] px-1">dodoo.app/{username}</div>
            </div>
          </div>

          {/* E-MAIL */}
          <div className="mb-3.5">
            <SettingsInput label={tAuth('email')} icon="text" value={email} onChange={setEmail} />
          </div>

          {/* BIO */}
          <div className="mb-6">
            <div className="text-[11.5px] font-extrabold text-purple tracking-[0.03em] mb-1.5 px-1">BIO</div>
            <div className="bg-surface rounded-[14px] px-3.5 py-3 shadow-[inset_0_0_0_1.5px_#F1ECE0]">
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value.slice(0, BIO_MAX))}
                rows={4}
                placeholder={t('bioPlaceholder')}
                className="w-full border-none outline-none resize-none bg-transparent font-sans text-[15px] font-bold text-foreground leading-relaxed"
              />
              <div className="text-right text-xs font-bold text-faint">{bio.length}/{BIO_MAX}</div>
            </div>
          </div>

          {/* Save */}
          <button className="border-none cursor-pointer px-7 py-3.5 rounded-2xl bg-accent text-foreground font-fredoka font-semibold text-[17px] shadow-[0_6px_18px_rgba(255,167,0,0.35),inset_0_-3px_0_rgba(0,0,0,0.08)]">
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}
