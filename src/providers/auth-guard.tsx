'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';

const PUBLIC_PATHS = new Set(['/login', '/signup', '/verify-email']);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token        = useAuthStore(s => s.token);
  const hasHydrated  = useAuthStore(s => s._hasHydrated);
  const pathname     = usePathname();
  const router       = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    const isPublic = PUBLIC_PATHS.has(pathname);
    if (!token && !isPublic) {
      router.replace('/login');
    }
  }, [token, hasHydrated, pathname, router]);

  return <>{children}</>;
}
