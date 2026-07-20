'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { AuthInput, SocialButton } from '@/components/ui/auth-input';
import { login, ApiError } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';

// ─── Brand panel ──────────────────────────────────────────────────────────────

function WebAuthBrand({ mode }: { mode: 'login' | 'signup' }) {
  const t = useTranslations('auth');
  const features = [
    { icon: 'check', text: t('featureTrack') },
    { icon: 'eye',   text: t('featureEval')  },
    { icon: 'coin',  text: t('featureEarn')  },
    { icon: 'trophy',text: t('featureRank')  },
  ];
  return (
    <div style={{
      width: '44%', background: '#5B3FA1', flexShrink: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '60px 52px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: 130, background: 'rgba(255,217,61,0.10)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -50, width: 220, height: 220, borderRadius: 110, background: 'rgba(255,255,255,0.05)' }} />

      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DodooMascot size={28} />
          </div>
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 26, color: '#FFF8E7' }}>dodoo</span>
        </div>

        <div style={{ marginTop: 36 }}>
          <div style={{
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 38,
            color: '#FFF8E7', lineHeight: 1.05, letterSpacing: '-0.02em',
            whiteSpace: 'pre-line',
          }}>
            {mode === 'login' ? t('loginHeadline') : t('signupHeadline')}
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,248,231,0.72)', fontWeight: 700, marginTop: 12, lineHeight: 1.5 }}>
            {t('tagline1')}<br />{t('tagline2')}
          </div>
        </div>

        {mode === 'login' ? (
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: 'rgba(255,217,61,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CategoryIcon name={f.icon} size={16} color="#FFD93D" />
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,248,231,0.85)', fontWeight: 700 }}>{f.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 36 }}>
            <div style={{ background: 'rgba(255,217,61,0.14)', border: '1.5px solid rgba(255,217,61,0.25)', borderRadius: 18, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <DodooMascot size={56} />
              <div>
                <div style={{ fontSize: 14, color: '#FFD93D', fontWeight: 800, marginBottom: 5 }}>{t('bonusCoins')}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,248,231,0.78)', fontWeight: 700, lineHeight: 1.4 }}>{t('bonusDesc')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router   = useRouter();
  const t        = useTranslations('auth');
  const setAuth  = useAuthStore(s => s.setAuth);

  const [loginField,   setLoginField]   = useState('');
  const [pass,         setPass]         = useState('');
  const [keep,         setKeep]         = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [unverified,   setUnverified]   = useState(false);

  const ready = loginField.trim().length >= 3 && pass.length >= 3 && !isSubmitting;

  async function handleSubmit() {
    if (!ready) return;
    setIsSubmitting(true);
    setError(null);
    setUnverified(false);

    try {
      const { token, user } = await login({ login: loginField.trim(), password: pass });
      setAuth(token, user);
      router.push('../tarefas');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setUnverified(true);
        } else if (err.status === 401) {
          setError('E-mail/usuário ou senha incorretos.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="dodoo-app" style={{ width: '100%', height: '100vh', display: 'flex' }}>
      <WebAuthBrand mode="login" />
      <div style={{
        flex: 1, overflow: 'auto', background: '#FFF8E7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 60px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 30, color: '#1F1530', letterSpacing: '-0.02em' }}>
              {t('loginTitle')}
            </div>
            <div style={{ fontSize: 13.5, color: '#7A6E94', fontWeight: 700, marginTop: 6 }}>
              {t('newHere')}{' '}
              <button onClick={() => router.push('../signup')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 14, color: '#5B3FA1', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                {t('createFreeAccount')}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <SocialButton provider="google" compact />
            <SocialButton provider="apple" iconOnly compact />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1.5, background: '#F1ECE0' }} />
            <div style={{ fontSize: 11, fontWeight: 800, color: '#9A8DBA', letterSpacing: 0.5 }}>{t('or')}</div>
            <div style={{ flex: 1, height: 1.5, background: '#F1ECE0' }} />
          </div>

          <AuthInput
            label={t('emailOrUser')}
            value={loginField}
            onChange={setLoginField}
            icon="user"
            placeholder="lia.m ou lia@email.com"
            compact
          />
          <AuthInput
            label={t('password')}
            value={pass}
            onChange={setPass}
            type="password"
            icon="lock"
            placeholder="••••••••"
            compact
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, marginTop: 4 }}>
            <button onClick={() => setKeep(!keep)} style={{
              border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: 7,
              fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12.5, color: '#5B3FA1',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 5,
                background: keep ? '#FFD93D' : '#FFFFFF',
                boxShadow: keep ? 'inset 0 -2px 0 rgba(0,0,0,0.08)' : 'inset 0 0 0 1.5px #F1ECE0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {keep && <CategoryIcon name="check" size={11} color="#1F1530" />}
              </span>
              {t('keepConnected')}
            </button>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12.5, color: '#5B3FA1' }}>
              {t('forgotPassword')}
            </button>
          </div>

          {/* Error states */}
          {error && (
            <div style={{ background: '#FFF0EE', border: '1px solid #FADBD8', borderRadius: 12, padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#C0392B', marginBottom: 16 }}>
              {error}
            </div>
          )}
          {unverified && (
            <div style={{ background: '#FFF8E7', border: '1px solid #F1ECE0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#7A6E94' }}>
                E-mail ainda não verificado.
              </span>
              <button
                onClick={() => router.push(`../verify-email?email=${encodeURIComponent(loginField.trim())}`)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 13.5, color: '#5B3FA1', textDecoration: 'underline', textUnderlineOffset: 3, flexShrink: 0 }}
              >
                Verificar agora
              </button>
            </div>
          )}

          <button
            disabled={!ready}
            onClick={handleSubmit}
            style={{
              width: '100%', border: 'none', cursor: ready ? 'pointer' : 'not-allowed',
              padding: '14px 20px', borderRadius: 16,
              background: ready ? '#FFD93D' : '#F1ECE0',
              color: ready ? '#1F1530' : '#9A8DBA',
              fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17,
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: ready ? '0 6px 18px rgba(255,167,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.08)' : 'none',
              transition: 'opacity 0.15s',
            }}
          >
            {isSubmitting ? '...' : t('loginBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
