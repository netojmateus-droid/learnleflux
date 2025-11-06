export function tokenize(text: string, lang = 'en'): string[] {
  if (typeof (Intl as typeof Intl & { Segmenter?: any }).Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(lang, { granularity: 'word' });
    const segments = Array.from(segmenter.segment(text)) as Array<{ segment: string; isWordLike?: boolean }>;
    return segments
      .map((segment) => (segment.isWordLike ? segment.segment.toLowerCase() : ''))
      .filter((token) => token.length > 0);
  }

  return text
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0);
}