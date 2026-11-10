import { Router } from 'express';
import healthHandler from './health';
import psiAvailabilityHandler from './psiavailability';
import weatherHandler from './weather';
import transportHandler from './transport';
import { dataGovClient, DATA_GOV_ENDPOINTS, EndpointKey } from './dataGovClient';

export const apiRouter = Router();

// Required specific endpoints
apiRouter.get('/health', healthHandler);
apiRouter.get('/psiavailability', psiAvailabilityHandler);
apiRouter.get('/psi-availability', psiAvailabilityHandler);

// Weather & Environment aggregators
apiRouter.get('/weather', weatherHandler);

// Transport aggregators
apiRouter.get('/transport', transportHandler);

// Direct pass-through routes for all 12 key endpoints
// v2 endpoints
apiRouter.get('/two-hr-forecast', async (req, res) => {
  try {
    const data = await dataGovClient.getTwoHrForecast();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/twenty-four-hr-forecast', async (req, res) => {
  try {
    const data = await dataGovClient.getTwentyFourHrForecast();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/four-day-outlook', async (req, res) => {
  try {
    const data = await dataGovClient.getFourDayOutlook();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/air-temperature', async (req, res) => {
  try {
    const data = await dataGovClient.getAirTemperature();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/rainfall', async (req, res) => {
  try {
    const data = await dataGovClient.getRainfall();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/psi', async (req, res) => {
  try {
    const data = await dataGovClient.getPsi();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/pm25', async (req, res) => {
  try {
    const data = await dataGovClient.getPm25();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/uv', async (req, res) => {
  try {
    const data = await dataGovClient.getUv();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/relative-humidity', async (req, res) => {
  try {
    const data = await dataGovClient.getRelativeHumidity();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/wind-speed', async (req, res) => {
  try {
    const data = await dataGovClient.getWindSpeed();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// v1 transport endpoints
apiRouter.get('/carpark-availability', async (req, res) => {
  try {
    const data = await dataGovClient.getCarparkAvailability();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/taxi-availability', async (req, res) => {
  try {
    const data = await dataGovClient.getTaxiAvailability();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export {
  healthHandler,
  psiAvailabilityHandler,
  weatherHandler,
  transportHandler,
  dataGovClient,
  DATA_GOV_ENDPOINTS
};
