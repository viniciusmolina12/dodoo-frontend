'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { useAuthStore } from '@/stores/auth-store';

// ─── QR Code placeholder ──────────────────────────────────────────────────────

function QrCode() {
  const cell = 4;
  const size = 19;
  // Minimal QR-like bit pattern (visual only)
  const bits = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,0,1,0],
    [0,1,0,0,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1],
    [1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,0,1,0],
    [0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,1,0,1],
    [1,1,1,1,1,0,1,0,0,1,1,0,1,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1],
  ];

  return (
    <svg width={size * cell} height={size * cell} viewBox={`0 0 ${size * cell} ${size * cell}`}>
      {bits.map((row, r) =>
        row.map((bit, c) =>
          bit ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1F1530" /> : null
        )
      )}
    </svg>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────────

interface ShareButtonProps {
  label: string;
  iconBg: string;
  iconFg: string;
}

function ShareButton({ label, iconBg, iconFg }: ShareButtonProps) {
  return (
    <button className="flex-1 flex flex-col items-center gap-2 py-3.5 px-2 bg-surface rounded-[16px] border-none cursor-pointer shadow-[inset_0_0_0_1.5px_#F1ECE0] hover:shadow-[inset_0_0_0_1.5px_#C4B8D8] transition-shadow">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: iconBg }}>
        <CategoryIcon name="chevron-r" size={16} color={iconFg} />
      </div>
      <span className="text-[12px] font-extrabold text-muted">{label}</span>
    </button>
  );
}

// ─── History row ──────────────────────────────────────────────────────────────

type InviteStatus = 'accepted' | 'pending' | 'expired';

interface HistoryItem {
  id: string;
  name: string;
  time: string;
  status: InviteStatus;
  coins?: number;
  avatarBg: string;
  avatarFg: string;
}

const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', name: 'Marina',  time: 'há 2 dias',    status: 'accepted', coins: 30, avatarBg: '#EFE6FF', avatarFg: '#5B3FA1' },
  { id: '2', name: 'Tiago',   time: 'há 1 semana',  status: 'accepted', coins: 30, avatarBg: '#CFEDE6', avatarFg: '#177264' },
  { id: '3', name: 'Beatriz', time: 'enviado há 3h', status: 'pending',            avatarBg: '#FFE0CC', avatarFg: '#C05A00' },
  { id: '4', name: 'Rafael',  time: 'enviado há 2 dias', status: 'pending',        avatarBg: '#FFD9D2', avatarFg: '#C0392B' },
  { id: '5', name: 'Helena',  time: 'há 1 mês',     status: 'expired',            avatarBg: '#F1ECE0', avatarFg: '#9A8DBA' },
];

const STATUS_STYLE: Record<InviteStatus, { bg: string; text: string }> = {
  accepted: { bg: '#D4F5E3', text: '#177264' },
  pending:  { bg: '#F1ECE0', text: '#9A8DBA' },
  expired:  { bg: '#F1ECE0', text: '#C4B8D8' },
};

