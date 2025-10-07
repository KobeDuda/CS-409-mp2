import axios, { AxiosResponse } from "axios";

// A generic cache record type
type CacheRecord<T> = {
  data: T;
  timestamp: number;
};

// The actual in-memory cache
const cache = new Map<string, CacheRecord<any>>();

// Optional: configurable cache duration (in milliseconds)
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches a resource and caches it in memory.
 * Automatically returns cached data if it's still fresh.
 */
export async function fetchWithCache<T = unknown>(url: string): Promise<T> {
  const cached = cache.get(url);

  // Return cached data if not expired
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  // Otherwise, fetch from server
  const response: AxiosResponse<T> = await axios.get(url);

  // Store in cache
  cache.set(url, {
    data: response.data,
    timestamp: Date.now(),
  });

  return response.data;
}

/** Optional: clear cache manually */
export function clearCache(url?: string) {
  if (url) cache.delete(url);
  else cache.clear();
}