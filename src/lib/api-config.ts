/**
 * API configuration for Chotelal ji Health
 * Backend Target: Cloudflare Workers (https://chotelalji.sumitshrivas24.workers.dev)
 */

export const CLOUDFLARE_WORKERS_URL = 'https://chotelalji-tts.sumitshrivas24.workers.dev';

export function getApiEndpoint(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Special case for /api/tts - only use worker in production (not on run.app or localhost)
  if (path === '/api/tts') {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host.includes('run.app')) {
        return cleanPath;
      }
    }
    return `${CLOUDFLARE_WORKERS_URL}/api/tts`;
  }

  // In local development environment, use relative path so local Express/Vite server handles it
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.includes('run.app')) {
      return cleanPath;
    }
  }

  // When deployed to production on Firebase Hosting, route backend API requests to Cloudflare Workers
  return `${CLOUDFLARE_WORKERS_URL}${cleanPath}`;
}

/**
 * Resilient fetcher that attempts the Cloudflare Worker URL, and if unavailable,
 * seamlessly falls back to the same-origin endpoint.
 */
export async function fetchWithFallback(path: string, options: RequestInit = {}): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const primaryUrl = getApiEndpoint(path);

  try {
    const res = await fetch(primaryUrl, options);
    if (res.ok) {
      return res;
    }
    // If external worker returned 404 or server error, fall back to same-origin endpoint
    if (primaryUrl.startsWith('http') && typeof window !== 'undefined') {
      console.warn(`[API Fallback] ${primaryUrl} returned status ${res.status}, falling back to local: ${cleanPath}`);
      return fetch(cleanPath, options);
    }
    return res;
  } catch (primaryErr) {
    // If we tried external Cloudflare Worker and network failed, fallback to same origin
    if (primaryUrl.startsWith('http') && typeof window !== 'undefined') {
      console.warn(`[Cloudflare API Fallback] ${primaryUrl} failed, trying local endpoint: ${cleanPath}`);
      return fetch(cleanPath, options);
    }
    throw primaryErr;
  }
}
