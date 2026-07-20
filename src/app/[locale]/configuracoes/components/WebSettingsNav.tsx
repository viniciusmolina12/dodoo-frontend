'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { useAuthStore } from '@/stores/auth-store';
import type { SettingsSection } from './types';

type NavItem =
  | { id: SettingsSection; icon: string; label: string }
  | { divider: true; label: string };

interface Props {
  active: SettingsSection;
  onSelect: (s: SettingsSection) => void;
}

export function WebSettingsNav({ active, onSelect }: Props) {
  const t         = useTranslations('settings');
  const router    = useRouter();
  const clearAuth = useAuthStore(s => s.clearAuth);

  const handleSignOut = () => {
    clearAuth();
    router.replace('/login');
  };

  const NAV: NavItem[] = [
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
    <div className="w-[226px] h-full shrink-0 flex flex-col overflow-auto border-r border-border bg-surface-alt">
      {/* User card */}
      <div className="px-[18px] pt-6 pb-[18px]">
        <div
          className="flex items-center gap-[11px] px-2.5 py-2.5 rounded-[14px]"
          style={{ background: 'rgba(91,63,161,0.06)' }}
        >
          <div
            className="w-[46px] h-[46px] rounded-full shrink-0 flex items-center justify-center border-[3px] border-white"
            style={{ background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)', boxShadow: '0 2px 8px rgba(91,63,161,0.12)' }}
          >
            <DodooMascot size={36} />
          </div>
          <div className="min-w-0">
            <div className="font-fredoka font-semibold text-[14.5px] text-foreground leading-[1.2]">Lia Mendes</div>
            <div className="text-[11px] text-faint font-bold mt-px">@lia.m · nv 12</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-2.5">
        {NAV.map((item, i) => {
          if ('divider' in item) {
            return (
              <div key={i} className="text-[10px] font-extrabold text-faint tracking-[0.07em] uppercase px-2 pt-3.5 pb-1.5">
                {item.label}
              </div>
            );
          }
          const on = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full border-none cursor-pointer text-left px-3 py-[9px] rounded-[10px] mb-px flex items-center gap-2.5 font-sans font-extrabold text-[13px] transition-colors ${on ? 'bg-purple-bg text-purple' : 'bg-transparent text-muted'}`}
            >
              <CategoryIcon name={item.icon} size={15} color={on ? '#5B3FA1' : '#9A8DBA'} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Sign out */}
      <div className="px-2.5 pt-3.5 pb-5">
        <button onClick={handleSignOut} className="w-full border-none cursor-pointer text-left px-3 py-[9px] rounded-[10px] bg-transparent flex items-center gap-2.5 font-sans font-extrabold text-[13px] text-error">
          <CategoryIcon name="back" size={15} color="#C0392B" />
          {t('signOut')}
        </button>
      </div>
    </div>
  );
}
