export function extractYoutubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{10,12})/,
    /youtube\.com\/.*[?&]v=([\w-]{10,12})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  const parts = url.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  return last && /^[\w-]{10,12}$/.test(last) ? last : null;
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

export function youtubeThumbUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}
