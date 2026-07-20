'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon, CategoryBadge } from '@/components/ui/icons';
import { Segmented } from '@/components/ui/segmented';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { CAT_BY_API_KEY, DODOO_CATEGORIES } from '@/data/categories';
import { useAuthStore } from '@/stores/auth-store';
import { useTasksStore } from '@/stores/tasks-store';
import type { Task, Difficulty, TaskPrivacy } from '@/lib/api/tasks';

// ─── Reverse maps (API → UI keys) ────────────────────────────────────────────

const DIFF_UI: Record<string, string>    = { EASY: 'facil', MEDIUM: 'medio', HARD: 'dificil' };
const PRIVACY_UI: Record<string, string> = { PUBLIC: 'publico', PRIVATE: 'privado' };
const DIFF_API: Record<string, Difficulty>   = { facil: 'EASY', medio: 'MEDIUM', dificil: 'HARD' };
const PRIVACY_API: Record<string, TaskPrivacy> = { publico: 'PUBLIC', privado: 'PRIVATE' };

const RECUR_LABEL: Record<string, string> = { DAILY: 'Diária', WEEKLY: 'Semanal', MONTHLY: 'Mensal' };
const GOAL_LABEL:  Record<string, string> = { NONE: 'Nenhuma', TEXT: 'Texto', CHECKLIST: 'Checklist' };

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children, locked }: { children: React.ReactNode; locked?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <span style={{ fontSize: 11.5, fontWeight: 800, color: locked ? 'var(--text-faint)' : 'var(--purple)', letterSpacing: 0.3 }}>
        {children}
      </span>
      {locked && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: 10, fontWeight: 800, color: 'var(--text-faint)',
          background: 'var(--border)', padding: '2px 6px', borderRadius: 999,
        }}>
          <CategoryIcon name="lock" size={9} color="var(--text-faint)" />
          FIXO
        </span>
      )}
    </div>
  );
}

function LockedContainer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface-alt)', borderRadius: 14,
      padding: '10px 14px',
      boxShadow: 'inset 0 0 0 1.5px var(--border)',
      opacity: 0.6,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface EditPanelProps {
  task: Task;
  onClose?: () => void;
  onSaved?: () => void;
  onDeleted?: () => void;
}

