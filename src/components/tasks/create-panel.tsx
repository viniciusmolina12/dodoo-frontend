'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { Segmented } from '@/components/ui/segmented';
import { DODOO_CATEGORIES } from '@/data/categories';

interface WebCreatePanelProps {
  onClose?: () => void;
}

export function WebCreatePanel({ onClose }: WebCreatePanelProps) {
  const t = useTranslations('create');
  const tCat = useTranslations('categories');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('saude');
  const [type, setType] = useState('unica');
  const [diff, setDiff] = useState('medio');
  const [goalType, setGoalType] = useState('nenhum');
  const [goalText, setGoalText] = useState('');
  const [goalItems, setGoalItems] = useState(['', '']);
  const [privacy, setPrivacy] = useState('publico');
  const [deadline, setDeadline] = useState('amanha');
  const [tags, setTags] = useState<string[]>(['manhã']);
  const [tagDraft, setTagDraft] = useState('');
  const valid = title.trim().length > 0;

  const addTag = () => {
    const tag = tagDraft.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setTagDraft('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '22px 24px 16px', borderBottom: '1.5px solid #F1ECE0',
        display: 'flex', alignItems: 'center',
        position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 2,
      }}>
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 20, color: '#1F1530', flex: 1 }}>
          {t('panelTitle')}
        </div>
        <button onClick={onClose} style={{
          border: 'none', cursor: 'pointer', background: '#F4EFFF',
          width: 34, height: 34, borderRadius: 17, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CategoryIcon name="back" size={16} color="#5B3FA1" />
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '18px 24px' }}>
        <div style={{ background: '#FAF7EE', borderRadius: 16, padding: 14, boxShadow: 'inset 0 0 0 1.5px #F1ECE0', marginBottom: 18 }}>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder={t('titlePlaceholder')}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'Fredoka, sans-serif', fontWeight: 500, fontSize: 19, color: '#1F1530',
            }}
          />
          <textarea
            value={desc} onChange={e => setDesc(e.target.value)}
            placeholder={t('descPlaceholder')} rows={2}
            style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none',
              fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: '#7A6E94', marginTop: 6, lineHeight: 1.4,
            }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8 }}>{t('category')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DODOO_CATEGORIES.map(c => {
              const active = cat === c.id;
              return (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  border: 'none', cursor: 'pointer', padding: '6px 10px 6px 6px', borderRadius: 999,
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: active ? c.bg : '#FFFFFF', color: active ? c.fg : '#9A8DBA',
                  boxShadow: active ? `inset 0 0 0 1.5px ${c.fg}` : 'inset 0 0 0 1.5px #F1ECE0',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12,
                }}>
                  <span style={{ width: 18, height: 18, borderRadius: 5, background: active ? c.fg : '#F1ECE0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CategoryIcon name={c.icon} size={10} color={active ? c.bg : '#9A8DBA'} />
                  </span>
                  {tCat(c.id as Parameters<typeof tCat>[0])}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8 }}>{t('type')}</div>
          <Segmented
            options={[
              { value: 'unica',      label: t('typeOnce'),      icon: 'check' },
              { value: 'recorrente', label: t('typeRecurring'), icon: 'clock' },
            ]}
            value={type} onChange={setType}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8 }}>{t('difficulty')}</div>
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
                  background: active ? '#FFD93D' : '#FFFFFF',
                  boxShadow: active ? '0 4px 12px rgba(255,167,0,0.3), inset 0 -2px 0 rgba(0,0,0,0.08)' : 'inset 0 0 0 1.5px #F1ECE0',
                  fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 14,
                  color: active ? '#1F1530' : '#5B3FA1',
                }}>{d.l}</button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8 }}>{t('goal')}</div>
          <Segmented
            options={[
              { value: 'nenhum',    label: t('goalNone'),      icon: 'dash' },
              { value: 'texto',     label: t('goalText'),      icon: 'text' },
              { value: 'checklist', label: t('goalChecklist'), icon: 'list' },
            ]}
            value={goalType} onChange={setGoalType}
          />
          {goalType === 'texto' && (
            <div style={{ marginTop: 10, background: '#FFFFFF', borderRadius: 13, padding: '10px 14px', boxShadow: 'inset 0 0 0 1.5px #F1ECE0' }}>
              <textarea value={goalText} onChange={e => setGoalText(e.target.value)} placeholder={t('goalTextPlaceholder')} rows={2}
                style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: '#1F1530', lineHeight: 1.4 }}
              />
            </div>
          )}
          {goalType === 'checklist' && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {goalItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', borderRadius: 12, padding: '8px 12px', boxShadow: 'inset 0 0 0 1.5px #F1ECE0' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: '2px solid #C7BDE6', flexShrink: 0 }} />
                  <input value={item} onChange={e => setGoalItems(it => it.map((x, j) => j === i ? e.target.value : x))}
                    placeholder={t('checklistItem', { n: i + 1 })}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: '#1F1530' }}
                  />
                </div>
              ))}
              <button onClick={() => setGoalItems(it => [...it, ''])} style={{
                border: '2px dashed #C7BDE6', background: 'transparent', cursor: 'pointer',
                borderRadius: 12, padding: 8, fontWeight: 800, color: '#5B3FA1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                fontFamily: 'Nunito, sans-serif', fontSize: 12.5,
              }}>
                <CategoryIcon name="plus" size={13} color="#5B3FA1" /> {t('addItem')}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8 }}>{t('privacy')}</div>
            <Segmented
              options={[
                { value: 'publico', label: t('privacyPublic'),  icon: 'globe' },
                { value: 'privado', label: t('privacyPrivate'), icon: 'lock'  },
              ]}
              value={privacy} onChange={setPrivacy}
            />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8 }}>{t('deadline')}</div>
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
                    background: active ? '#1F1530' : '#FFFFFF',
                    color: active ? '#FFD93D' : '#5B3FA1',
                    boxShadow: active ? 'none' : 'inset 0 0 0 1.5px #F1ECE0',
                  }}>{o.l}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5B3FA1', letterSpacing: 0.3, marginBottom: 8 }}>{t('tags')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', background: '#FFFFFF', borderRadius: 14, padding: 10, boxShadow: 'inset 0 0 0 1.5px #F1ECE0' }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 4px 4px 9px', borderRadius: 999, background: '#EFE6FF', color: '#5B3FA1', fontWeight: 800, fontSize: 12 }}>
                #{tag}
                <button onClick={() => setTags(ts => ts.filter(x => x !== tag))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2 }}>
                  <CategoryIcon name="dash" size={11} color="#5B3FA1" />
                </button>
              </span>
            ))}
            <input value={tagDraft} onChange={e => setTagDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
              onBlur={addTag}
              placeholder={tags.length ? '' : 'foco, manhã…'}
              style={{ flex: 1, minWidth: 60, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontSize: 13, color: '#1F1530' }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 24px', borderTop: '1.5px solid #F1ECE0', background: '#FFFFFF' }}>
        <button disabled={!valid} style={{
          width: '100%', border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
          padding: '14px 20px', borderRadius: 14,
          background: valid ? '#FFD93D' : '#F1ECE0', color: valid ? '#1F1530' : '#9A8DBA',
          fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: 16,
          boxShadow: valid ? '0 6px 16px rgba(255,167,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.08)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {valid && <CategoryIcon name="plus" size={18} color="#1F1530" />}
          {t('submit')}
        </button>
      </div>
    </div>
  );
}
