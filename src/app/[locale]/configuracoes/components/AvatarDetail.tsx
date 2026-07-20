'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AVATAR_OPTIONS } from '@/data/customize';

export function AvatarDetail() {
  const t = useTranslations('settings');
  const [selected, setSelected] = useState('classic');

  return (
    <div className="py-8 px-9">
      <div className="font-fredoka font-semibold text-[22px] text-foreground mb-5">{t('avatarTitle')}</div>
      <div className="grid grid-cols-4 gap-2.5">
        {AVATAR_OPTIONS.map(a => {
          const isSel = a.id === selected;
          return (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className="border-none cursor-pointer pt-4 px-2 pb-3 rounded-[18px] bg-surface flex flex-col items-center gap-1.5"
              style={{ boxShadow: isSel ? 'inset 0 0 0 2.5px #5B3FA1' : 'inset 0 0 0 1.5px #F1ECE0' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: a.palette.body }}>
                <span className="font-fredoka font-semibold text-xl" style={{ color: a.palette.belly }}>{a.name[0]}</span>
              </div>
              <div className="text-[11.5px] font-extrabold text-foreground">{a.name}</div>
              {!a.owned && (
                <div className="text-[10px] font-extrabold text-[#8B6A14] bg-[#FFF1B5] px-1.5 py-px rounded-full">{a.cost}</div>
              )}
              {a.equipped && (
                <div className="text-[9px] font-extrabold text-foreground bg-accent px-1.5 py-px rounded-full">{t('equipped')}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
