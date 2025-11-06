export function lingueeUrl(term: string, from: string, to = 'pt'): string {
  const normalizedFrom = from.toLowerCase();
  const normalizedTo = to.toLowerCase();
  return `https://www.linguee.com/${normalizedFrom}-${normalizedTo}/search?source=auto&query=${encodeURIComponent(term)}`;
}
