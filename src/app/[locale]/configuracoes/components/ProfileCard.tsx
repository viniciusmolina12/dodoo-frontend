'use client';

import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';

const STATS = [
  { v: '87',  l: 'statPrestige', i: 'star'  },
  { v: '240', l: 'statCoins',    i: 'coin'  },
  { v: '7d',  l: 'statStreak',   i: 'flame' },
  { v: '43',  l: 'statValidated',i: 'check' },
] as const;

export function ProfileCard() {
  const tProfile = useTranslations('profile');

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-[18px] text-[#FFF8E7]"
      style={{ background: 'linear-gradient(135deg, #5B3FA1 0%, #7857C8 100%)', boxShadow: '0 8px 22px rgba(91,63,161,0.25)' }}
    >
      <div className="absolute -top-10 -right-8 w-[130px] h-[130px] rounded-full" style={{ background: 'rgba(255,217,61,0.16)' }} />
      <div className="absolute -bottom-12 -left-5 w-[110px] h-[110px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Top row */}
      <div className="relative flex items-center gap-3.5">
        <div className="relative shrink-0">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)', border: '4px solid rgba(255,248,231,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          >
            <DodooMascot size={62} />
          </div>
          <div className="absolute -bottom-0.5 -right-1 bg-foreground text-accent inline-flex items-center gap-1 px-2 py-[3px] rounded-full font-fredoka font-semibold text-[11px] border-2 border-purple">
            <CategoryIcon name="star" size={10} color="#FFD93D" />
            nv 12
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-fredoka font-semibold text-xl leading-[1.1]">Lia Mendes</div>
          <div className="text-xs font-bold opacity-75 mt-0.5">@lia.m</div>
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-accent"
            style={{ background: 'rgba(255,217,61,0.22)', boxShadow: 'inset 0 0 0 1px rgba(255,217,61,0.3)' }}
          >
            <CategoryIcon name="trophy" size={10} color="#FFD93D" />
            Mestre da Manhã
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="relative flex mt-4 pt-3 border-t border-dashed"
        style={{ borderColor: 'rgba(255,217,61,0.35)' }}
      >
        {STATS.map((s, idx) => (
          <div key={s.i} className="flex flex-1 items-stretch">
            <div className="flex-1 text-center px-1">
              <div className="inline-flex items-center gap-1">
                <CategoryIcon name={s.i} size={13} color="#FFD93D" />
                <span className="font-fredoka font-semibold text-[17px]">{s.v}</span>
              </div>
              <div className="text-[10px] opacity-75 font-bold mt-px">
                {tProfile(s.l as Parameters<typeof tProfile>[0])}
              </div>
            </div>
            {idx < STATS.length - 1 && (
              <div className="w-px self-stretch" style={{ background: 'rgba(255,217,61,0.18)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
