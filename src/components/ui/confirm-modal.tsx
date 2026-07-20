'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CategoryIcon } from '@/components/ui/icons';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(17,12,31,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 22,
          padding: '28px 28px 24px',
          boxShadow: '0 24px 64px rgba(17,12,31,0.28), 0 0 0 1.5px var(--border)',
          maxWidth: 400, width: '100%',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 16,
          background: danger ? '#FFF0EE' : 'var(--purple-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CategoryIcon
            name={danger ? 'trash' : 'alert'}
            size={22}
            color={danger ? '#C0392B' : 'var(--purple)'}
          />
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
            fontSize: 20, color: 'var(--dark)', lineHeight: 1.2,
          }}>
            {title}
          </div>
          {description && (
            <div style={{
              fontSize: 14, color: 'var(--text-faint)',
              lineHeight: 1.5, fontFamily: 'Nunito, sans-serif',
            }}>
              {description}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, border: 'none', cursor: loading ? 'default' : 'pointer',
              padding: '13px 16px', borderRadius: 14,
              background: 'var(--surface-alt)',
              boxShadow: 'inset 0 0 0 1.5px var(--border)',
              fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15,
              color: 'var(--text-faint)',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, border: 'none', cursor: loading ? 'default' : 'pointer',
              padding: '13px 16px', borderRadius: 14,
              background: danger ? '#C0392B' : 'var(--accent)',
              fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 15,
              color: danger ? '#FFF' : 'var(--dark)',
              boxShadow: danger
                ? '0 6px 16px rgba(192,57,43,0.35), inset 0 -3px 0 rgba(0,0,0,0.1)'
                : '0 6px 16px rgba(255,167,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? '...'
              : (
                <>
                  {danger && <CategoryIcon name="trash" size={14} color="#FFF" />}
                  {confirmLabel}
                </>
              )
            }
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
