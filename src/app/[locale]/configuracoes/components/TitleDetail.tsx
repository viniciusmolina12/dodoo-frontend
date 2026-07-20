'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { TITLE_OPTIONS } from '@/data/customize';

export function TitleDetail() {
  const t = useTranslations('settings');
  const [equipped, setEquipped] = useState('manha');

  return (
    <div className="py-8 px-9">
      <div className="font-fredoka font-semibold text-[22px] text-foreground mb-5">{t('titleTitle')}</div>
      <div className="flex flex-col gap-2.5">
        {TITLE_OPTIONS.map(titleOpt => {
          const eq     = equipped === titleOpt.id;
          const locked = !titleOpt.unlocked;
          return (
            <button
              key={titleOpt.id}
              disabled={locked}
              onClick={() => setEquipped(titleOpt.id)}
              className={`border-none text-left p-3.5 rounded-[18px] bg-surface flex items-center gap-3 transition-opacity ${locked ? 'cursor-not-allowed opacity-85' : 'cursor-pointer'}`}
              style={{ boxShadow: eq ? 'inset 0 0 0 2.5px #5B3FA1' : 'inset 0 0 0 1.5px #F1ECE0' }}
            >
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                style={{ background: locked ? '#F1ECE0' : titleOpt.bg }}
              >
                <CategoryIcon name={locked ? 'lock' : titleOpt.icon} size={20} color={locked ? '#9A8DBA' : titleOpt.fg} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 mb-0.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[11px] font-extrabold"
                    style={{ background: locked ? '#F1ECE0' : titleOpt.bg, color: locked ? '#9A8DBA' : titleOpt.fg }}
                  >
                    <CategoryIcon name={locked ? 'lock' : titleOpt.icon} size={10} color={locked ? '#9A8DBA' : titleOpt.fg} />
                    {titleOpt.name}
                  </span>
                </div>
                <div className="text-xs text-muted font-bold">
                  {locked ? titleOpt.unlock : t('unlocked', { condition: titleOpt.unlock })}
                </div>
                {locked && titleOpt.progress != null && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex-1 h-[5px] rounded-[3px] bg-border overflow-hidden">
                      <div
                        className="h-full bg-purple rounded-[3px]"
                        style={{ width: `${((titleOpt.progress ?? 0) / (titleOpt.needed ?? 1)) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10.5px] text-purple font-extrabold">{titleOpt.progress}/{titleOpt.needed}</div>
                  </div>
                )}
              </div>

              {eq && (
                <span className="px-2 py-1 bg-accent rounded-full text-[10px] font-extrabold text-foreground">{t('equipped')}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
