import { buildPollinationsImageUrl, PollinationsImageOptions } from './pollinations';

const cache = new Map<string, string>();

export interface FetchImageOptions extends PollinationsImageOptions {
  locale?: string;
  fallbackIcon?: string;
}

const DEFAULT_PLACEHOLDER_ICON = '📷';

function buildPlaceholder(icon: string = DEFAULT_PLACEHOLDER_ICON): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" fill="none"><rect width="200" height="200" rx="24" ry="24" fill="rgba(255,255,255,0.05)"/><text x="50%" y="50%" font-size="56" text-anchor="middle" fill="rgba(255,255,255,0.4)" dy="18">${icon}</text></svg>`
  )}`;
}

async function tryPollinations(term: string, options: PollinationsImageOptions): Promise<string | undefined> {
  try {
    return buildPollinationsImageUrl(term, options);
  } catch (error) {
    console.warn('Pollinations image build failed', error);
    return undefined;
  }
}

async function tryPexels(term: string): Promise<string | undefined> {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY?.trim();
  if (!apiKey) return undefined;

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=1`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );
    if (!response.ok) return undefined;
    const data = await response.json();
    const photo = data?.photos?.[0];
    const candidate: string | undefined = photo?.src?.medium ?? photo?.src?.original;
    return candidate;
  } catch (error) {
    console.warn('Pexels fetch failed', error);
    return undefined;
  }
}

async function tryPixabay(term: string): Promise<string | undefined> {
  const apiKey = import.meta.env.VITE_PIXABAY_API_KEY?.trim();
  if (!apiKey) return undefined;

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(term)}&image_type=photo&per_page=3&safesearch=true`
    );
    if (!response.ok) return undefined;
    const data = await response.json();
    const hit = data?.hits?.[0];
    const candidate: string | undefined = hit?.webformatURL ?? hit?.largeImageURL;
    return candidate;
  } catch (error) {
    console.warn('Pixabay fetch failed', error);
    return undefined;
  }
}

async function tryGiphy(term: string): Promise<string | undefined> {
  const apiKey = import.meta.env.VITE_GIPHY_API_KEY?.trim();
  if (!apiKey) return undefined;

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      q: term,
      limit: '1',
      rating: 'g',
      lang: 'en',
      bundle: 'messaging_non_clips',
    });
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?${params.toString()}`);
    if (!response.ok) return undefined;
    const data = await response.json();
    const gif = data?.data?.[0]?.images;
    const candidate: string | undefined = gif?.downsized_medium?.url ?? gif?.original?.url ?? gif?.downsized?.url;
    return candidate;
  } catch (error) {
    console.warn('Giphy fetch failed', error);
    return undefined;
  }
}

async function tryUnsplash(term: string): Promise<string | undefined> {
  const requestUrl = `https://source.unsplash.com/featured/640x480?${encodeURIComponent(term)}`;

  try {
    const response = await fetch(requestUrl, { redirect: 'follow' });
    if (response.ok) {
      return response.url;
    }
  } catch (error) {
    console.warn('Unsplash fetch failed', error);
  }

  return undefined;
}

export async function fetchImageForTerm(term: string, options: FetchImageOptions = {}): Promise<string> {
  const normalized = term?.trim();
  const placeholder = buildPlaceholder(options.fallbackIcon);
  if (!normalized) return placeholder;

  const cacheKey = [
    normalized.toLowerCase(),
    options.locale?.toLowerCase() ?? '',
    String(options.width ?? ''),
    String(options.height ?? ''),
    String(options.aspect ?? ''),
    String(options.nologo ?? ''),
  ].join('|');

  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const searchTerm = options.locale ? `${normalized} ${options.locale}` : normalized;
  const pollinationsOptions: PollinationsImageOptions = {
    seed: options.seed,
    width: options.width,
    height: options.height,
    aspect: options.aspect,
    nologo: options.nologo,
  };

  const candidates = [
    () => tryPollinations(searchTerm, pollinationsOptions),
    () => tryPexels(searchTerm),
    () => tryPixabay(searchTerm),
    () => tryGiphy(searchTerm),
    () => tryUnsplash(searchTerm),
  ];

  for (const attempt of candidates) {
    try {
      const resolved = await attempt();
      if (resolved) {
        cache.set(cacheKey, resolved);
        return resolved;
      }
    } catch (error) {
      console.warn('Image fetch attempt failed', error);
    }
  }

  cache.set(cacheKey, placeholder);
  return placeholder;
}
