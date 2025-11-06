const TIMECODE_PATTERN = /\d{2}:\d{2}:\d{2}[.,]\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}[.,]\d{3}/;

function cleanupBlock(block: string): string {
  const lines = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index) => {
      if (index === 0 && /^\d+$/.test(line)) return false;
      if (TIMECODE_PATTERN.test(line)) return false;
      if (/^NOTE/i.test(line)) return false;
      return true;
    });

  const text = lines
    .join(' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

function parseSubtitleText(raw: string): string {
  const normalized = raw
    .replace(/^\uFEFF/, '')
    .replace(/^WEBVTT.*?(\r?\n){2}/i, '')
    .replace(/\r/g, '');

  const blocks = normalized.split(/\n\n+/);
  const parsed = blocks
    .map((block) => cleanupBlock(block))
    .filter((text) => text.length > 0);

  return parsed.join(' ');
}

export async function extractTextFromSubtitle(file: File): Promise<string> {
  const raw = await file.text();
  return parseSubtitleText(raw);
}

export { parseSubtitleText };
