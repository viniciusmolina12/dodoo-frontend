import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_FEATURE_FEED_COMING_SOON:         z.string().optional(),
    NEXT_PUBLIC_FEATURE_ACHIEVEMENTS_COMING_SOON: z.string().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_FEATURE_FEED_COMING_SOON:         process.env.NEXT_PUBLIC_FEATURE_FEED_COMING_SOON,
    NEXT_PUBLIC_FEATURE_ACHIEVEMENTS_COMING_SOON: process.env.NEXT_PUBLIC_FEATURE_ACHIEVEMENTS_COMING_SOON,
  },
});
