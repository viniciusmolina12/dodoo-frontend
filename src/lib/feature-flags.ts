import { env } from '@/env';

export const featureFlags = {
  feedComingSoon:         env.NEXT_PUBLIC_FEATURE_FEED_COMING_SOON         === 'true',
  achievementsComingSoon: env.NEXT_PUBLIC_FEATURE_ACHIEVEMENTS_COMING_SOON === 'true',
} as const;
