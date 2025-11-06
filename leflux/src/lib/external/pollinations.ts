const DEFAULT_IMAGE_WIDTH = 640;
const DEFAULT_IMAGE_HEIGHT = 480;
const DEFAULT_MODEL = import.meta.env.VITE_POLLINATIONS_MODEL?.trim() || 'turbo';

export interface PollinationsImageOptions {
  seed?: number;
  width?: number;
  height?: number;
  aspect?: string;
  nologo?: boolean;
}

export interface PollinationsTextOptions {
  model?: string;
  language?: string;
  maxCharacters?: number;
}

export function buildPollinationsImageUrl(prompt: string, options: PollinationsImageOptions = {}): string {
  const seed = options.seed ?? Math.floor(Math.random() * 1_000_000);
  const width = options.width ?? DEFAULT_IMAGE_WIDTH;
  const height = options.height ?? DEFAULT_IMAGE_HEIGHT;
  const params = new URLSearchParams();
  params.set('seed', String(seed));
  params.set('width', String(width));
  params.set('height', String(height));
  if (options.aspect) params.set('aspect', options.aspect);
  params.set('nologo', String(options.nologo ?? true));
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export async function generatePollinationsText(prompt: string, options: PollinationsTextOptions = {}): Promise<string> {
  const model = options.model ?? DEFAULT_MODEL;
  const fragments = [prompt];
  if (options.language) {
    fragments.unshift(`Respond only in ${options.language}.`);
  }
  if (options.maxCharacters) {
    fragments.push(`Limit the response to about ${options.maxCharacters} characters.`);
  }
  const composed = fragments.filter(Boolean).join(' ');
  const approxTokens = options.maxCharacters ? Math.max(Math.ceil(options.maxCharacters / 3), 80) : undefined;
  const response = await fetch('https://text.pollinations.ai/api/v1/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt: composed,
      options: {
        max_tokens: approxTokens,
        temperature: 0.8,
      },
    }),
  });
  if (!response.ok) {
    throw new Error('Pollinations text generation failed');
  }
  const raw = await response.text();
  let text: string = raw;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') {
      text = parsed;
    } else if (parsed?.completion) {
      text = parsed.completion;
    } else if (parsed?.text) {
      text = parsed.text;
    } else if (parsed?.output) {
      text = Array.isArray(parsed.output) ? parsed.output.join('\n') : String(parsed.output);
    }
  } catch (error) {
    console.debug('Pollinations text response was not JSON', error);
  }

  const cleaned = text.trim();
  if (!cleaned) {
    throw new Error('Pollinations text generation returned empty response');
  }
  return cleaned;
}

export async function generatePollinationsStory(
  idea: string,
  language: string,
  maxCharacters: number,
  model?: string
): Promise<string> {
  const storyPrompt = [
    `Write a vivid but concise story in ${language}.`,
    `Target roughly ${Math.max(maxCharacters, 120)} characters.`,
    'Keep sentences clear for language learners and favour concrete imagery.',
    `Story brief: ${idea}`,
  ].join(' ');
  return generatePollinationsText(storyPrompt, { model, language, maxCharacters });
}
