import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Download,
  Edit3,
  NotebookPen,
  Pin,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { getLocalizedComponent } from '../i18n/dataTranslations';
import { useLanguage } from '../i18n/LanguageContext';

export type NoteCategory = 'circuit_idea' | 'note' | 'fault_log' | 'shopping';

export interface UserNote {
  id: string;
  title: string;
  category: NoteCategory;
  voltage: string;
  parts: string[];
  content: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'elec_user_notes_v1';

function loadNotes(): UserNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const NotesView: React.FC = () => {
  const { lang, pick } = useLanguage();

  const [notes, setNotes] = useState<UserNote[]>(loadNotes);
  const [filterCat, setFilterCat] = useState<'all' | NoteCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<NoteCategory>('circuit_idea');
  const [voltage, setVoltage] = useState<string>('');
  const [parts, setParts] = useState<string[]>([]);
  const [partInput, setPartInput] = useState<string>('');
  const [showPartPicker, setShowPartPicker] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [pinned, setPinned] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Inline delete confirmation (no window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  const categoryLabels: Record<NoteCategory, string> = useMemo(
    () => ({
      circuit_idea: pick('فكرة دائرة', 'Idée de circuit', 'Circuit Idea'),
      note: pick('ملاحظة عامة', 'Note générale', 'General Note'),
      fault_log: pick('سجل أعطال وقياس', 'Journal de pannes', 'Repair & Test Log'),
      shopping: pick('قائمة قطع للشراء', 'Liste d’achats', 'Parts Checklist'),
    }),
    [pick]
  );

  const quickSuggestedParts = useMemo(
    () =>
      ELECTRONIC_COMPONENTS.slice(0, 14).map((comp) => ({
        id: comp.id,
        label: getLocalizedComponent(comp, lang).name,
        short: comp.nameEn,
      })),
    [lang]
  );

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('circuit_idea');
    setVoltage('');
    setParts([]);
    setPartInput('');
    setShowPartPicker(false);
    setContent('');
    setPinned(false);
    setFormError('');
  };

  const pushEditorHistory = () => {
    try {
      if (!window.history.state?.__notesEditor) {
        const base =
          window.history.state && typeof window.history.state === 'object'
            ? window.history.state
            : {};
        window.history.pushState({ ...base, __notesEditor: true }, '');
      }
    } catch {
      // Ignore history errors
    }
  };

  const closeEditor = () => {
    if (window.history.state?.__notesEditor) {
      window.history.back();
    } else {
      setIsEditorOpen(false);
      resetForm();
    }
  };

  useEffect(() => {
    if (!isEditorOpen) return;
    const onPopState = (e: PopStateEvent) => {
      if (!e.state?.__notesEditor) {
        setIsEditorOpen(false);
        resetForm();
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isEditorOpen]);

  const openNewEditor = (presetCat?: NoteCategory) => {
    resetForm();
    if (presetCat) setCategory(presetCat);
    pushEditorHistory();
    setIsEditorOpen(true);
  };

  const openEditEditor = (note: UserNote) => {
    setEditingId(note.id);
    setTitle(note.title);
    setCategory(note.category);
    setVoltage(note.voltage);
    setParts(note.parts);
    setPartInput('');
    setShowPartPicker(false);
    setContent(note.content);
    setPinned(note.pinned);
    setFormError('');
    pushEditorHistory();
    setIsEditorOpen(true);
  };

  const handleAddPart = (rawValue: string) => {
    const cleaned = rawValue.trim();
    if (!cleaned) return;
    if (!parts.includes(cleaned)) {
      setParts((prev) => [...prev, cleaned]);
    }
    setPartInput('');
  };

  const handleRemovePart = (target: string) => {
    setParts((prev) => prev.filter((p) => p !== target));
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle && !trimmedContent) {
      setFormError(
        pick(
          'يرجى كتابة عنوان أو نص الملاحظة قبل الحفظ.',
          'Veuillez saisir un titre ou le contenu de la note avant d’enregistrer.',
          'Please enter a note title or content before saving.'
        )
      );
      return;
    }

    const now = Date.now();
    const finalTitle =
      trimmedTitle ||
      pick('ملاحظة بدون عنوان', 'Note sans titre', 'Untitled Note');

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? {
                ...n,
                title: finalTitle,
                category,
                voltage: voltage.trim(),
                parts,
                content: trimmedContent,
                pinned,
                updatedAt: now,
              }
            : n
        )
      );
    } else {
      const newNote: UserNote = {
        id: `note_${now}_${Math.random().toString(36).slice(2, 7)}`,
        title: finalTitle,
        category,
        voltage: voltage.trim(),
        parts,
        content: trimmedContent,
        pinned,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    closeEditor();
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) {
      setIsEditorOpen(false);
      resetForm();
    }
    setConfirmDeleteId(null);
  };

