'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { THEME_OPTIONS } from '@/data/customize';
import { useThemeStore } from '@/stores/theme-store';
import type { ThemeMode } from '@/stores/theme-store';

const MODE_ICONS: Record<ThemeMode, string> = {
  light:  'spark',
  dark:   'moon',
  system: 'monitor',
};

export function ThemeDetail() {
  const t = useTranslations('settings');
  const { mode, setMode } = useThemeStore();
  const [selected, setSelected] = useState('lavanda');

  const MODES: { id: ThemeMode; label: string }[] = [
    { id: 'light',  label: t('themeLight') },
    { id: 'dark',   label: t('themeDark')  },
    { id: 'system', label: t('themeAuto')  },
  ];

  return (
    <div className="py-8 px-9">

      {/* Appearance mode selector */}
      <div className="font-fredoka font-semibold text-[22px] text-foreground mb-3">
        {t('appearanceSection')}
      </div>
      <div className="grid grid-cols-3 gap-2.5 mb-8">
        {MODES.map(m => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="border-none cursor-pointer p-3 rounded-2xl bg-surface flex flex-col items-center gap-2 transition-shadow"
              style={{
                boxShadow: active
                  ? 'inset 0 0 0 2.5px var(--purple)'
                  : 'inset 0 0 0 1.5px var(--border)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: active ? 'var(--purple)' : 'var(--border)' }}
              >
                <CategoryIcon
                  name={MODE_ICONS[m.id]}
                  size={18}
                  color={active ? '#FFFFFF' : 'var(--text-faint)'}
                />
              </div>
              <span
                className="text-xs font-extrabold"
                style={{ color: active ? 'var(--purple)' : 'var(--text-faint)' }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Color theme */}
      <div className="font-fredoka font-semibold text-[22px] text-foreground mb-5">
        {t('themeTitle')}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {THEME_OPTIONS.map(themeOpt => {
          const isSel = selected === themeOpt.id;
          return (
            <button
              key={themeOpt.id}
              onClick={() => setSelected(themeOpt.id)}
              className="border-none cursor-pointer p-1.5 rounded-2xl bg-surface"
              style={{ boxShadow: isSel ? 'inset 0 0 0 2.5px var(--purple)' : 'inset 0 0 0 1.5px var(--border)' }}
            >
              <div
                className="h-20 rounded-xl relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${themeOpt.gradient[0]} 0%, ${themeOpt.gradient[1]} 100%)` }}
              >
                <div className="absolute -top-2.5 -right-2.5 w-[50px] h-[50px] rounded-full" style={{ background: `${themeOpt.accent}40` }} />
                <div className="absolute bottom-2 left-2 w-[22px] h-[22px] rounded-full" style={{ background: themeOpt.accent }} />
              </div>
              <div className="flex items-center justify-between px-1 pt-2 pb-0.5">
                <div className="text-xs font-extrabold text-foreground">{themeOpt.name}</div>
                {themeOpt.equipped && (
                  <span className="px-1.5 py-px bg-accent rounded-full text-[9px] font-extrabold text-foreground">{t('equipped')}</span>
                )}
                {!themeOpt.owned && (
                  <div className="text-[10px] font-extrabold text-[#8B6A14] bg-[#FFF1B5] px-1.5 py-0.5 rounded-full">{themeOpt.cost}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
