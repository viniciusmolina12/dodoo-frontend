'use client';

import { useTranslations } from 'next-intl';
import { DodooMascot } from '@/components/ui/logo';
import { SectionGroup } from '@/components/ui/section-group';
import { SettingRow } from '@/components/ui/setting-row';

const APP_VERSION = 'v1.0.0 · build 2026.05.22';

interface LinkChipProps {
  label: string;
  href: string;
}

function LinkChip({ label, href }: LinkChipProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-[#F0EBF8] text-purple font-extrabold text-[12px] no-underline hover:bg-[#E4D9F5] transition-colors"
    >
      {label}
      <span className="text-[10px] opacity-70">↗</span>
    </a>
  );
}

export function TermsDetail() {
  const t = useTranslations('settings');

  return (
    <div className="py-8 px-9">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] font-extrabold text-faint tracking-[0.07em] uppercase mb-1">{t('groupAccount')}</div>
        <div className="font-fredoka font-semibold text-[30px] text-foreground tracking-[-0.02em]">{t('termsTitle')}</div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_280px] gap-6 items-start">

        {/* Left column */}
        <div className="min-w-0">
          {/* DOCUMENTOS */}
          <SectionGroup title={t('termsDocs')}>
            <SettingRow
              icon="text"
              iconBg="#EFE6FF"
              iconFg="#5B3FA1"
              title={t('termsOfUse')}
              subtitle={t('termsOfUseSub')}
              onClick={() => {}}
            />
            <SettingRow
              icon="lock"
              iconBg="#EFE6FF"
              iconFg="#5B3FA1"
              title={t('privacyPolicy')}
              subtitle={t('privacyPolicySub')}
              onClick={() => {}}
            />
            <SettingRow
              icon="people"
              iconBg="#FFE0CC"
              iconFg="#C05A00"
              title={t('communityGuidelines')}
              subtitle={t('communityGuidelinesSub')}
              onClick={() => {}}
            />
            <SettingRow
              icon="coin"
              iconBg="#FFF1B5"
              iconFg="#8B6A14"
              title={t('coinsPrestige')}
              subtitle={t('coinsPrestígeSub')}
              onClick={() => {}}
              last
            />
          </SectionGroup>

          {/* SEUS DADOS */}
          <SectionGroup title={t('yourData')}>
            <SettingRow
              icon="download"
              iconBg="#EFE6FF"
              iconFg="#5B3FA1"
              title={t('downloadData')}
              subtitle={t('downloadDataSub')}
              onClick={() => {}}
            />
            <SettingRow
              icon="eye"
              iconBg="#CFEDE6"
              iconFg="#177264"
              title={t('whoCanFind')}
              subtitle={t('whoCanFindSub')}
              onClick={() => {}}
            />
            <SettingRow
              icon="broadcast"
              iconBg="#FFD9D2"
              iconFg="#C0392B"
              title={t('cookiesTracking')}
              subtitle={t('cookiesTrackingSub')}
              onClick={() => {}}
              last
            />
          </SectionGroup>
        </div>

        {/* Right column — App info card */}
        <div className="bg-surface rounded-[18px] shadow-[inset_0_0_0_1.5px_#F1ECE0] p-5">
          {/* Brand row */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shrink-0"
              style={{ background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)' }}
            >
              <DodooMascot size={40} />
            </div>
            <div>
              <div className="font-fredoka font-semibold text-[22px] text-foreground leading-tight">Dodoo</div>
              <div className="text-[11.5px] text-faint font-bold mt-px">{APP_VERSION}</div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-[13px] font-bold text-purple mb-4 leading-snug">{t('appTagline')}</p>

          {/* Link chips */}
          <div className="flex flex-wrap gap-2">
            <LinkChip label={t('appSite')}       href="#" />
            <LinkChip label={t('appOpenSource')} href="#" />
            <LinkChip label={t('appChangelog')}  href="#" />
            <LinkChip label={t('appStatus')}     href="#" />
          </div>
        </div>
      </div>
    </div>
  );
}
