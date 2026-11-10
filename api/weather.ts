import type { Request, Response } from 'express';
import { dataGovClient, DATA_GOV_ENDPOINTS, EndpointKey } from './dataGovClient';

export default async function handler(req: Request, res: Response) {
  const { endpoint } = req.query;

  // If a specific weather endpoint is requested via query param ?endpoint=rainfall
  if (typeof endpoint === 'string' && endpoint in DATA_GOV_ENDPOINTS) {
    try {
      const result = await dataGovClient.fetchEndpoint(endpoint as EndpointKey);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        endpoint,
        message: err?.message || 'Failed to fetch endpoint from data.gov.sg'
      });
    }
  }

  // Otherwise, return a consolidated live environmental payload
  try {
    const [
      twoHr,
      twentyFourHr,
      fourDay,
      temp,
      rainfall,
      uv,
      humidity,
      wind,
      psi,
      pm25
    ] = await Promise.allSettled([
      dataGovClient.getTwoHrForecast(),
      dataGovClient.getTwentyFourHrForecast(),
      dataGovClient.getFourDayOutlook(),
      dataGovClient.getAirTemperature(),
      dataGovClient.getRainfall(),
      dataGovClient.getUv(),
      dataGovClient.getRelativeHumidity(),
      dataGovClient.getWindSpeed(),
      dataGovClient.getPsi(),
      dataGovClient.getPm25()
    ]);

    const getVal = (res: PromiseSettledResult<any>) =>
      res.status === 'fulfilled' ? res.value?.data?.data || res.value?.data : null;

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      weather: {
        twoHrForecast: getVal(twoHr),
        twentyFourHrForecast: getVal(twentyFourHr),
        fourDayOutlook: getVal(fourDay),
        airTemperature: getVal(temp),
        rainfall: getVal(rainfall),
        uv: getVal(uv),
        relativeHumidity: getVal(humidity),
        windSpeed: getVal(wind),
        psi: getVal(psi),
        pm25: getVal(pm25)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error?.message || 'Failed to aggregate Singapore meteorological feed'
    });
  }
}
