import React, { useMemo } from 'react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../data/glossaryData';
import { useLanguage } from '../i18n/LanguageContext';
import { AppLanguage } from '../i18n/uiTranslations';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface CompiledMatcher {
  regex: RegExp;
  aliasMap: Map<string, GlossaryTerm>;
}

const matcherCache = new Map<AppLanguage, CompiledMatcher>();

function getMatcher(lang: AppLanguage): CompiledMatcher {
  const cached = matcherCache.get(lang);
  if (cached) return cached;

  const entries: { alias: string; term: GlossaryTerm }[] = [];
  for (const term of GLOSSARY_TERMS) {
    const list =
      lang === 'ar' ? term.aliasesAr : lang === 'fr' ? term.aliasesFr : term.aliasesEn;
    for (const alias of list) {
      if (alias.trim()) {
        entries.push({ alias: alias.trim(), term });
      }
    }
  }

  // Sort longest first so multi-word phrases win over single words
  entries.sort((a, b) => b.alias.length - a.alias.length);

  const aliasMap = new Map<string, GlossaryTerm>();
  const patterns: string[] = [];

  for (const { alias, term } of entries) {
    const key = alias.toLowerCase();
    if (aliasMap.has(key)) continue;
    aliasMap.set(key, term);

    const escaped = escapeRegex(alias);
    const isAscii = /^[a-z0-9\s/-]+$/i.test(alias);

    if (isAscii) {
      patterns.push(`(?<![A-Za-zÀ-ÿ0-9])${escaped}(?![A-Za-zÀ-ÿ0-9])`);
    } else if (lang === 'ar') {
      if (alias.startsWith('ال')) {
        // Allow single-letter Arabic conjunctions/prepositions (و، ب، ك، ف) before ال
        patterns.push(`(?<![\\u0600-\\u06FF0-9A-Za-z])(?:[وبكف])?${escaped}(?![\\u0600-\\u06FF0-9A-Za-z])`);
      } else {
        patterns.push(`(?<![\\u0600-\\u06FF0-9A-Za-z])${escaped}(?![\\u0600-\\u06FF0-9A-Za-z])`);
      }
    } else {
      patterns.push(`(?<![A-Za-zÀ-ÿ0-9])${escaped}(?![A-Za-zÀ-ÿ0-9])`);
    }
  }

  const regex = new RegExp(`(${patterns.join('|')})`, 'gi');
  const compiled = { regex, aliasMap };
  matcherCache.set(lang, compiled);
  return compiled;
}

function resolveTermForMatch(matched: string, aliasMap: Map<string, GlossaryTerm>): GlossaryTerm | undefined {
  const lower = matched.toLowerCase();
  const direct = aliasMap.get(lower);
  if (direct) return direct;
  // Check stripped single Arabic prefix (و/ب/ك/ف) before ال
  if (lower.length > 3 && /^[وبكف]ال/.test(lower)) {
    return aliasMap.get(lower.slice(1));
  }
  return undefined;
}

export function extractGlossaryTermsFromTexts(texts: string[], lang: AppLanguage): GlossaryTerm[] {
  const { regex, aliasMap } = getMatcher(lang);
  const foundMap = new Map<string, GlossaryTerm>();

  for (const text of texts) {
    if (!text) continue;
    regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const term = resolveTermForMatch(m[0], aliasMap);
      if (term && !foundMap.has(term.id)) {
        foundMap.set(term.id, term);
      }
    }
  }

  return Array.from(foundMap.values());
}

interface GlossaryTextProps {
  text: string;
  onSelectTerm: (term: GlossaryTerm) => void;
}

export const GlossaryText: React.FC<GlossaryTextProps> = ({ text, onSelectTerm }) => {
  const { lang, pick } = useLanguage();

  const segments = useMemo(() => {
    if (!text) return [{ type: 'text' as const, value: '' }];
    const { regex, aliasMap } = getMatcher(lang);
    const result: Array<
      | { type: 'text'; value: string }
      | { type: 'term'; value: string; term: GlossaryTerm }
    > = [];

    regex.lastIndex = 0;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const matchedStr = match[0];
      const start = match.index;
      if (start > lastIndex) {
        result.push({ type: 'text', value: text.slice(lastIndex, start) });
      }
      const term = resolveTermForMatch(matchedStr, aliasMap);
      if (term) {
        result.push({ type: 'term', value: matchedStr, term });
      } else {
        result.push({ type: 'text', value: matchedStr });
      }
      lastIndex = start + matchedStr.length;
    }

    if (lastIndex < text.length) {
      result.push({ type: 'text', value: text.slice(lastIndex) });
    }

    return result;
  }, [text, lang]);

  return (
    <>
      {segments.map((seg, idx) =>
        seg.type === 'text' ? (
          <React.Fragment key={idx}>{seg.value}</React.Fragment>
        ) : (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTerm(seg.term);
            }}
            title={pick('اضغط لعرض شرح المصطلح في القاموس', 'Cliquer pour voir la définition', 'Click to view glossary definition')}
            className="inline border-b border-dotted border-[#059669]/80 text-[#059669] dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:border-solid rounded-sm px-0.5 transition-colors cursor-pointer"
          >
            {seg.value}
          </button>
        )
      )}
    </>
  );
};
