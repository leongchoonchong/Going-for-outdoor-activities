/**
 * Centralized Serverless Connector for Singapore Open Data (data.gov.sg)
 * Covers:
 * - 10 v2 real-time weather & environmental APIs (wrapped {"code":0,"data":{...}})
 * - 2 v1 transport APIs (bare responses)
 */

export const DATA_GOV_ENDPOINTS = {
  // Weather & environment (v2 host, wrapped responses - all keyless, all live)
  twoHrForecast: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
  twentyFourHrForecast: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
  fourDayOutlook: 'https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook',
  airTemperature: 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
  rainfall: 'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
  psi: 'https://api-open.data.gov.sg/v2/real-time/api/psi',
  pm25: 'https://api-open.data.gov.sg/v2/real-time/api/pm25',
  uv: 'https://api-open.data.gov.sg/v2/real-time/api/uv',
  relativeHumidity: 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity',
  windSpeed: 'https://api-open.data.gov.sg/v2/real-time/api/wind-speed',

  // Carparks & taxis (v1 host ONLY - never migrated to v2, bare responses)
  carparkAvailability: 'https://api.data.gov.sg/v1/transport/carpark-availability',
  taxiAvailability: 'https://api.data.gov.sg/v1/transport/taxi-availability'
} as const;

export type EndpointKey = keyof typeof DATA_GOV_ENDPOINTS;

// Lightweight in-memory cache with TTL (milliseconds) for serverless environments
interface CacheEntry<T = any> {
  data: T;
  expiry: number;
}
const cache = new Map<string, CacheEntry>();

/**
 * Fetch data with TTL caching, timeout protection, and clean error handling
 */
export async function fetchWithCache<T = any>(
  url: string,
  ttlSeconds: number = 60,
  timeoutMs: number = 6000
): Promise<{ data: T; cached: boolean; timestamp: string }> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && cached.expiry > now) {
    return {
      data: cached.data,
      cached: true,
      timestamp: new Date(cached.expiry - ttlSeconds * 1000).toISOString()
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SG-Weather-Outdoor-Advisor/1.0'
      }
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`data.gov.sg HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    cache.set(url, { data: json, expiry: now + ttlSeconds * 1000 });

    return {
      data: json,
      cached: false,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    clearTimeout(timer);

    // If fetch failed but we have expired cached data, return it as resilient stale fallback
    if (cached) {
      return {
        data: cached.data,
        cached: true,
        timestamp: new Date(cached.expiry - ttlSeconds * 1000).toISOString()
      };
    }

    throw error;
  }
}

// Specific typed fetchers
export const dataGovClient = {
  // Weather & Environment (v2)
  getTwoHrForecast: () => fetchWithCache(DATA_GOV_ENDPOINTS.twoHrForecast, 60),
  getTwentyFourHrForecast: () => fetchWithCache(DATA_GOV_ENDPOINTS.twentyFourHrForecast, 120),
  getFourDayOutlook: () => fetchWithCache(DATA_GOV_ENDPOINTS.fourDayOutlook, 300),
  getAirTemperature: () => fetchWithCache(DATA_GOV_ENDPOINTS.airTemperature, 60),
  getRainfall: () => fetchWithCache(DATA_GOV_ENDPOINTS.rainfall, 60),
  getPsi: () => fetchWithCache(DATA_GOV_ENDPOINTS.psi, 120),
  getPm25: () => fetchWithCache(DATA_GOV_ENDPOINTS.pm25, 120),
  getUv: () => fetchWithCache(DATA_GOV_ENDPOINTS.uv, 120),
  getRelativeHumidity: () => fetchWithCache(DATA_GOV_ENDPOINTS.relativeHumidity, 60),
  getWindSpeed: () => fetchWithCache(DATA_GOV_ENDPOINTS.windSpeed, 60),

  // Transport (v1)
  getCarparkAvailability: () => fetchWithCache(DATA_GOV_ENDPOINTS.carparkAvailability, 60),
  getTaxiAvailability: () => fetchWithCache(DATA_GOV_ENDPOINTS.taxiAvailability, 45),

  // Direct fetch by endpoint key
  fetchEndpoint: (key: EndpointKey) => {
    const url = DATA_GOV_ENDPOINTS[key];
    if (!url) throw new Error(`Unknown endpoint key: ${key}`);
    return fetchWithCache(url, 60);
  }
};
