'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { DodooMascot } from '@/components/ui/logo';
import { verifyEmail, resendVerification, ApiError } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { SignupBrandPanel } from '../signup/components/SignupBrandPanel';
import { OtpInput } from './components/OtpInput';

// ─── Constants ────────────────────────────────────────────────────────────────

const CODE_LENGTH = 6;
const TIMER_SECONDS = 3 * 60;

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setTimeLeft(seconds);
    if (seconds <= 0) return;
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [resetKey, seconds]);

  const isExpired = timeLeft === 0;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  return { isExpired, formatted: `${mm}:${ss}`, reset: () => setResetKey(k => k + 1) };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function VerifyEmailPage() {
  const router      = useRouter();
  const params      = useSearchParams();
  const t           = useTranslations('auth');

  const setAuth = useAuthStore(s => s.setAuth);

  const emailParam = params.get('email') ?? '';
  const needsEmailInput = !isValidEmail(emailParam);

  const [email,        setEmail]        = useState(needsEmailInput ? '' : emailParam);
  const [emailConfirmed, setEmailConfirmed] = useState(!needsEmailInput);
  const [emailInput,   setEmailInput]   = useState('');
  const [emailError,   setEmailError]   = useState<string | null>(null);

  const [digits,      setDigits]      = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [otpKey,      setOtpKey]      = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending,  setIsResending]  = useState(false);
  const [submitError,  setSubmitError]  = useState<string | null>(null);

  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    if (!needsEmailInput && emailParam) {
      resendVerification(emailParam).catch(() => {/* silent — OTP screen still renders */});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEmailConfirm() {
    if (!isValidEmail(emailInput.trim())) {
      setEmailError('Digite um e-mail válido.');
      return;
    }
    setEmailError(null);
    setIsSendingCode(true);
    try {
      await resendVerification(emailInput.trim());
      setEmail(emailInput.trim());
      setEmailConfirmed(true);
    } catch (err) {
      setEmailError(
        err instanceof ApiError ? err.message : 'Erro ao enviar o código. Tente novamente.',
      );
    } finally {
      setIsSendingCode(false);
    }
  }

  const { isExpired, formatted, reset } = useCountdown(TIMER_SECONDS);

  const isFilled  = digits.every(d => d !== '');
  const canSubmit = isFilled && !isExpired && !isSubmitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { token, user } = await verifyEmail(email, digits.join(''));
      setAuth(token, user);
      router.push('../tarefas');
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Erro de conexão. Verifique sua internet e tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (isResending) return;
    setIsResending(true);
    setSubmitError(null);
    try {
      await resendVerification(email);
      setDigits(Array(CODE_LENGTH).fill(''));
      setOtpKey(k => k + 1);
      reset();
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Erro ao reenviar. Tente novamente.',
      );
    } finally {
      setIsResending(false);
    }
  }

  if (!emailConfirmed) {
    return (
      <div className="dodoo-app flex w-full h-screen">
        <SignupBrandPanel />

        <div className="flex-1 overflow-auto bg-background flex items-center">
          <div className="px-[60px] py-[40px] w-full max-w-[500px]">

            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 mb-8 border-0 bg-transparent cursor-pointer p-0 font-extrabold text-[13.5px] text-purple"
            >
              <CategoryIcon name="back" size={16} color="#5B3FA1" />
              {t('back')}
            </button>

            <div className="mb-8">
              <h1 className="font-fredoka font-semibold text-[30px] text-foreground tracking-[-0.02em]">
                {t('verifyTitle')}
              </h1>
              <p className="text-[13.5px] text-muted font-bold mt-1.5">
                Para receber o código, informe seu e-mail cadastrado.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-extrabold text-muted tracking-[0.06em] mb-1.5">
                E-MAIL
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={e => { setEmailInput(e.target.value); setEmailError(null); }}
                onKeyDown={e => e.key === 'Enter' && handleEmailConfirm()}
                placeholder="seu@email.com"
                className="w-full border border-[#F1ECE0] rounded-2xl px-4 py-3 text-[15px] font-bold text-foreground bg-white outline-none focus:border-purple transition-colors"
              />
              {emailError && (
                <p className="mt-2 text-[12.5px] font-bold text-error">{emailError}</p>
              )}
            </div>

            <button
              onClick={handleEmailConfirm}
              disabled={emailInput.trim().length < 5 || isSendingCode}
              className="w-full border-0 py-3.5 px-5 rounded-2xl font-fredoka font-semibold text-[17px] transition-opacity disabled:cursor-not-allowed bg-accent text-foreground shadow-[0_6px_18px_rgba(255,167,0,0.35),inset_0_-3px_0_rgba(0,0,0,0.08)] disabled:bg-border disabled:text-faint disabled:shadow-none"
            >
              {isSendingCode ? '...' : 'Continuar'}
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dodoo-app flex w-full h-screen">
      <SignupBrandPanel />

      <div className="flex-1 overflow-auto bg-background flex items-center">
        <div className="px-[60px] py-[40px] w-full max-w-[500px]">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 mb-8 border-0 bg-transparent cursor-pointer p-0 font-extrabold text-[13.5px] text-purple"
          >
            <CategoryIcon name="back" size={16} color="#5B3FA1" />
            {t('back')}
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-fredoka font-semibold text-[30px] text-foreground tracking-[-0.02em]">
              {t('verifyTitle')}
            </h1>
            <p className="text-[13.5px] text-muted font-bold mt-1.5">
              {t('verifySentCode')}{' '}
              <span className="text-purple">{email}</span>
            </p>
          </div>

          {/* OTP inputs */}
          <div className="mb-5">
            <OtpInput
              key={otpKey}
              value={digits}
              onChange={setDigits}
              disabled={isSubmitting}
            />
          </div>

          {/* Timer row */}
          <div className="flex items-center justify-between min-h-[40px] mb-6">
            {isExpired ? (
              <>
                <span className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-error">
                  <CategoryIcon name="clock" size={15} color="#C0392B" />
                  {t('codeExpired')}
                </span>
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="bg-accent text-foreground font-fredoka font-semibold text-[15px] px-4 py-[9px] rounded-[14px] border-0 cursor-pointer shadow-[0_4px_14px_rgba(255,167,0,0.30),inset_0_-2px_0_rgba(0,0,0,0.07)] disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                >
                  {isResending ? '...' : t('resendCode')}
                </button>
              </>
            ) : (
              <span className="text-[13px] font-extrabold text-faint tabular-nums">
                {formatted}
              </span>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[#FFF0EE] border border-[#FADBD8] text-error text-[13px] font-bold">
              {submitError}
            </div>
          )}

          {/* Confirm button */}
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`w-full border-0 py-3.5 px-5 rounded-2xl font-fredoka font-semibold text-[17px] flex items-center justify-center transition-opacity mb-5 ${
              canSubmit
                ? 'cursor-pointer bg-accent text-foreground shadow-[0_6px_18px_rgba(255,167,0,0.35),inset_0_-3px_0_rgba(0,0,0,0.08)]'
                : 'cursor-not-allowed bg-border text-faint'
            } ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? '...' : t('confirmCode')}
          </button>

          {/* Spam note */}
          <div className="flex items-center gap-3 bg-[rgba(91,63,161,0.06)] rounded-2xl px-4 py-3.5">
            <div className="shrink-0">
              <DodooMascot size={36} />
            </div>
            <p className="text-[13px] font-bold text-muted leading-snug">
              {t('spamNote')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
