import { useTranslations } from 'next-intl';
import { DodooMascot } from '@/components/ui/logo';

const BRAND_STATS: Array<{ value: string; labelKey: 'statUsers' | 'statTasks' | 'statRating' }> = [
  { value: '12k+', labelKey: 'statUsers'  },
  { value: '87k',  labelKey: 'statTasks'  },
  { value: '4.8★', labelKey: 'statRating' },
];

export function SignupBrandPanel() {
  const t = useTranslations('auth');

  return (
    <div className="w-[44%] shrink-0 flex flex-col justify-center px-[52px] py-[60px] relative overflow-hidden bg-purple">
      <div className="absolute -top-20 -right-[60px] w-[260px] h-[260px] rounded-full bg-[rgba(255,217,61,0.10)]" />
      <div className="absolute -bottom-[100px] -left-[50px] w-[220px] h-[220px] rounded-full bg-[rgba(255,255,255,0.05)]" />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[radial-gradient(circle_at_30%_30%,#FFE885_0%,#FFD93D_60%,#FFB627_100%)]">
            <DodooMascot size={28} />
          </div>
          <span className="font-fredoka font-semibold text-[26px] text-[#FFF8E7]">dodoo</span>
        </div>

        <div className="mt-9">
          <p className="font-fredoka font-semibold text-[38px] text-[#FFF8E7] leading-[1.05] tracking-[-0.02em] whitespace-pre-line">
            {t('signupHeadline')}
          </p>
          <p className="text-[15px] text-[rgba(255,248,231,0.72)] font-bold mt-3 leading-relaxed">
            {t('tagline1')}<br />{t('tagline2')}
          </p>
        </div>

        <div className="mt-9">
          <div className="bg-[rgba(255,217,61,0.14)] border border-[rgba(255,217,61,0.25)] rounded-[18px] p-[18px_20px] flex gap-4 items-center">
            <DodooMascot size={56} />
            <div>
              <p className="text-sm text-accent font-extrabold mb-[5px]">{t('bonusCoins')}</p>
              <p className="text-[13px] text-[rgba(255,248,231,0.78)] font-bold leading-snug">{t('bonusDesc')}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            {BRAND_STATS.map(stat => (
              <div key={stat.value} className="flex-1 bg-[rgba(255,248,231,0.08)] rounded-xl py-3 px-2 text-center">
                <p className="font-fredoka font-semibold text-xl text-[#FFF8E7]">{stat.value}</p>
                <p className="text-[11px] text-[rgba(255,248,231,0.5)] font-extrabold mt-0.5">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