  const handleFillCircuitTemplate = () => {
    if (!title.trim()) {
      setTitle(
        pick(
          'فكرة دائرة: منظم جهد 5 فولت مع مؤشر ليد',
          'Idée : Régulateur +5V avec témoin LED',
          'Idea: 5V Regulated Supply with LED Indicator'
        )
      );
    }
    setCategory('circuit_idea');
    if (!voltage.trim()) setVoltage('9V-12V → 5V DC');
    if (parts.length === 0) {
      setParts(['LM7805', '100µF', '100nF', '1N4007', '330Ω', 'LED']);
    }
    if (!content.trim()) {
      setContent(
        pick(
          'الهدف: تغذية متحكم أو حساسات بجهد 5V مستقر.\nملاحظات التوصيل: وضع دايود حماية على المدخل + مكثف تنعيم 100µF قبل المنظم ومكثف 100nF على المخرج.\nالاختبار المطلوب: قياس جهد الخرج بالملتيميتر والتأكد من عدم سخونة المنظم.',
          'Objectif : alimenter des capteurs en 5V stable.\nCâblage : diode 1N4007 en entrée + 100µF avant le 7805 + 100nF en sortie.\nTest : mesurer 5.0V DC au multimètre et vérifier l’échauffement.',
          'Goal: Power sensors with a steady 5V rail.\nWiring: 1N4007 reverse-polarity diode on input + 100µF input cap + 100nF output cap.\nNext test: Verify 5.0V DC output and check thermal dissipation.'
        )
      );
    }
  };

