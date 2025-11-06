const LANGUAGE_HINTS: Record<string, RegExp[]> = {
  pt: [/\b(que|uma|para|não|está|com)\b/iu],
  en: [/\b(the|and|you|for|with|have)\b/iu],
  es: [/\b(que|con|para|esta|como|pero)\b/iu],
  fr: [/\b(que|pour|avec|vous|être|avoir)\b/iu],
  de: [/\b(der|die|und|ist|mit|nicht)\b/iu],
  it: [/\b(che|per|con|sono|come|questa)\b/iu],
};

export function detectLanguage(text: string, fallback = 'en'): string {
  const lower = text.toLowerCase();
  let bestMatch = fallback;
  let bestScore = 0;

  Object.entries(LANGUAGE_HINTS).forEach(([lang, patterns]) => {
    const score = patterns.reduce((total, pattern) => total + (lower.match(pattern)?.length ?? 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = lang;
    }
  });

  if (bestScore === 0 && lower.length > 1000) {
    const accentScore = lower.match(/[ãõáéíóúâêôç]/g)?.length ?? 0;
    if (accentScore > 5) {
      bestMatch = 'pt';
    }
  }

  return bestMatch;
}
