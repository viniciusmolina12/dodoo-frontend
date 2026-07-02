'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { US, BR, ES } from 'country-flag-icons/react/3x2';

const LOCALES = [
  { code: 'pt-BR', flag: <BR title="Brazil" className="h-5 w-5" /> },
  { code: 'en-US', flag: <US title="United States" className="h-5 w-5" /> },
  { code: 'es-ES', flag: <ES title="Spain" className="h-5 w-5" /> },
] as const;

type NavId = 'list' | 'feed' | 'trophy' | 'settings';

interface WebSidebarProps {
  active: NavId | string;
  onNav?: (id: string) => void;
  onCreate?: () => void;
}

export function WebSidebar({ active, onNav, onCreate }: WebSidebarProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const NAV_ITEMS: { id: NavId; icon: string; label: string }[] = [
    { id: 'list', icon: 'home', label: t('today') },
    { id: 'feed', icon: 'eye', label: t('evaluate') },
    { id: 'trophy', icon: 'trophy', label: t('achievements') },
    { id: 'settings', icon: 'user', label: t('profile') },
  ];

  return (
    <div
      style={{
        width: 240,
        height: '100%',
        background: '#1F1530',
        display: 'flex',
        flexDirection: 'column',
        padding: '26px 0',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 20px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DodooMascot size={26} />
        </div>
        <span
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 600,
            fontSize: 22,
            color: '#FFF8E7',
          }}
        >
          dodoo
        </span>
      </div>

      <div style={{ padding: '0 12px', marginBottom: 16 }}>
        <button
          onClick={onCreate}
          style={{
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: '#FFD93D',
            borderRadius: 13,
            padding: '11px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            color: '#1F1530',
            boxShadow: '0 4px 12px rgba(255,167,0,0.35), inset 0 -2px 0 rgba(0,0,0,0.1)',
          }}
        >
          <CategoryIcon name="plus" size={17} color="#1F1530" />
          {t('newTask')}
        </button>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 8px', gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const on = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav?.(item.id)}
              style={{
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 11,
                background: on ? 'rgba(255,248,231,0.09)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 13.5,
                color: on ? '#FFF8E7' : 'rgba(255,248,231,0.4)',
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: on ? 'rgba(255,217,61,0.15)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CategoryIcon
                  name={item.icon}
                  size={17}
                  color={on ? '#FFD93D' : 'rgba(255,248,231,0.4)'}
                />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '14px 12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 14, padding: '0 4px', marginBottom: 12 }}>
          {[
            { icon: 'coin', val: '240', clr: '#FFD93D' },
            { icon: 'star', val: '87', clr: '#9D81E0' },
            { icon: 'flame', val: '7d', clr: '#FF9757' },
          ].map((s) => (
            <div key={s.icon} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CategoryIcon name={s.icon} size={13} color={s.clr} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: s.clr,
                  fontFamily: 'Fredoka, sans-serif',
                }}
              >
                {s.val}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 10px',
            borderRadius: 11,
            background: 'rgba(255,248,231,0.06)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              flexShrink: 0,
              background:
                'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DodooMascot size={27} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#FFF8E7', lineHeight: 1.2 }}>
              Lia Mendes
            </div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,248,231,0.38)', fontWeight: 700 }}>
              @lia.m · nv 12
            </div>
          </div>
        </div>
        <div
          style={{
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          {LOCALES.map(({ code, flag }) => {
            const active = locale === code;
            return (
              <button
                key={code}
                onClick={() => router.push(pathname, { locale: code })}
                title={code}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'transparent',
                  fontSize: 20,
                  lineHeight: 1,
                  opacity: active ? 1 : 0.3,
                  transform: active ? 'scale(1.15)' : 'scale(1)',
                  transition: 'opacity 0.15s, transform 0.15s',
                  filter: active ? 'none' : 'grayscale(40%)',
                }}
              >
                {flag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