function HistoryRow({ item, t, isLast }: { item: HistoryItem; t: ReturnType<typeof useTranslations>; isLast: boolean }) {
  const badge = STATUS_STYLE[item.status];
  const label = item.status === 'accepted' ? t('inviteAccepted') : item.status === 'pending' ? t('invitePending') : t('inviteExpired');

  return (
    <div className={`flex items-center gap-2.5 py-[10px] ${!isLast ? 'border-b border-[#F4F0E5]' : ''}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-fredoka font-semibold text-[14px]"
        style={{ background: item.avatarBg, color: item.avatarFg }}
      >
        {item.name[0]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-[13px] text-foreground leading-tight">{item.name}</div>
        <div className="text-[11px] text-faint font-bold mt-px">{item.time}</div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="text-[10px] font-extrabold px-1.5 py-px rounded-full"
          style={{ background: badge.bg, color: badge.text }}
        >
          {label}
        </span>
        {item.coins && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#8B6A14] bg-[#FFF1B5] px-1.5 py-px rounded-full">
            <CategoryIcon name="coin" size={9} color="#8B6A14" />
            +{item.coins}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InviteDetail() {
  const t    = useTranslations('settings');
  const user = useAuthStore(s => s.user);

  const inviteLink = `dodoo.app/i/${user?.username ?? 'lia-m'}`;
  const [copied, setCopied] = useState(false);

  const totalCoins = MOCK_HISTORY.filter(h => h.coins).reduce((acc, h) => acc + (h.coins ?? 0), 0);

  function handleCopy() {
    navigator.clipboard.writeText(`https://${inviteLink}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="py-8 px-9">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[11px] font-extrabold text-faint tracking-[0.07em] uppercase mb-1">{t('groupAccount')}</div>
        <div className="font-fredoka font-semibold text-[30px] text-foreground tracking-[-0.02em]">{t('inviteTitle')}</div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_280px] gap-6 items-start">

        {/* Left column */}
        <div className="min-w-0 flex flex-col gap-5">

          {/* Hero banner */}
          <div
            className="relative overflow-hidden rounded-2xl p-6"
            style={{ background: '#FFD93D', boxShadow: '0 4px 20px rgba(255,167,0,0.3)' }}
          >
            {/* Decorative blob */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="absolute -bottom-10 right-10 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />

            {/* Mascot */}
            <div className="absolute -top-1 right-4">
              <DodooMascot size={72} />
            </div>

            <div className="relative pr-20">
              <div className="font-fredoka font-semibold text-[26px] text-foreground leading-tight mb-2">
                {t('inviteHeroTitle')}
              </div>
              <div className="text-[13px] font-bold text-[#5A3A00] leading-snug max-w-[340px]">
                {t('inviteHeroDesc')}
              </div>
            </div>
          </div>

          {/* Invite link */}
          <div>
            <div className="text-[11px] font-extrabold text-faint tracking-[0.07em] uppercase mb-2">{t('inviteLinkLabel')}</div>
            <div className="flex items-center gap-0 bg-surface rounded-2xl shadow-[inset_0_0_0_1.5px_#F1ECE0] overflow-hidden">
              <span className="flex-1 px-4 py-3 text-[14px] font-bold text-muted truncate">{inviteLink}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-3 border-none cursor-pointer font-fredoka font-semibold text-[14px] text-[#FFF8E7] shrink-0 transition-opacity hover:opacity-90"
                style={{ background: '#1F1530' }}
              >
                <CategoryIcon name="coin" size={14} color="#FFD93D" />
                {copied ? t('inviteCopied') : t('inviteCopy')}
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3">
            <ShareButton label="WhatsApp" iconBg="#D4F5E3" iconFg="#177264" />
            <ShareButton label="Telegram" iconBg="#EFE6FF" iconFg="#5B3FA1" />
            <ShareButton label="SMS"      iconBg="#FFF1B5" iconFg="#8B6A14" />
            <ShareButton label="E-mail"   iconBg="#F1ECE0" iconFg="#9A8DBA" />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">

          {/* QR Code card */}
          <div className="bg-surface rounded-[18px] shadow-[inset_0_0_0_1.5px_#F1ECE0] p-4 flex items-center gap-4">
            <div className="shrink-0 rounded-xl overflow-hidden bg-[#F8F5EE] p-2">
              <QrCode />
            </div>
            <div>
              <div className="font-fredoka font-semibold text-[17px] text-foreground leading-tight">{t('inviteQrTitle')}</div>
              <div className="text-[12px] font-bold text-muted mt-1 leading-snug">{t('inviteQrDesc')}</div>
            </div>
          </div>

          {/* History */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold text-faint tracking-[0.07em] uppercase">{t('inviteHistory')}</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#8B6A14] bg-[#FFF1B5] px-2 py-0.5 rounded-full">
                <CategoryIcon name="coin" size={11} color="#8B6A14" />
                {totalCoins}
              </span>
            </div>

            <div className="bg-surface rounded-[18px] shadow-[inset_0_0_0_1.5px_#F1ECE0] px-4 py-px">
              {MOCK_HISTORY.map((item, idx) => (
                <HistoryRow
                  key={item.id}
                  item={item}
                  t={t}
                  isLast={idx === MOCK_HISTORY.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
