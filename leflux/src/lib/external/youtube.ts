const YOUTUBE_ID_REGEX = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/i;

export interface YouTubeMetadata {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
}

export function extractYouTubeId(input: string): string | null {
  const match = input.match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
}

export async function fetchYouTubeMetadata(url: string): Promise<YouTubeMetadata | null> {
  const id = extractYouTubeId(url);
  if (!id) return null;

  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const response = await fetch(oembedUrl);
  if (!response.ok) return null;
  const data = (await response.json()) as { title: string; author_name: string; thumbnail_url: string };
  return {
    id,
    title: data.title,
    author: data.author_name,
    thumbnailUrl: data.thumbnail_url,
  };
}
