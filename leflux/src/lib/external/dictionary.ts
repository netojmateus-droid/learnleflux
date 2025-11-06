export interface DictionaryResult {
  term: string;
  lang: string;
  definition?: string;
  translation?: string;
  examples: string[];
  source: 'dictionaryapi' | 'freedictionary' | 'wiktionary-rest' | 'wiktionary-api' | 'fallback';
}

const cache = new Map<string, DictionaryResult>();

function cacheKey(lang: string, term: string) {
  return `${lang}:${term.toLowerCase()}`;
}

async function fetchDictionaryApi(term: string, lang: string): Promise<DictionaryResult | null> {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${encodeURIComponent(lang)}/${encodeURIComponent(term)}`);
  if (!response.ok) return null;
  const payload = (await response.json()) as Array<{ meanings: Array<{ definitions: Array<{ definition: string; example?: string }> }>; phonetics?: Array<{ text?: string }> }>;
  const first = payload[0];
  if (!first) return null;
  const meanings = first.meanings?.[0];
  const definitions = meanings?.definitions ?? [];
  const firstDef = definitions[0];
  const examples = definitions.map((item) => item.example).filter(Boolean) as string[];
  return {
    term,
    lang,
    definition: firstDef?.definition,
    examples,
    source: 'dictionaryapi',
  };
}

async function fetchFreeDictionary(term: string, lang: string): Promise<DictionaryResult | null> {
  const response = await fetch(`https://freedictapi.onrender.com/api/v2/entries/${encodeURIComponent(lang)}/${encodeURIComponent(term)}`);
  if (!response.ok) return null;
  const payload = (await response.json()) as Array<{ meanings?: Array<{ definitions: Array<{ definition: string; example?: string }> }> }>;
  const first = payload[0];
  const definitions = first?.meanings?.[0]?.definitions ?? [];
  if (!definitions.length) return null;
  return {
    term,
    lang,
    definition: definitions[0]?.definition,
    examples: definitions.map((item) => item.example).filter(Boolean) as string[],
    source: 'freedictionary',
  };
}

async function fetchWiktionaryRest(term: string, lang: string): Promise<DictionaryResult | null> {
  const response = await fetch(`https://${lang}.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(term)}?redirect=true`);
  if (!response.ok) return null;
  const data = (await response.json()) as Record<string, Array<{ definitions: Array<{ definition: { text: string }[] }> }>>;
  const langData = data[lang]?.[0]?.definitions?.[0]?.definition?.[0]?.text;
  if (!langData) return null;
  const cleaned = langData.replace(/<[^>]+>/g, '');
  return {
    term,
    lang,
    definition: cleaned,
    examples: [],
    source: 'wiktionary-rest',
  };
}

async function fetchWiktionaryApi(term: string, lang: string): Promise<DictionaryResult | null> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'extracts',
    titles: term,
    redirects: '1',
    explaintext: '1',
    exintro: '1',
    origin: '*',
  });
  const response = await fetch(`https://${lang}.wiktionary.org/w/api.php?${params.toString()}`);
  if (!response.ok) return null;
  const payload = (await response.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          extract?: string;
        }
      >;
    };
  };
  const page = payload.query?.pages ? Object.values(payload.query.pages)[0] : undefined;
  const extract = page?.extract?.trim();
  if (!extract) return null;
  const [definition, ...rest] = extract.split('\n').map((line) => line.trim()).filter(Boolean);
  return {
    term,
    lang,
    definition,
    examples: rest.slice(0, 2),
    source: 'wiktionary-api',
  };
}

function fallbackDefinition(term: string, lang: string): DictionaryResult {
  return {
    term,
    lang,
    definition: 'Definição ainda não encontrada. Observe e registre seu próprio significado.',
    examples: [
      `${term} — use em uma frase curta e clara.`,
      `Eu sempre lembro de ${term} quando pratico.`,
    ],
    source: 'fallback',
  };
}

export async function lookupDictionary(term: string, lang: string): Promise<DictionaryResult> {
  const key = cacheKey(lang, term);
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  let result: DictionaryResult | null = null;
  try {
    result = await fetchDictionaryApi(term, lang);
    const shouldSkipFreeDictionary =
      typeof window !== 'undefined' && /\.app\.github\.dev$/.test(window.location.hostname);
    if (!result && !shouldSkipFreeDictionary) {
      result = await fetchFreeDictionary(term, lang);
    }
    if (!result) {
      result = await fetchWiktionaryRest(term, lang);
    }
    if (!result) {
      result = await fetchWiktionaryApi(term, lang);
    }
  } catch (error) {
    console.debug('Dictionary lookup failed', error);
  }

  if (!result) {
    result = fallbackDefinition(term, lang);
  }

  cache.set(key, result);
  return result;
}