export function WebEditPanel({ task, onClose, onSaved, onDeleted }: EditPanelProps) {
  const t    = useTranslations('edit');
  const tCat = useTranslations('categories');
  const tRecur = useTranslations('recur');
  const token = useAuthStore(s => s.token);
  const { updateTask, updating, deleteTask, deleting } = useTasksStore();

  const cat = CAT_BY_API_KEY[task.category] ?? DODOO_CATEGORIES[0];
  const isUpdating = updating[task.id] ?? false;
  const isDeleting = deleting[task.id] ?? false;

  // Editable state — initialized from task
  const [title,   setTitle]   = useState(task.title);
  const [desc,    setDesc]    = useState(task.description ?? '');
  const [diff,    setDiff]    = useState(DIFF_UI[task.declaredDifficulty ?? ''] ?? 'medio');
  const [privacy, setPrivacy] = useState(PRIVACY_UI[task.privacy] ?? 'publico');
  const [deadline, setDeadline] = useState(task.deadline ? task.deadline.split('T')[0] : '');
  const [tags,    setTags]    = useState<string[]>(task.tags ?? []);
  const [tagDraft, setTagDraft] = useState('');
  const [error,   setError]   = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const valid = title.trim().length > 0;

  const addTag = () => {
    const tag = tagDraft.trim();
    if (tag && !tags.includes(tag)) setTags(ts => [...ts, tag]);
    setTagDraft('');
  };

  const handleDelete = async () => {
    if (!token || isDeleting) return;
    try {
      await deleteTask(task.id, token);
      onDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
      setShowDeleteModal(false);
    }
  };

  const handleSave = async () => {
    if (!valid || !token || isUpdating) return;
    setError(null);
    try {
      await updateTask(task.id, {
        title:              title.trim(),
        description:        desc.trim() || undefined,
        tags,
        declaredDifficulty: DIFF_API[diff],
        privacy:            PRIVACY_API[privacy],
        deadline:           deadline || null,
      }, token);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ConfirmModal
        open={showDeleteModal}
        title={t('deleteModalTitle')}
        description={t('deleteModalDesc')}
        confirmLabel={t('deleteConfirm')}
        cancelLabel={t('deleteCancel')}
        danger
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Header */}
      <div style={{
        padding: '22px 24px 16px', borderBottom: '1.5px solid var(--border)',
        display: 'flex', alignItems: 'center',
        position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2,
      }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: 'var(--dark)', flex: 1 }}>
          {t('panelTitle')}
        </div>
        <button onClick={onClose} style={{
          border: 'none', cursor: 'pointer', background: 'var(--purple-bg)',
          width: 34, height: 34, borderRadius: 17, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CategoryIcon name="back" size={16} color="var(--purple)" />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── EDITÁVEL: Título + descrição ── */}
        <div>
          <FieldLabel>TÍTULO E DESCRIÇÃO</FieldLabel>
          <div style={{ background: 'var(--surface-alt)', borderRadius: 16, padding: 14, boxShadow: 'inset 0 0 0 1.5px var(--border)' }}>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'Fredoka, sans-serif', fontWeight: 500, fontSize: 19, color: 'var(--dark)',
              }}
            />
            <textarea
              value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Descrição (opcional)" rows={2}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none',
                fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4,
              }}
            />
          </div>
        </div>

        {/* ── FIXO: Categoria ── */}
        <div>
          <FieldLabel locked>{t('category')}</FieldLabel>
          <LockedContainer>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CategoryBadge cat={cat} size={30} />
              <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--dark)' }}>
                {tCat(cat.id as Parameters<typeof tCat>[0])}
              </span>
            </div>
          </LockedContainer>
        </div>

        {/* ── FIXO: Tipo ── */}
        <div>
          <FieldLabel locked>{t('type')}</FieldLabel>
          <LockedContainer>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'var(--purple-bg)', color: 'var(--purple)',
              fontSize: 12.5, fontWeight: 800, padding: '5px 12px', borderRadius: 999,
            }}>
              <CategoryIcon name={task.type === 'RECURRING' ? 'clock' : 'check'} size={12} color="var(--purple)" />
              {task.type === 'RECURRING' ? t('typeRecurring') : t('typeOnce')}
            </span>
          </LockedContainer>
        </div>

        {/* ── FIXO: Recorrência + Data início (somente se recorrente) ── */}
        {task.type === 'RECURRING' && (
          <div>
            <FieldLabel locked>{t('recurrence')} · {t('startDate')}</FieldLabel>
            <LockedContainer>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {task.recurrence && (
                  <span style={{ background: 'var(--purple-bg)', color: 'var(--purple)', fontSize: 12.5, fontWeight: 800, padding: '5px 12px', borderRadius: 999 }}>
                    {RECUR_LABEL[task.recurrence] ?? task.recurrence}
                  </span>
                )}
                {task.startDate && (
                  <span style={{ background: 'var(--border)', color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 800, padding: '5px 12px', borderRadius: 999 }}>
                    {new Date(task.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </LockedContainer>
          </div>
        )}

        {/* ── FIXO: Meta ── */}
        {task.goalType !== 'NONE' && (
          <div>
            <FieldLabel locked>{t('goal')}</FieldLabel>
            <LockedContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ background: 'var(--purple-bg)', color: 'var(--purple)', fontSize: 12.5, fontWeight: 800, padding: '5px 12px', borderRadius: 999, alignSelf: 'flex-start' }}>
                  {GOAL_LABEL[task.goalType]}
                </span>
                {task.goalType === 'TEXT' && task.goalText && (
                  <span style={{ fontSize: 13, color: 'var(--dark)', lineHeight: 1.4, paddingLeft: 2 }}>{task.goalText}</span>
                )}
                {task.goalType === 'CHECKLIST' && task.goalChecklist && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 2 }}>
                    {task.goalChecklist.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--dark)' }}>
                        <div style={{ width: 14, height: 14, borderRadius: 7, border: '2px solid var(--border)', flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </LockedContainer>
          </div>
        )}

        {/* ── EDITÁVEL: Dificuldade ── */}
        <div>
          <FieldLabel>DIFICULDADE</FieldLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { v: 'facil',   l: 'Fácil'  },
              { v: 'medio',   l: 'Médio'  },
              { v: 'dificil', l: 'Difícil' },
            ].map(d => {
              const active = diff === d.v;
              return (
                <button key={d.v} onClick={() => setDiff(d.v)} style={{
                  flex: 1, border: 'none', cursor: 'pointer', padding: '12px 8px', borderRadius: 14,
                  background: active ? 'var(--accent)' : 'var(--surface)',
                  boxShadow: active ? '0 4px 12px rgba(255,167,0,0.3), inset 0 -2px 0 rgba(0,0,0,0.08)' : 'inset 0 0 0 1.5px var(--border)',
                  fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 14,
                  color: active ? 'var(--dark)' : 'var(--purple)',
                }}>{d.l}</button>
              );
            })}
          </div>
        </div>

        {/* ── EDITÁVEL: Privacidade ── */}
        <div>
          <FieldLabel>PRIVACIDADE</FieldLabel>
          <Segmented
            options={[
              { value: 'publico', label: 'Pública',  icon: 'globe' },
              { value: 'privado', label: 'Privada', icon: 'lock'  },
            ]}
            value={privacy} onChange={setPrivacy}
          />
        </div>

        {/* ── EDITÁVEL: Prazo ── */}
        <div>
          <FieldLabel>{t('deadline')}</FieldLabel>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'var(--surface)',
              borderRadius: 12, padding: '10px 14px',
              boxShadow: 'inset 0 0 0 1.5px var(--border)',
              fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: 'var(--dark)',
            }}
          />
          {deadline && (
            <button
              onClick={() => setDeadline('')}
              style={{
                marginTop: 6, border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, padding: 0,
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              {t('deadlineNone')} →
            </button>
          )}
        </div>

        {/* ── EDITÁVEL: Tags ── */}
        <div>
          <FieldLabel>TAGS</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', background: 'var(--surface)', borderRadius: 14, padding: 10, boxShadow: 'inset 0 0 0 1.5px var(--border)' }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 4px 4px 9px', borderRadius: 999, background: 'var(--purple-bg)', color: 'var(--purple)', fontWeight: 800, fontSize: 12 }}>
                #{tag}
                <button onClick={() => setTags(ts => ts.filter(x => x !== tag))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2 }}>
                  <CategoryIcon name="dash" size={11} color="var(--purple)" />
                </button>
              </span>
            ))}
            <input
              value={tagDraft}
              onChange={e => setTagDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
              onBlur={addTag}
              placeholder={tags.length ? '' : 'foco, manhã…'}
              style={{ flex: 1, minWidth: 60, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontSize: 13, color: 'var(--dark)' }}
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ padding: '14px 24px', borderTop: '1.5px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error && (
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#C0392B', background: '#FFF0EE', borderRadius: 10, padding: '8px 12px' }}>
            {error}
          </div>
        )}
        <button
          disabled={!valid || isUpdating}
          onClick={handleSave}
          style={{
            width: '100%', border: 'none', cursor: valid && !isUpdating ? 'pointer' : 'not-allowed',
            padding: '14px 20px', borderRadius: 14,
            background: valid && !isUpdating ? 'var(--accent)' : 'var(--border)',
            color: valid && !isUpdating ? 'var(--dark)' : 'var(--text-faint)',
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 16,
            boxShadow: valid && !isUpdating ? '0 6px 16px rgba(255,167,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.08)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {valid && !isUpdating && <CategoryIcon name="check" size={18} color="var(--dark)" />}
          {isUpdating ? t('saving') : t('save')}
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            width: '100%', border: 'none', cursor: 'pointer',
            padding: '10px 16px', borderRadius: 12,
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13,
            color: '#C0392B', opacity: 0.75,
          }}
        >
          <CategoryIcon name="trash" size={13} color="#C0392B" />
          {t('delete')}
        </button>
      </div>
    </div>
  );
}
