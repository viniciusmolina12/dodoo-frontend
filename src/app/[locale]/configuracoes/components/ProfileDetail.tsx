'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { Toggle } from '@/components/ui/toggle';
import { Segmented } from '@/components/ui/segmented';
import { SettingRow } from '@/components/ui/setting-row';
import { SectionGroup } from '@/components/ui/section-group';
import { DODOO_CATEGORIES } from '@/data/categories';
import { useThemeStore } from '@/stores/theme-store';
import { ProfileCard } from './ProfileCard';

export function ProfileDetail() {
  const t    = useTranslations('settings');
  const tCat = useTranslations('categories');

  const { mode, setMode } = useThemeStore();

  const [interests,      setInterests]      = useState(['saude', 'estudos', 'criativa', 'casa']);
  const [streakProtect,  setStreakProtect]  = useState(true);
  const [receiveEvals,   setReceiveEvals]   = useState(true);
  const [defaultPrivacy, setDefaultPrivacy] = useState('publico');
  const [notif, setNotif] = useState({ evals: true, feed: true, streak: true, achievements: true, weekly: false });

  return (
    <div className="py-8 px-9">
      <ProfileCard />

      <div className="mt-7 grid grid-cols-2 gap-5 items-start">
        {/* Left column */}
        <div>
          <SectionGroup title={t('interestsTitle')}>
            <div className="py-3 pb-3.5">
              <div className="text-[12.5px] text-muted font-bold mb-3 leading-[1.35]">{t('interestsDesc')}</div>
              <div className="flex flex-wrap gap-1.5">
                {DODOO_CATEGORIES.map(cat => {
                  const active = interests.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setInterests(p => p.includes(cat.id) ? p.filter(x => x !== cat.id) : [...p, cat.id])}
                      className="border-none cursor-pointer py-1.5 pl-1.5 pr-2.5 rounded-full flex items-center gap-1.5 font-sans font-extrabold text-xs"
                      style={{
                        background: active ? cat.bg : 'var(--surface)',
                        color: active ? cat.fg : 'var(--text-faint)',
                        boxShadow: active ? `inset 0 0 0 1.5px ${cat.fg}` : 'inset 0 0 0 1.5px var(--border)',
                      }}
                    >
                      <span
                        className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center"
                        style={{ background: active ? cat.fg : 'var(--border)' }}
                      >
                        <CategoryIcon name={cat.icon} size={10} color={active ? cat.bg : 'var(--text-faint)'} />
                      </span>
                      {tCat(cat.id as Parameters<typeof tCat>[0])}
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionGroup>

          <SectionGroup title={t('tasksSection')}>
            <div className="py-3 border-b border-border">
              <div className="font-extrabold text-[14px] text-foreground mb-2">{t('defaultPrivacy')}</div>
              <Segmented
                options={[
                  { value: 'publico', label: t('privacyPublic'),  icon: 'globe' },
                  { value: 'privado', label: t('privacyPrivate'), icon: 'lock'  },
                ]}
                value={defaultPrivacy}
                onChange={setDefaultPrivacy}
              />
            </div>
            <SettingRow icon="flame" iconBg="#FFD9D2" iconFg="#C0392B" title={t('streakTitle')} subtitle={streakProtect ? t('streakSubOn') : t('streakSubOff')} right={<Toggle value={streakProtect} onChange={setStreakProtect} />} chevron={false} last />
          </SectionGroup>

          <SectionGroup title={t('evalSection')}>
            <SettingRow icon="eye" iconBg="#EFE6FF" iconFg="#5B3FA1" title={t('receiveEvals')} subtitle={t('receiveEvalsDesc')} right={<Toggle value={receiveEvals} onChange={setReceiveEvals} />} chevron={false} last />
          </SectionGroup>
        </div>

        {/* Right column */}
        <div>
          <SectionGroup title={t('notifSection')}>
            <SettingRow icon="star"     iconBg="#FFF1B5" iconFg="#8B6A14" title={t('notifEvals')}        right={<Toggle value={notif.evals}        onChange={v => setNotif(n => ({ ...n, evals: v }))} />}        chevron={false} />
            <SettingRow icon="list"     iconBg="#EFE6FF" iconFg="#5B3FA1" title={t('notifFeed')}         right={<Toggle value={notif.feed}         onChange={v => setNotif(n => ({ ...n, feed: v }))} />}         chevron={false} />
            <SettingRow icon="flame"    iconBg="#FFD9D2" iconFg="#C0392B" title={t('notifStreak')}       subtitle={t('notifStreakDesc')} right={<Toggle value={notif.streak} onChange={v => setNotif(n => ({ ...n, streak: v }))} />} chevron={false} />
            <SettingRow icon="trophy"   iconBg="#FFE9A8" iconFg="#8B6A14" title={t('notifAchievements')} right={<Toggle value={notif.achievements} onChange={v => setNotif(n => ({ ...n, achievements: v }))} />} chevron={false} />
            <SettingRow icon="calendar" iconBg="#CFEDE6" iconFg="#177264" title={t('notifWeekly')}       subtitle={t('notifWeeklyDesc')} right={<Toggle value={notif.weekly} onChange={v => setNotif(n => ({ ...n, weekly: v }))} />} chevron={false} last />
          </SectionGroup>

          <SectionGroup title={t('appearanceSection')}>
            <div className="py-3">
              <Segmented
                options={[
                  { value: 'light',  label: t('themeLight') },
                  { value: 'dark',   label: t('themeDark')  },
                  { value: 'system', label: t('themeAuto')  },
                ]}
                value={mode}
                onChange={v => setMode(v as 'light' | 'dark' | 'system')}
              />
            </div>
          </SectionGroup>
        </div>
      </div>
    </div>
  );
}
