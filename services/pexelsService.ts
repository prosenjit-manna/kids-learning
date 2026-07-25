/**
 * services/pexelsService.ts
 *
 * Thin wrapper around the `pexels` npm package.
 * The API key is read from .env via react-native-dotenv (@env).
 * Returns the best-matching photo URL for a search query,
 * or null when the API returns no results / an error.
 */
import { createClient, ErrorResponse, PhotosWithTotalResults } from 'pexels';
import { PEXELS_API_KEY } from '@env';

const client = createClient(PEXELS_API_KEY);

/**
 * Fetch the URL of the first Pexels photo matching `query`.
 *
 * @param query  - Search term (e.g. "Apple fruit", "Lion animal")
 * @param size   - Which src variant to return (default: 'medium')
 * @returns      - Photo URL string, or null on failure / no results
 */
export async function fetchPexelsPhotoUrl(
  query: string,
  size: keyof NonNullable<PhotosWithTotalResults['photos'][number]['src']> = 'medium',
): Promise<string | null> {
  try {
    const response = await client.photos.search({
      query,
      per_page: 1,
      page: 1,
    });

    // Type-guard: check for error response
    if ('error' in (response as ErrorResponse)) {
      console.warn('[Pexels] API error:', (response as ErrorResponse).error);
      return null;
    }

    const result = response as PhotosWithTotalResults;
    const photo = result.photos[0];
    if (!photo) {
      return null;
    }

    return photo.src[size] ?? photo.src.medium;
  } catch (err) {
    console.warn('[Pexels] Network error:', err);
    return null;
  }
}
