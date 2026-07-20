'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { Segmented } from '@/components/ui/segmented';
import { DODOO_CATEGORIES } from '@/data/categories';
import { CATEGORY_MAP } from '@/lib/api/auth';
import { createTask, activateTask } from '@/lib/api/tasks';
import { useAuthStore } from '@/stores/auth-store';
import type { TaskType, RecurrenceType, Difficulty, GoalType, TaskPrivacy } from '@/lib/api/tasks';

const TYPE_MAP: Record<string, TaskType>    = { unica: 'ONCE', recorrente: 'RECURRING' };
const DIFF_MAP: Record<string, Difficulty>  = { facil: 'EASY', medio: 'MEDIUM', dificil: 'HARD' };
const GOAL_MAP: Record<string, GoalType>    = { nenhum: 'NONE', texto: 'TEXT', checklist: 'CHECKLIST' };
const PRIVACY_MAP: Record<string, TaskPrivacy> = { publico: 'PUBLIC', privado: 'PRIVATE' };

function resolveDeadline(d: string): string | undefined {
  const now = new Date();
  if (d === 'hoje')   return now.toISOString().split('T')[0];
  if (d === 'amanha') { now.setDate(now.getDate() + 1); return now.toISOString().split('T')[0]; }
  if (d === 'semana') { now.setDate(now.getDate() + 7); return now.toISOString().split('T')[0]; }
  return undefined;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

interface WebCreatePanelProps {
  onClose?: () => void;
  onCreated?: () => void;
}

export function WebCreatePanel({ onClose, onCreated }: WebCreatePanelProps) {
  const t    = useTranslations('create');
  const tCat = useTranslations('categories');
  const token = useAuthStore(s => s.token);

  const [title,      setTitle]      = useState('');
  const [desc,       setDesc]       = useState('');
  const [cat,        setCat]        = useState('saude');
  const [type,       setType]       = useState('unica');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('DAILY');
  const [startDate,  setStartDate]  = useState(todayISO);
  const [diff,       setDiff]       = useState('medio');
  const [goalType,   setGoalType]   = useState('nenhum');
  const [goalText,   setGoalText]   = useState('');
  const [goalItems,  setGoalItems]  = useState(['', '']);
  const [privacy,    setPrivacy]    = useState('publico');
  const [deadline,   setDeadline]   = useState('amanha');
  const [tags,       setTags]       = useState<string[]>([]);
  const [tagDraft,   setTagDraft]   = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const valid = title.trim().length > 0;

  const addTag = () => {
    const tag = tagDraft.trim();
    if (tag && !tags.includes(tag)) setTags(ts => [...ts, tag]);
    setTagDraft('');
  };

  const handleSubmit = async () => {
    if (!valid || !token) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title:             title.trim(),
        category:          CATEGORY_MAP[cat],
        type:              TYPE_MAP[type],
        ...(type === 'recorrente' && { recurrence, startDate }),
        privacy:           PRIVACY_MAP[privacy],
        goalType:          GOAL_MAP[goalType],
        ...(goalType === 'texto'     && { goalText }),
        ...(goalType === 'checklist' && { goalChecklist: goalItems.filter(i => i.trim()) }),
        ...(desc.trim()              && { description: desc.trim() }),
        ...(tags.length              && { tags }),
        ...(diff                     && { declaredDifficulty: DIFF_MAP[diff] }),
        ...(deadline !== 'sem'       && { deadline: resolveDeadline(deadline) }),
      };
      const created = await createTask(payload, token);
      await activateTask(created.id, token);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 24px' }}>

        {/* Title + description */}
        <div style={{ background: 'var(--surface-alt)', borderRadius: 16, padding: 14, boxShadow: 'inset 0 0 0 1.5px var(--border)', marginBottom: 18 }}>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder={t('titlePlaceholder')}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'Fredoka, sans-serif', fontWeight: 500, fontSize: 19, color: 'var(--dark)',
            }}
          />
          <textarea
            value={desc} onChange={e => setDesc(e.target.value)}
            placeholder={t('descPlaceholder')} rows={2}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none',
              fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4,
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('category')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DODOO_CATEGORIES.map(c => {
              const active = cat === c.id;
              return (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  border: 'none', cursor: 'pointer', padding: '6px 10px 6px 6px', borderRadius: 999,
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: active ? c.bg : 'var(--surface)', color: active ? c.fg : 'var(--text-faint)',
                  boxShadow: active ? `inset 0 0 0 1.5px ${c.fg}` : 'inset 0 0 0 1.5px var(--border)',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12,
                }}>
                  <span style={{ width: 18, height: 18, borderRadius: 5, background: active ? c.fg : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CategoryIcon name={c.icon} size={10} color={active ? c.bg : 'var(--text-faint)'} />
                  </span>
                  {tCat(c.id as Parameters<typeof tCat>[0])}
                </button>
              );
            })}
          </div>
        </div>

        {/* Type */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('type')}</div>
          <Segmented
            options={[
              { value: 'unica',      label: t('typeOnce'),      icon: 'check' },
              { value: 'recorrente', label: t('typeRecurring'), icon: 'clock' },
            ]}
            value={type} onChange={setType}
          />
        </div>

        {/* Recurrence + startDate (only for recurring) */}
        {type === 'recorrente' && (
          <>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('recurrence')}</div>
              <Segmented
                options={[
                  { value: 'DAILY',   label: t('recurrenceDaily'),   icon: 'clock'    },
                  { value: 'WEEKLY',  label: t('recurrenceWeekly'),  icon: 'calendar' },
                  { value: 'MONTHLY', label: t('recurrenceMonthly'), icon: 'calendar' },
                ]}
                value={recurrence} onChange={v => setRecurrence(v as RecurrenceType)}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('startDate')}</div>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                min={todayISO()}
                style={{
                  width: '100%', border: 'none', outline: 'none', background: 'var(--surface)',
                  borderRadius: 12, padding: '10px 14px',
                  boxShadow: 'inset 0 0 0 1.5px var(--border)',
                  fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: 'var(--dark)',
                }}
              />
            </div>
          </>
        )}

        {/* Difficulty */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('difficulty')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { v: 'facil',   l: t('diffEasy')   },
              { v: 'medio',   l: t('diffMedium') },
              { v: 'dificil', l: t('diffHard')   },
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

        {/* Goal */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('goal')}</div>
          <Segmented
            options={[
              { value: 'nenhum',    label: t('goalNone'),      icon: 'dash' },
              { value: 'texto',     label: t('goalText'),      icon: 'text' },
              { value: 'checklist', label: t('goalChecklist'), icon: 'list' },
            ]}
            value={goalType} onChange={setGoalType}
          />
          {goalType === 'texto' && (
            <div style={{ marginTop: 10, background: 'var(--surface)', borderRadius: 13, padding: '10px 14px', boxShadow: 'inset 0 0 0 1.5px var(--border)' }}>
              <textarea value={goalText} onChange={e => setGoalText(e.target.value)} placeholder={t('goalTextPlaceholder')} rows={2}
                style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: 'var(--dark)', lineHeight: 1.4 }}
              />
            </div>
          )}
          {goalType === 'checklist' && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {goalItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', borderRadius: 12, padding: '8px 12px', boxShadow: 'inset 0 0 0 1.5px var(--border)' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: '2px solid var(--border)', flexShrink: 0 }} />
                  <input value={item} onChange={e => setGoalItems(it => it.map((x, j) => j === i ? e.target.value : x))}
                    placeholder={t('checklistItem', { n: i + 1 })}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: 'var(--dark)' }}
                  />
                </div>
              ))}
              <button onClick={() => setGoalItems(it => [...it, ''])} style={{
                border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer',
                borderRadius: 12, padding: 8, fontWeight: 800, color: 'var(--purple)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                fontFamily: 'Nunito, sans-serif', fontSize: 12.5,
              }}>
                <CategoryIcon name="plus" size={13} color="var(--purple)" /> {t('addItem')}
              </button>
            </div>
          )}
        </div>

        {/* Privacy + Deadline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('privacy')}</div>
            <Segmented
              options={[
                { value: 'publico', label: t('privacyPublic'),  icon: 'globe' },
                { value: 'privado', label: t('privacyPrivate'), icon: 'lock'  },
              ]}
              value={privacy} onChange={setPrivacy}
            />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('deadline')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {[
                { id: 'hoje',   l: t('deadlineToday')    },
                { id: 'amanha', l: t('deadlineTomorrow') },
                { id: 'semana', l: t('deadlineWeek')     },
                { id: 'sem',    l: t('deadlineNone')     },
              ].map(o => {
                const active = deadline === o.id;
                return (
                  <button key={o.id} onClick={() => setDeadline(o.id)} style={{
                    border: 'none', cursor: 'pointer', padding: '7px 11px', borderRadius: 999,
                    fontWeight: 800, fontSize: 12, fontFamily: 'Nunito, sans-serif',
                    background: active ? 'var(--dark)' : 'var(--surface)',
                    color: active ? 'var(--accent)' : 'var(--purple)',
                    boxShadow: active ? 'none' : 'inset 0 0 0 1.5px var(--border)',
                  }}>{o.l}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--purple)', letterSpacing: 0.3, marginBottom: 8 }}>{t('tags')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', background: 'var(--surface)', borderRadius: 14, padding: 10, boxShadow: 'inset 0 0 0 1.5px var(--border)' }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 4px 4px 9px', borderRadius: 999, background: 'var(--purple-bg)', color: 'var(--purple)', fontWeight: 800, fontSize: 12 }}>
                #{tag}
                <button onClick={() => setTags(ts => ts.filter(x => x !== tag))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2 }}>
                  <CategoryIcon name="dash" size={11} color="var(--purple)" />
                </button>
              </span>
            ))}
            <input value={tagDraft} onChange={e => setTagDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
              onBlur={addTag}
              placeholder={tags.length ? '' : 'foco, manhã…'}
              style={{ flex: 1, minWidth: 60, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontSize: 13, color: 'var(--dark)' }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 24px', borderTop: '1.5px solid var(--border)', background: 'var(--surface)' }}>
        {error && (
          <div style={{ marginBottom: 10, fontSize: 12.5, fontWeight: 700, color: '#C0392B', background: '#FFF0EE', borderRadius: 10, padding: '8px 12px' }}>
            {error}
          </div>
        )}
        <button
          disabled={!valid || submitting}
          onClick={handleSubmit}
          style={{
            width: '100%', border: 'none', cursor: valid && !submitting ? 'pointer' : 'not-allowed',
            padding: '14px 20px', borderRadius: 14,
            background: valid && !submitting ? 'var(--accent)' : 'var(--border)',
            color: valid && !submitting ? 'var(--dark)' : 'var(--text-faint)',
            fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 16,
            boxShadow: valid && !submitting ? '0 6px 16px rgba(255,167,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.08)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {valid && !submitting && <CategoryIcon name="plus" size={18} color="var(--dark)" />}
          {submitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </div>
  );
}
