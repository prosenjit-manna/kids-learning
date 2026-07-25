/**
 * hooks/usePexelsImage.ts
 *
 * Returns the Pexels photo URL for a given search query.
 * Results are cached in memory for the lifetime of the app session
 * so the same query is never fetched twice.
 */
import { useEffect, useState } from 'react';
import { fetchPexelsPhotoUrl } from '../services/pexelsService';

const cache = new Map<string, string | null>();

export function usePexelsImage(query: string): string | null {
  const [url, setUrl] = useState<string | null>(() => cache.get(query) ?? null);

  useEffect(() => {
    // Skip fetch when no query is provided (e.g. item has a local image)
    if (!query) {
      setUrl(null);
      return;
    }

    if (cache.has(query)) {
      setUrl(cache.get(query) ?? null);
      return;
    }

    let cancelled = false;

    fetchPexelsPhotoUrl(query).then(result => {
      cache.set(query, result);
      if (!cancelled) {
        setUrl(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return url;
}
