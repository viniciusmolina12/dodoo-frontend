import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Explicit map required for Turbopack (no dynamic template literal imports)
const importMessages = {
  'pt-BR': () => import('../messages/pt-BR.json'),
  'en-US': () => import('../messages/en-US.json'),
  'es-ES': () => import('../messages/es-ES.json'),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await importMessages[locale]()).default;

  return {
    locale,
    messages,
  };
});
