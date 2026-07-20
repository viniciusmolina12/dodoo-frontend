'use client';

import { useRef, ClipboardEvent, KeyboardEvent, ChangeEvent } from 'react';

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled = false }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function moveFocus(index: number) {
    refs.current[index]?.focus();
  }

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < 5) moveFocus(index + 1);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const next = [...value];
        next[index] = '';
        onChange(next);
      } else if (index > 0) {
        moveFocus(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      moveFocus(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      moveFocus(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    onChange(next);
    moveFocus(Math.min(pasted.length, 5));
  }

  return (
    <div className="flex gap-3">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={digit}
          disabled={disabled}
          autoFocus={i === 0}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className={[
            'w-[52px] h-[62px]',
            'text-center text-[22px] font-bold font-fredoka text-foreground',
            'rounded-[14px] border-none outline-none',
            'transition-shadow duration-150',
            'bg-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            digit
              ? 'shadow-[inset_0_0_0_2px_#5B3FA1]'
              : 'shadow-[inset_0_0_0_1.5px_#F1ECE0] focus:shadow-[inset_0_0_0_2px_#5B3FA1]',
          ].join(' ')}
        />
      ))}
    </div>
  );
}
