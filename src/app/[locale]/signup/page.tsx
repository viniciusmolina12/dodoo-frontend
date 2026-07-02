'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { AuthInput, SocialButton } from '@/components/ui/auth-input';
import { DODOO_CATEGORIES } from '@/data/categories';

function WebAuthBrand() {
  const t = useTranslations('auth');
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
          <div style={{ width: 36, height: 36, borderRadius: 18, background: 'radial-gradient(circle at 30% 30%, #FFE885 0%, #FFD93D 60%, #FFB627 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DodooMascot size={28} />
          </div>
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 26, color: '#FFF8E7' }}>dodoo</span>
        </div>
        <div style={{ marginTop: 36 }}>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 38, color: '#FFF8E7', lineHeight: 1.05, letterSpacing: '-0.02em', whiteSpace: 'pre-line' }}>
            {t('signupHeadline')}
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,248,231,0.72)', fontWeight: 700, marginTop: 12, lineHeight: 1.5 }}>
            {t('tagline1')}<br />{t('tagline2')}
          </div>
        </div>
        <div style={{ marginTop: 36 }}>
          <div style={{ background: 'rgba(255,217,61,0.14)', border: '1.5px solid rgba(255,217,61,0.25)', borderRadius: 18, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
            <DodooMascot size={56} />
            <div>
              <div style={{ fontSize: 14, color: '#FFD93D', fontWeight: 800, marginBottom: 5 }}>{t('bonusCoins')}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,248,231,0.78)', fontWeight: 700, lineHeight: 1.4 }}>{t('bonusDesc')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {[{ n: '12k+', l: t('statUsers') }, { n: '87k', l: t('statTasks') }, { n: '4.8★', l: t('statRating') }].map(s => (
              <div key={s.n} style={{ flex: 1, background: 'rgba(255,248,231,0.08)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: '#FFF8E7' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,248,231,0.5)', fontWeight: 800, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const tCat = useTranslations('categories');
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [terms, setTerms] = useState(false);

  const userStatus = (() => {
    if (!user) return null;
    if (user.length < 3) return 'short';
    if (!/^[a-z0-9._]+$/i.test(user)) return 'invalid';
    if (['admin', 'dodoo', 'root', 'lia.m'].includes(user.toLowerCase())) return 'taken';
    return 'ok';
  })();

  const passStrength = [pass.length >= 8, /[A-Z]/.test(pass), /[0-9]/.test(pass), /[^A-Za-z0-9]/.test(pass)].filter(Boolean).length;
  const toggleInterest = (id: string) => setInterests(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const ready = name.trim().length > 1 && userStatus === 'ok' && /^.+@.+\..+$/.test(email) && passStrength >= 2 && interests.length >= 1 && terms;

  const passLabels = ['', t('passWeak'), t('passOk'), t('passGood'), t('passExcellent')];

  return (
    <div className="dodoo-app" style={{ width: '100%', height: '100vh', display: 'flex' }}>
      <WebAuthBrand />
      <div style={{ flex: 1, overflow: 'auto', background: '#FFF8E7', padding: '40px 60px' }}>
        <div style={{ maxWidth: 500 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 30, color: '#1F1530', letterSpacing: '-0.02em' }}>{t('signupTitle')}</div>
            <div style={{ fontSize: 13.5, color: '#7A6E94', fontWeight: 700, marginTop: 6 }}>
              {t('alreadyHaveAccount')}{' '}
              <button onClick={() => router.push('../login')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 14, color: '#5B3FA1', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                {t('loginBtn')}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AuthInput label={t('name')} value={name} onChange={setName} icon="user" placeholder="Lia Mendes" compact />
            <AuthInput
              label={t('username')} value={user}
              onChange={v => setUser(v.toLowerCase().replace(/\s/g, ''))}
              icon="tag" placeholder="lia.m" compact
              suffix={userStatus === 'ok' ? <CategoryIcon name="check-fill" size={18} color="#2F7A3F" /> : undefined}
            />
          </div>
          <AuthInput label={t('email')} value={email} onChange={setEmail} type="email" icon="text" placeholder="lia@email.com" compact />
          <AuthInput label={t('password')} value={pass} onChange={setPass} type="password" icon="lock" placeholder={t('passwordPlaceholder')} compact />

          {pass.length > 0 && (
            <div style={{ marginTop: -6, marginBottom: 14, padding: '0 4px' }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                {[1, 2, 3, 4].map(i => (
                  <span key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i <= passStrength ? (passStrength <= 1 ? '#C0392B' : passStrength === 2 ? '#E5B800' : '#2F7A3F') : '#F1ECE0',
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#9A8DBA' }}>
                {passLabels[passStrength] ?? ''}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8, padding: '0 4px' }}>{t('interests')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {DODOO_CATEGORIES.map(cat => {
                const active = interests.includes(cat.id);
                return (
                  <button key={cat.id} onClick={() => toggleInterest(cat.id)} style={{
                    border: 'none', cursor: 'pointer', padding: '6px 10px 6px 6px', borderRadius: 999,
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: active ? cat.bg : '#FFFFFF', color: active ? cat.fg : '#9A8DBA',
                    boxShadow: active ? `inset 0 0 0 1.5px ${cat.fg}` : 'inset 0 0 0 1.5px #F1ECE0',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12,
                  }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, background: active ? cat.fg : '#F1ECE0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon name={cat.icon} size={11} color={active ? cat.bg : '#9A8DBA'} />
                    </span>
                    {tCat(cat.id as Parameters<typeof tCat>[0])}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={() => setTerms(!terms)} style={{
            width: '100%', border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', marginBottom: 20, textAlign: 'left',
          }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, background: terms ? '#FFD93D' : '#FFFFFF', boxShadow: terms ? 'inset 0 -2px 0 rgba(0,0,0,0.08)' : 'inset 0 0 0 1.5px #F1ECE0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {terms && <CategoryIcon name="check" size={12} color="#1F1530" />}
            </span>
            <span style={{ fontSize: 12.5, color: '#5B3FA1', fontWeight: 700, lineHeight: 1.4 }}>
              {t('termsAccept')} <span style={{ textDecoration: 'underline' }}>{t('termsLink')}</span> e a <span style={{ textDecoration: 'underline' }}>{t('privacyLink')}</span>.
            </span>
          </button>

          <button disabled={!ready} onClick={() => router.push('../tarefas')} style={{
            width: '100%', border: 'none', cursor: ready ? 'pointer' : 'not-allowed',
            padding: '14px 20px', borderRadius: 16,
            background: ready ? '#FFD93D' : '#F1ECE0', color: ready ? '#1F1530' : '#9A8DBA',
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 17,
            boxShadow: ready ? '0 6px 18px rgba(255,167,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.08)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {t('createAccount')}
            {ready && <CategoryIcon name="chevron-r" size={18} color="#1F1530" />}
          </button>
        </div>
      </div>
    </div>
  );
}
