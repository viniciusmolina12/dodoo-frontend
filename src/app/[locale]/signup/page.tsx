'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { AuthInput } from '@/components/ui/auth-input';
import { register, CATEGORY_MAP, ApiError, type TaskCategory } from '@/lib/api/auth';
import { SignupBrandPanel } from './components/SignupBrandPanel';
import { PasswordStrengthMeter } from './components/PasswordStrengthMeter';
import { InterestPicker } from './components/InterestPicker';
import { TermsCheckbox } from './components/TermsCheckbox';
import { SubmitErrorBanner } from './components/SubmitErrorBanner';

// ─── Types ────────────────────────────────────────────────────────────────────

type UsernameStatus = 'empty' | 'short' | 'invalid' | 'taken' | 'valid';

// ─── Constants ────────────────────────────────────────────────────────────────

const RESERVED_USERNAMES = new Set(['admin', 'dodoo', 'root', 'lia.m']);

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function getUsernameStatus(username: string): UsernameStatus {
  if (!username) return 'empty';
  if (username.length < 3) return 'short';
  if (!/^[a-z0-9._]+$/i.test(username)) return 'invalid';
  if (RESERVED_USERNAMES.has(username.toLowerCase())) return 'taken';
  return 'valid';
}

function getPasswordStrength(password: string): number {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  return checks.filter(Boolean).length;
}

// ─── Form hook ────────────────────────────────────────────────────────────────

function useSignupForm() {
  const router = useRouter();

  const [name, setName]                       = useState('');
  const [username, setUsername]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interests, setInterests]             = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms]     = useState(false);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [submitError, setSubmitError]         = useState<string | null>(null);

  const usernameStatus   = getUsernameStatus(username);
  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch   = confirmPassword.length === 0 || password === confirmPassword;

  const isFormValid =
    name.trim().length >= 3 && name.trim().length <= 60 &&
    usernameStatus === 'valid' &&
    /^.+@.+\..+$/.test(email) &&
    passwordStrength >= 2 &&
    confirmPassword.length > 0 &&
    passwordsMatch &&
    interests.length >= 1 &&
    agreedToTerms;

  function handleUsernameChange(value: string) {
    setUsername(value.toLowerCase().replace(/\s/g, ''));
  }

  function toggleInterest(id: string) {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  }

  async function submit() {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await register({
        name: name.trim(),
        email,
        username,
        password,
        confirmPassword,
        interests: interests
          .map(id => CATEGORY_MAP[id])
          .filter((v): v is TaskCategory => !!v),
      });
      router.push(`../verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.status === 409
            ? 'E-mail ou usuário já cadastrado.'
            : err.message
          : 'Erro de conexão. Verifique sua internet e tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    name, setName,
    username, handleUsernameChange,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    interests, toggleInterest,
    agreedToTerms, setAgreedToTerms,
    usernameStatus,
    passwordStrength,
    passwordsMatch,
    isFormValid,
    isSubmitting,
    submitError,
    submit,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const t      = useTranslations('auth');

  const {
    name, setName,
    username, handleUsernameChange,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    interests, toggleInterest,
    agreedToTerms, setAgreedToTerms,
    usernameStatus,
    passwordStrength,
    passwordsMatch,
    isFormValid,
    isSubmitting,
    submitError,
    submit,
  } = useSignupForm();

  const confirmPasswordError = !passwordsMatch ? t('passNoMatch') : undefined;
  const isSubmitActive       = isFormValid && !isSubmitting;

  return (
    <div className="dodoo-app flex w-full h-screen">
      <SignupBrandPanel />

      <div className="flex-1 overflow-auto bg-background px-[60px] py-[40px]">
        <div className="max-w-[500px]">

          {/* Header */}
          <div className="mb-7">
            <h1 className="font-fredoka font-semibold text-[30px] text-foreground tracking-[-0.02em]">
              {t('signupTitle')}
            </h1>
            <p className="text-[13.5px] text-muted font-bold mt-1.5">
              {t('alreadyHaveAccount')}{' '}
              <button
                onClick={() => router.push('../login')}
                className="border-0 bg-transparent cursor-pointer p-0 font-fredoka font-semibold text-sm text-purple underline underline-offset-[3px]"
              >
                {t('loginBtn')}
              </button>
            </p>
          </div>

          {/* Identity */}
          <div className="grid grid-cols-2 gap-3">
            <AuthInput
              label={t('name')} value={name} onChange={setName}
              icon="user" placeholder="Lia Mendes" compact
            />
            <AuthInput
              label={t('username')} value={username} onChange={handleUsernameChange}
              icon="tag" placeholder="lia.m" compact
              suffix={
                usernameStatus === 'valid'
                  ? <CategoryIcon name="check-fill" size={18} color="#2F7A3F" />
                  : undefined
              }
            />
          </div>

          <AuthInput
            label={t('email')} value={email} onChange={setEmail}
            type="email" icon="text" placeholder="lia@email.com" compact
          />

          {/* Password + strength meter */}
          <AuthInput
            label={t('password')} value={password} onChange={setPassword}
            type="password" icon="lock" placeholder={t('passwordPlaceholder')} compact
          />
          {password.length > 0 && <PasswordStrengthMeter strength={passwordStrength} />}

          <AuthInput
            label={t('confirmPassword')} value={confirmPassword} onChange={setConfirmPassword}
            type="password" icon="lock" placeholder={t('passwordPlaceholder')}
            error={confirmPasswordError} compact
          />

          {/* Interests */}
          <div className="mb-4">
            <p className="text-[11.5px] font-extrabold text-purple tracking-[0.3px] mb-2 px-1">
              {t('interests')}
            </p>
            <InterestPicker selected={interests} onToggle={toggleInterest} />
          </div>

          {/* Terms */}
          <div className="mb-5">
            <TermsCheckbox checked={agreedToTerms} onToggle={() => setAgreedToTerms(v => !v)} />
          </div>

          {/* Submission error */}
          {submitError && <SubmitErrorBanner message={submitError} />}

          {/* Submit button */}
          <button
            disabled={!isSubmitActive}
            onClick={submit}
            className={`w-full border-0 py-3.5 px-5 rounded-2xl font-fredoka font-semibold text-[17px] flex items-center justify-center gap-2 transition-opacity ${
              isSubmitActive
                ? 'cursor-pointer bg-accent text-foreground shadow-[0_6px_18px_rgba(255,167,0,0.35),inset_0_-3px_0_rgba(0,0,0,0.08)]'
                : 'cursor-not-allowed bg-border text-faint'
            } ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? '...' : t('createAccount')}
            {isSubmitActive && <CategoryIcon name="chevron-r" size={18} color="#1F1530" />}
          </button>

        </div>
      </div>
    </div>
  );
}
