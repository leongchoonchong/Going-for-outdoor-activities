import type { Request, Response } from 'express';
import { DATA_GOV_ENDPOINTS } from './dataGovClient';

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  serverTime: {
    iso: string;
    sgt: string;
  };
  connectors: {
    v2WeatherHost: {
      url: string;
      status: 'reachable' | 'unreachable';
      latencyMs: number;
    };
    v1TransportHost: {
      url: string;
      status: 'reachable' | 'unreachable';
      latencyMs: number;
    };
  };
  endpointsRegistered: number;
  availableEndpoints: string[];
}

const startTime = Date.now();

export default async function handler(req: Request, res: Response) {
  const checkEndpoint = async (url: string) => {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timer);
      return {
        reachable: resp.ok || resp.status < 500,
        latencyMs: Date.now() - start
      };
    } catch {
      return {
        reachable: false,
        latencyMs: Date.now() - start
      };
    }
  };

  const [v2Check, v1Check] = await Promise.all([
    checkEndpoint(DATA_GOV_ENDPOINTS.twoHrForecast),
    checkEndpoint(DATA_GOV_ENDPOINTS.taxiAvailability)
  ]);

  const isHealthy = v2Check.reachable && v1Check.reachable;
  const isDegraded = v2Check.reachable || v1Check.reachable;

  const responseBody: HealthCheckResponse = {
    status: isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy',
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    serverTime: {
      iso: new Date().toISOString(),
      sgt: new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour12: false })
    },
    connectors: {
      v2WeatherHost: {
        url: 'https://api-open.data.gov.sg/v2/real-time/api',
        status: v2Check.reachable ? 'reachable' : 'unreachable',
        latencyMs: v2Check.latencyMs
      },
      v1TransportHost: {
        url: 'https://api.data.gov.sg/v1/transport',
        status: v1Check.reachable ? 'reachable' : 'unreachable',
        latencyMs: v1Check.latencyMs
      }
    },
    endpointsRegistered: Object.keys(DATA_GOV_ENDPOINTS).length,
    availableEndpoints: Object.keys(DATA_GOV_ENDPOINTS)
  };

  res.status(isHealthy ? 200 : isDegraded ? 207 : 503).json(responseBody);
}
