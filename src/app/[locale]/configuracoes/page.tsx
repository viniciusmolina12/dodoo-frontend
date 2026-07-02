'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { WebLayout } from '@/components/layout/web-layout';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { Toggle } from '@/components/ui/toggle';
import { Segmented } from '@/components/ui/segmented';
import { SettingRow } from '@/components/ui/setting-row';
import { SectionGroup } from '@/components/ui/section-group';
import { DODOO_CATEGORIES } from '@/data/categories';
import { AVATAR_OPTIONS, BORDER_OPTIONS, TITLE_OPTIONS, THEME_OPTIONS } from '@/data/customize';

type SettingsSection = 'profile' | 'avatar' | 'border' | 'title' | 'theme' | 'account' | 'security' | 'terms' | 'invite';

function ProfileCard() {
  const t = useTranslations('settings');
  const tProfile = useTranslations('profile');
  return (
    <div style={{ background: 'linear-gradient(135deg, #5B3FA1 0%, #7857C8 100%)', borderRadius: 24, padding: 18, color: '#FFF8E7', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 22px rgba(91,63,161,0.25)' }}>
      <div style={{ position: 'absolute', top: -40, right: -30, width: 130, height: 130, borderRadius: 65, background: 'rgba(255,217,61,0.16)' }} />
      <div style={{ position: 'absolute', bottom: -50, left: -20, width: 110, height: 110, borderRadius: 55, background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid rgba(255,248,231,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <DodooMascot size={62} />
          </div>
          <div style={{ position: 'absolute', bottom: -2, right: -4, background: '#1F1530', color: '#FFD93D', padding: '3px 8px', borderRadius: 999, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 11, border: '2px solid #5B3FA1', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <CategoryIcon name="star" size={10} color="#FFD93D" />
            nv 12
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, lineHeight: 1.1 }}>Lia Mendes</div>
          <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 700, marginTop: 2 }}>@lia.m</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '4px 10px', background: 'rgba(255,217,61,0.22)', borderRadius: 999, fontSize: 11, fontWeight: 800, color: '#FFD93D', boxShadow: 'inset 0 0 0 1px rgba(255,217,61,0.3)' }}>
            <CategoryIcon name="trophy" size={10} color="#FFD93D" />
            Mestre da Manhã
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', marginTop: 16, padding: '12px 0 0', borderTop: '1.5px dashed rgba(255,217,61,0.35)' }}>
        {[
          { v: '87',  l: 'statPrestige', i: 'star'  },
          { v: '240', l: 'statCoins',    i: 'coin'  },
          { v: '7d',  l: 'statStreak',   i: 'flame' },
          { v: '43',  l: 'statValidated',i: 'check' },
        ].map((s, idx, arr) => (
          <div key={s.i} style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <CategoryIcon name={s.i} size={13} color="#FFD93D" />
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17, color: '#FFF8E7' }}>{s.v}</span>
              </div>
              <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, marginTop: 1 }}>
                {/* profile namespace has statPrestige etc. but we're inside settings. Use profile t() */}
                {tProfile(s.l as Parameters<typeof tProfile>[0])}
              </div>
            </div>
            {idx < arr.length - 1 && <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,217,61,0.18)' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function WebSettingsNav({ active, onSelect }: { active: SettingsSection; onSelect: (s: SettingsSection) => void }) {
  const t = useTranslations('settings');
  const WEB_SETTINGS_NAV: ({ id: SettingsSection; icon: string; label: string } | { divider: true; label: string })[] = [
    { id: 'profile',  icon: 'user',   label: t('navProfile')  },
    { divider: true,  label: t('groupCustomize') },
    { id: 'avatar',   icon: 'user',   label: t('navAvatar')   },
    { id: 'border',   icon: 'circle', label: t('navBorder')   },
    { id: 'title',    icon: 'trophy', label: t('navTitle')    },
    { id: 'theme',    icon: 'spark',  label: t('navTheme')    },
    { divider: true,  label: t('groupAccount') },
    { id: 'account',  icon: 'user',   label: t('navAccount')  },
    { id: 'security', icon: 'lock',   label: t('navSecurity') },
    { id: 'terms',    icon: 'text',   label: t('navTerms')    },
    { id: 'invite',   icon: 'people', label: t('navInvite')   },
  ];

  return (
    <div style={{ width: 226, height: '100%', flexShrink: 0, borderRight: '1.5px solid #EDE7D6', background: '#FAF7EE', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ padding: '24px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 10px', borderRadius: 14, background: 'rgba(91,63,161,0.06)' }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, flexShrink: 0, background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #FFFFFF', boxShadow: '0 2px 8px rgba(91,63,161,0.12)' }}>
            <DodooMascot size={36} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 14.5, color: '#1F1530', lineHeight: 1.2 }}>Lia Mendes</div>
            <div style={{ fontSize: 11, color: '#9A8DBA', fontWeight: 700, marginTop: 1 }}>@lia.m · nv 12</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 10px', flex: 1 }}>
        {WEB_SETTINGS_NAV.map((item, i) => {
          if ('divider' in item) {
            return <div key={i} style={{ fontSize: 10, fontWeight: 800, color: '#9A8DBA', letterSpacing: 0.7, textTransform: 'uppercase', padding: '14px 8px 6px' }}>{item.label}</div>;
          }
          const on = active === item.id;
          return (
            <button key={item.id} onClick={() => onSelect(item.id)} style={{
              width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left',
              padding: '9px 12px', borderRadius: 10, marginBottom: 1,
              background: on ? '#EFE6FF' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13,
              color: on ? '#5B3FA1' : '#5A4E70',
            }}>
              <CategoryIcon name={item.icon} size={15} color={on ? '#5B3FA1' : '#9A8DBA'} />
              {item.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: '14px 10px 20px' }}>
        <button style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '9px 12px', borderRadius: 10, background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13, color: '#C0392B' }}>
          <CategoryIcon name="back" size={15} color="#C0392B" />
          {t('signOut')}
        </button>
      </div>
    </div>
  );
}

function ProfileDetail() {
  const t = useTranslations('settings');
  const tCat = useTranslations('categories');
  const [interests, setInterests] = useState(['saude', 'estudos', 'criativa', 'casa']);
  const [streakProtect, setStreakProtect] = useState(true);
  const [receiveEvals, setReceiveEvals] = useState(true);
  const [defaultPrivacy, setDefaultPrivacy] = useState('publico');
  const [notif, setNotif] = useState({ evals: true, feed: true, streak: true, achievements: true, weekly: false });
  const [theme, setTheme] = useState('auto');

  return (
    <div style={{ padding: '32px 36px' }}>
      <ProfileCard />
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div>
          <SectionGroup title={t('interestsTitle')}>
            <div style={{ padding: '12px 0 14px' }}>
              <div style={{ fontSize: 12.5, color: '#7A6E94', fontWeight: 700, marginBottom: 12, lineHeight: 1.35 }}>{t('interestsDesc')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {DODOO_CATEGORIES.map(cat => {
                  const active = interests.includes(cat.id);
                  return (
                    <button key={cat.id} onClick={() => setInterests(p => p.includes(cat.id) ? p.filter(x => x !== cat.id) : [...p, cat.id])} style={{
                      border: 'none', cursor: 'pointer', padding: '6px 10px 6px 6px', borderRadius: 999,
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: active ? cat.bg : '#FFFFFF', color: active ? cat.fg : '#9A8DBA',
                      boxShadow: active ? `inset 0 0 0 1.5px ${cat.fg}` : 'inset 0 0 0 1.5px #F1ECE0',
                      fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12,
                    }}>
                      <span style={{ width: 18, height: 18, borderRadius: 5, background: active ? cat.fg : '#F1ECE0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CategoryIcon name={cat.icon} size={10} color={active ? cat.bg : '#9A8DBA'} />
                      </span>
                      {tCat(cat.id as Parameters<typeof tCat>[0])}
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionGroup>
          <SectionGroup title={t('tasksSection')}>
            <div style={{ padding: '12px 0', borderBottom: '1.5px solid #F4F0E5' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#1F1530', marginBottom: 8 }}>{t('defaultPrivacy')}</div>
              <Segmented
                options={[
                  { value: 'publico', label: t('privacyPublic'),  icon: 'globe' },
                  { value: 'privado', label: t('privacyPrivate'), icon: 'lock'  },
                ]}
                value={defaultPrivacy} onChange={setDefaultPrivacy}
              />
            </div>
            <SettingRow icon="flame" iconBg="#FFD9D2" iconFg="#C0392B" title={t('streakTitle')} subtitle={streakProtect ? t('streakSubOn') : t('streakSubOff')} right={<Toggle value={streakProtect} onChange={setStreakProtect} />} chevron={false} last />
          </SectionGroup>
          <SectionGroup title={t('evalSection')}>
            <SettingRow icon="eye" iconBg="#EFE6FF" iconFg="#5B3FA1" title={t('receiveEvals')} subtitle={t('receiveEvalsDesc')} right={<Toggle value={receiveEvals} onChange={setReceiveEvals} />} chevron={false} last />
          </SectionGroup>
        </div>
        <div>
          <SectionGroup title={t('notifSection')}>
            <SettingRow icon="star"     iconBg="#FFF1B5" iconFg="#8B6A14" title={t('notifEvals')}        right={<Toggle value={notif.evals}        onChange={v => setNotif(n => ({ ...n, evals: v }))} />}        chevron={false} />
            <SettingRow icon="list"     iconBg="#EFE6FF" iconFg="#5B3FA1" title={t('notifFeed')}         right={<Toggle value={notif.feed}         onChange={v => setNotif(n => ({ ...n, feed: v }))} />}         chevron={false} />
            <SettingRow icon="flame"    iconBg="#FFD9D2" iconFg="#C0392B" title={t('notifStreak')}       subtitle={t('notifStreakDesc')} right={<Toggle value={notif.streak} onChange={v => setNotif(n => ({ ...n, streak: v }))} />} chevron={false} />
            <SettingRow icon="trophy"   iconBg="#FFE9A8" iconFg="#8B6A14" title={t('notifAchievements')} right={<Toggle value={notif.achievements} onChange={v => setNotif(n => ({ ...n, achievements: v }))} />} chevron={false} />
            <SettingRow icon="calendar" iconBg="#CFEDE6" iconFg="#177264" title={t('notifWeekly')}       subtitle={t('notifWeeklyDesc')} right={<Toggle value={notif.weekly} onChange={v => setNotif(n => ({ ...n, weekly: v }))} />} chevron={false} last />
          </SectionGroup>
          <SectionGroup title={t('appearanceSection')}>
            <div style={{ padding: '12px 0' }}>
              <Segmented
                options={[
                  { value: 'claro',  label: t('themeLight') },
                  { value: 'escuro', label: t('themeDark')  },
                  { value: 'auto',   label: t('themeAuto')  },
                ]}
                value={theme} onChange={setTheme}
              />
            </div>
          </SectionGroup>
        </div>
      </div>
    </div>
  );
}

function AvatarDetail() {
  const t = useTranslations('settings');
  const [selected, setSelected] = useState('classic');
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 22, color: '#1F1530', marginBottom: 20 }}>{t('avatarTitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {AVATAR_OPTIONS.map(a => {
          const isSel = a.id === selected;
          return (
            <button key={a.id} onClick={() => setSelected(a.id)} style={{
              border: 'none', cursor: 'pointer', padding: '16px 8px 12px', borderRadius: 18, background: '#FFFFFF',
              boxShadow: isSel ? 'inset 0 0 0 2.5px #5B3FA1' : 'inset 0 0 0 1.5px #F1ECE0',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: a.palette.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: a.palette.belly }}>{a.name[0]}</span>
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#1F1530' }}>{a.name}</div>
              {!a.owned && <div style={{ fontSize: 10, fontWeight: 800, color: '#8B6A14', background: '#FFF1B5', padding: '2px 6px', borderRadius: 999 }}>{a.cost}</div>}
              {a.equipped && <div style={{ fontSize: 9, fontWeight: 800, color: '#1F1530', background: '#FFD93D', padding: '2px 6px', borderRadius: 999 }}>{t('equipped')}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TitleDetail() {
  const t = useTranslations('settings');
  const [equipped, setEquipped] = useState('manha');
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 22, color: '#1F1530', marginBottom: 20 }}>{t('titleTitle')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TITLE_OPTIONS.map(titleOpt => {
          const eq = equipped === titleOpt.id;
          const locked = !titleOpt.unlocked;
          return (
            <button key={titleOpt.id} disabled={locked} onClick={() => setEquipped(titleOpt.id)} style={{
              border: 'none', cursor: locked ? 'not-allowed' : 'pointer', padding: 14, borderRadius: 18, background: '#FFFFFF', textAlign: 'left',
              boxShadow: eq ? 'inset 0 0 0 2.5px #5B3FA1' : 'inset 0 0 0 1.5px #F1ECE0',
              display: 'flex', alignItems: 'center', gap: 12, opacity: locked ? 0.85 : 1,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: locked ? '#F1ECE0' : titleOpt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CategoryIcon name={locked ? 'lock' : titleOpt.icon} size={20} color={locked ? '#9A8DBA' : titleOpt.fg} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: locked ? '#F1ECE0' : titleOpt.bg, color: locked ? '#9A8DBA' : titleOpt.fg, fontSize: 11, fontWeight: 800 }}>
                    <CategoryIcon name={locked ? 'lock' : titleOpt.icon} size={10} color={locked ? '#9A8DBA' : titleOpt.fg} />
                    {titleOpt.name}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#7A6E94', fontWeight: 700 }}>
                  {locked ? titleOpt.unlock : t('unlocked', { condition: titleOpt.unlock })}
                </div>
                {locked && titleOpt.progress != null && (
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#F1ECE0', overflow: 'hidden' }}>
                      <div style={{ width: `${((titleOpt.progress ?? 0) / (titleOpt.needed ?? 1)) * 100}%`, height: '100%', background: '#5B3FA1', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: '#5B3FA1', fontWeight: 800 }}>{titleOpt.progress}/{titleOpt.needed}</div>
                  </div>
                )}
              </div>
              {eq && <span style={{ padding: '4px 8px', background: '#FFD93D', borderRadius: 999, fontSize: 10, fontWeight: 800, color: '#1F1530' }}>{t('equipped')}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ThemeDetail() {
  const t = useTranslations('settings');
  const [selected, setSelected] = useState('lavanda');
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 22, color: '#1F1530', marginBottom: 20 }}>{t('themeTitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {THEME_OPTIONS.map(themeOpt => {
          const isSel = selected === themeOpt.id;
          return (
            <button key={themeOpt.id} onClick={() => setSelected(themeOpt.id)} style={{
              border: 'none', cursor: 'pointer', padding: 6, borderRadius: 16, background: '#FFFFFF',
              boxShadow: isSel ? 'inset 0 0 0 2.5px #5B3FA1' : 'inset 0 0 0 1.5px #F1ECE0',
            }}>
              <div style={{ height: 80, borderRadius: 12, background: `linear-gradient(135deg, ${themeOpt.gradient[0]} 0%, ${themeOpt.gradient[1]} 100%)`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, width: 50, height: 50, borderRadius: 25, background: `${themeOpt.accent}40` }} />
                <div style={{ position: 'absolute', bottom: 8, left: 8, width: 22, height: 22, borderRadius: 11, background: themeOpt.accent }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px 2px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#1F1530' }}>{themeOpt.name}</div>
                {themeOpt.equipped && <span style={{ padding: '1px 6px', background: '#FFD93D', borderRadius: 999, fontSize: 9, fontWeight: 800, color: '#1F1530' }}>{t('equipped')}</span>}
                {!themeOpt.owned && <div style={{ fontSize: 10, fontWeight: 800, color: '#8B6A14', background: '#FFF1B5', padding: '2px 6px', borderRadius: 999 }}>{themeOpt.cost}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SimpleDetail({ titleKey, children }: { titleKey: string; children?: React.ReactNode }) {
  const t = useTranslations('settings');
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 22, color: '#1F1530', marginBottom: 20 }}>
        {t(titleKey as Parameters<typeof t>[0])}
      </div>
      {children ?? <div style={{ color: '#9A8DBA', fontSize: 14, fontWeight: 700 }}>{t('soon')}</div>}
    </div>
  );
}

function SettingsDetail({ sub }: { sub: SettingsSection }) {
  switch (sub) {
    case 'profile':  return <ProfileDetail />;
    case 'avatar':   return <AvatarDetail />;
    case 'border':   return <SimpleDetail titleKey="borderTitle" />;
    case 'title':    return <TitleDetail />;
    case 'theme':    return <ThemeDetail />;
    case 'account':  return <SimpleDetail titleKey="accountTitle" />;
    case 'security': return <SimpleDetail titleKey="securityTitle" />;
    case 'terms':    return <SimpleDetail titleKey="termsTitle" />;
    case 'invite':   return <SimpleDetail titleKey="inviteTitle" />;
  }
}

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [activeSub, setActiveSub] = useState<SettingsSection>('profile');

  const handleNav = (id: string) => {
    if (id === 'list') router.push('../tarefas');
    if (id === 'feed') router.push('../feed');
  };

  return (
    <WebLayout active="settings" onNav={handleNav} onCreate={() => router.push('../tarefas')}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <WebSettingsNav active={activeSub} onSelect={setActiveSub} />
        <div style={{ flex: 1, overflow: 'auto', background: '#FFFFFF' }}>
          <SettingsDetail sub={activeSub} />
        </div>
      </div>
    </WebLayout>
  );
}