  const handleExportNotes = () => {
    if (notes.length === 0) return;
    const lines = notes.map((n, index) => {
      const dateStr = formatDate(n.updatedAt);
      const partsLine = n.parts.length > 0 ? `\n${pick('العناصر:', 'Composants :', 'Parts:')} ${n.parts.join(' · ')}` : '';
      const voltLine = n.voltage ? `\n${pick('الجهد:', 'Tension :', 'Voltage:')} ${n.voltage}` : '';
      return `[${index + 1}] ${n.title} (${categoryLabels[n.category]} - ${dateStr})${voltLine}${partsLine}\n${n.content}\n----------------------------------------`;
    });

    const header = `${pick('مفكرة الأفكار والملاحظات الإلكترونية - دليل العناصر الإلكترونية', 'Mes Notes Électroniques - Guide des Composants', 'Personal Electronics Notes - Components Guide')}\n\n`;
    const blob = new Blob([header + lines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'electronics-notes.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(
      pick(
        'تم تصدير ملاحظاتك في ملف نصي بنجاح.',
        'Notes exportées dans un fichier texte avec succès.',
        'Notes exported to a text file successfully.'
      )
    );
    window.setTimeout(() => setExportNotice(''), 3500);
  };

  const formatDate = (ts: number) => {
    try {
      const locale = lang === 'ar' ? 'ar-EG' : lang === 'fr' ? 'fr-FR' : 'en-US';
      return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(ts));
    } catch {
      return '';
    }
  };

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes
      .filter((n) => {
        if (filterCat !== 'all' && n.category !== filterCat) return false;
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.voltage.toLowerCase().includes(q) ||
          n.parts.some((p) => p.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, filterCat, searchQuery]);

  const counts = useMemo(
    () => ({
      all: notes.length,
      circuit_idea: notes.filter((n) => n.category === 'circuit_idea').length,
      note: notes.filter((n) => n.category === 'note').length,
      fault_log: notes.filter((n) => n.category === 'fault_log').length,
      shopping: notes.filter((n) => n.category === 'shopping').length,
    }),
    [notes]
  );

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#E2E8F0] dark:border-[#334155]">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {pick(
              'دفتر الملاحظات وأفكار الدوائر الخاصة',
              'Carnet de notes et d’idées de circuits',
              'Personal Notes & Circuit Ideas'
            )}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {pick(
              'دوّن أفكار مشاريعك، قيم العناصر، وملاحظات الفحص والقياس. تُحفظ جميع ملاحظاتك محلياً على جهازك وتعمل بدون إنترنت.',
              'Notez vos idées de montages, valeurs de composants et relevés de mesure. Tout est enregistré localement hors ligne.',
              'Jot down circuit ideas, component values, and test logs. All notes are stored locally on your device for offline access.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {notes.length > 0 && (
            <button
              type="button"
              onClick={handleExportNotes}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>{pick('تصدير (.txt)', 'Exporter (.txt)', 'Export (.txt)')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => openNewEditor()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#059669] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#047857] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{pick('ملاحظة أو فكرة جديدة', 'Nouvelle note / idée', 'New Note / Idea')}</span>
          </button>
        </div>
      </section>

      {exportNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold text-[#059669] dark:text-emerald-300">
          <Check className="h-4 w-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Inline Editor Panel */}
      {isEditorOpen && (
        <form
          onSubmit={handleSaveNote}
          className="rounded-2xl border border-[#059669]/40 dark:border-emerald-700/60 bg-white dark:bg-[#1E293B] p-5 sm:p-6 shadow-sm space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingId
                ? pick('تعديل الملاحظة', 'Modifier la note', 'Edit Note')
                : pick('إضافة ملاحظة أو فكرة دائرة جديدة', 'Nouvelle note ou idée de circuit', 'Create Note or Circuit Idea')}
            </h3>

            <div className="flex items-center gap-2">
              {!editingId && (
                <button
                  type="button"
                  onClick={handleFillCircuitTemplate}
                  className="min-h-[38px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {pick('تعبئة نموذج فكرة دائرة', 'Modèle d’idée circuit', 'Fill Circuit Idea Template')}
                </button>
              )}
              <button
                type="button"
                onClick={closeEditor}
                aria-label={pick('إغلاق المحرر', 'Fermer l’éditeur', 'Close editor')}
                className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {formError && (
            <p className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
              {formError}
            </p>
          )}

          {/* Title & Voltage */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {pick('العنوان', 'Titre', 'Title')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder={pick(
                  'مثلاً: دائرة إنذار بانقطاع الضوء أو ملاحظات فحص 555',
                  'Ex : Alarme lumineuse LDR ou notes sur NE555',
                  'e.g. LDR light alarm or 555 timer pinout notes'
                )}
                className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#059669] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {pick('جهد التشغيل (اختياري)', 'Tension (optionnel)', 'Supply Voltage (optional)')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                placeholder="5V / 9V / 12V DC"
                className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3.5 text-sm font-mono-num text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#059669] focus:outline-none"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {pick('التصنيف', 'Catégorie', 'Category')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['circuit_idea', 'note', 'fault_log', 'shopping'] as NoteCategory[]).map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`min-h-[42px] rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                      active
                        ? 'border-[#059669] bg-emerald-50 text-[#059669] dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Components Used / Tagged Parts */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {pick('العناصر المستخدمة في الفكرة (اختياري)', 'Composants utilisés (optionnel)', 'Components Used (optional)')}
              </label>
              <button
                type="button"
                onClick={() => setShowPartPicker((s) => !s)}
                className="text-xs font-semibold text-[#059669] dark:text-emerald-400 hover:underline"
              >
                {showPartPicker
                  ? pick('إخفاء قائمة الدليل', 'Masquer la liste', 'Hide guide list')
                  : pick('اختر سريعاً من عناصر الدليل', 'Choisir depuis le guide', 'Quick-pick from guide')}
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={partInput}
                onChange={(e) => setPartInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPart(partInput);
                  }
                }}
                placeholder={pick(
                  'أضف اسم عنصر أو قيمته (مثلاً: 10kΩ أو BC547)...',
                  'Ajouter un composant ou valeur (ex : 10kΩ, BC547)...',
                  'Add part or value (e.g. 10kΩ, BC547)...'
                )}
                className="flex-1 min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#059669] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddPart(partInput)}
                className="min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] px-4 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                {pick('إضافة', 'Ajouter', 'Add')}
              </button>
            </div>

            {showPartPicker && (
              <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3">
                {quickSuggestedParts.map((item) => {
                  const selected = parts.includes(item.label) || parts.includes(item.short);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        selected ? handleRemovePart(item.label) : handleAddPart(item.label)
                      }
                      className={`min-h-[34px] rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                        selected
                          ? 'border-[#059669] bg-emerald-50 text-[#059669] dark:bg-emerald-950 dark:text-emerald-300'
                          : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 hover:border-[#059669]'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {parts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {parts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleRemovePart(p)}
                    className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-slate-100 dark:bg-[#0F172A] px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 transition-colors"
                    title={pick('اضغط للإزالة', 'Cliquer pour retirer', 'Click to remove')}
                  >
                    <span>{p}</span>
                    <X className="h-3 w-3 opacity-70" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {pick('التفاصيل، خطوات التوصيل أو الحسابات', 'Détails, schéma de câblage ou calculs', 'Details, Wiring Notes, or Calculations')}
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder={pick(
                'اكتب هنا شرح فكرة الدائرة، أرقام الأرجل (Pinout)، أو نتائج القياسات التي سجلتها...',
                'Décrivez ici votre idée de circuit, le brochage ou vos relevés au multimètre...',
                'Write down your circuit wiring idea, pinouts, component equations, or measurement notes...'
              )}
              className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3.5 text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#059669] focus:outline-none"
            />
          </div>

          {/* Pin Toggle + Submit */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
            <button
              type="button"
              onClick={() => setPinned((p) => !p)}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
                pinned
                  ? 'border-[#D97706] bg-amber-50 text-[#D97706] dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className="h-3.5 w-3.5" />
              <span>{pinned ? pick('مثبتة في الأعلى', 'Épinglée en haut', 'Pinned to Top') : pick('تثبيت في الأعلى', 'Épingler en haut', 'Pin to Top')}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeEditor}
                className="min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {pick('إلغاء', 'Annuler', 'Cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#059669] px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#047857] transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>{editingId ? pick('حفظ التعديلات', 'Mettre à jour', 'Save Changes') : pick('حفظ في الجهاز', 'Enregistrer localement', 'Save Locally')}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search & Category Filter Controls */}
      {notes.length > 0 && (
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={pick('ابحث في ملاحظاتك أو العناصر...', 'Rechercher dans vos notes...', 'Search your notes or parts...')}
              aria-label={pick('البحث في الملاحظات', 'Rechercher dans les notes', 'Search notes')}
              className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] ps-10 pe-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#059669] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-200/70 dark:bg-[#0F172A] p-1 border border-[#E2E8F0] dark:border-[#334155]">
            <button
              type="button"
              onClick={() => setFilterCat('all')}
              className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                filterCat === 'all'
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {pick('الكل', 'Toutes', 'All')} <span className="font-mono-num opacity-80">({counts.all})</span>
            </button>
            {(['circuit_idea', 'note', 'fault_log', 'shopping'] as NoteCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  filterCat === cat
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {categoryLabels[cat]} <span className="font-mono-num opacity-80">({counts[cat]})</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Notes Grid or Clean Empty State */}
      {notes.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-[#0F172A] text-[#059669] dark:text-emerald-400">
            <NotebookPen className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {pick('دفترك الإلكتروني جاهز للكتابة', 'Votre carnet est prêt', 'Your Electronics Notebook Is Ready')}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {pick(
                'سجّل أفكار الدوائر التي تخطر ببالك، المكونات المطلوبة لمشروعك القادم، أو قراءات الأعطال التي واجهتها — تبقى محفوظة دائماً على جهازك.',
                'Enregistrez vos idées de schémas, listes de pièces ou relevés de dépannage directement sur votre appareil.',
                'Save custom circuit schematics in words, parts lists for upcoming builds, or repair logs right inside the app offline.'
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => openNewEditor('circuit_idea')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#059669] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#047857] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{pick('إضافة فكرة دائرة', 'Ajouter une idée de circuit', 'Add Circuit Idea')}</span>
            </button>
            <button
              type="button"
              onClick={() => openNewEditor('note')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{pick('كتابة ملاحظة سريعة', 'Écrire une note', 'Write Quick Note')}</span>
            </button>
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-8 text-center space-y-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {pick('لا توجد ملاحظات مطابقة للبحث أو التصنيف المحدد.', 'Aucune note ne correspond à votre filtre.', 'No notes match your search or category filter.')}
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterCat('all');
              setSearchQuery('');
            }}
            className="min-h-[44px] rounded-xl bg-[#059669] px-4 py-2 text-xs font-bold text-white hover:bg-[#047857]"
          >
            {pick('عرض كل الملاحظات', 'Afficher toutes les notes', 'Show all notes')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredNotes.map((note) => {
            const isConfirming = confirmDeleteId === note.id;
            return (
              <article
                key={note.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 shadow-sm transition-all hover:border-[#059669] dark:hover:border-emerald-500"
              >
                <div className="space-y-3">
                  {/* Quiet unboxed metadata line (Zero-Pill Discipline) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                      <span className="font-semibold text-[#059669] dark:text-emerald-400">
                        {categoryLabels[note.category]}
                      </span>
                      {note.voltage && (
                        <>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span className="font-mono-num text-slate-700 dark:text-slate-300" dir="ltr">
                            {note.voltage}
                          </span>
                        </>
                      )}
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span className="font-mono-num">{formatDate(note.updatedAt)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePin(note.id)}
                      aria-label={note.pinned ? pick('إلغاء التثبيت', 'Désépingler', 'Unpin') : pick('تثبيت الملاحظة', 'Épingler', 'Pin note')}
                      className={`flex min-h-[40px] min-w-[40px] -me-2 items-center justify-center rounded-lg transition-colors ${
                        note.pinned
                          ? 'text-[#D97706] dark:text-amber-400'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <Pin className={`h-4 w-4 ${note.pinned ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
                    {note.title}
                  </h3>

                  {note.content && (
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                      {note.content}
                    </p>
                  )}

                  {note.parts.length > 0 && (
                    <div className="pt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {pick('العناصر:', 'Composants :', 'Parts:')}{' '}
                      </span>
                      <span>{note.parts.join(' · ')}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between gap-2">
                  {isConfirming ? (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        {pick('تأكيد الحذف؟', 'Confirmer la suppression ?', 'Confirm delete?')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[38px] rounded-lg border border-[#E2E8F0] dark:border-[#334155] px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          {pick('تراجع', 'Annuler', 'Cancel')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="min-h-[38px] rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700"
                        >
                          {pick('حذف نهائي', 'Supprimer', 'Delete')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditEditor(note)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-[#059669] dark:text-emerald-400 hover:underline"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>{pick('تعديل', 'Modifier', 'Edit')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(note.id)}
                        aria-label={pick('حذف الملاحظة', 'Supprimer la note', 'Delete note')}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{pick('حذف', 'Supprimer', 'Delete')}</span>
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
