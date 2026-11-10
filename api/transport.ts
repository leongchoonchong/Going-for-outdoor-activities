import type { Request, Response } from 'express';
import { dataGovClient } from './dataGovClient';

export default async function handler(req: Request, res: Response) {
  const { type } = req.query;

  try {
    if (type === 'taxis') {
      const taxiData = await dataGovClient.getTaxiAvailability();
      return res.status(200).json(taxiData);
    }

    if (type === 'carparks') {
      const carparkData = await dataGovClient.getCarparkAvailability();
      return res.status(200).json(carparkData);
    }

    // Default: fetch both
    const [carparks, taxis] = await Promise.allSettled([
      dataGovClient.getCarparkAvailability(),
      dataGovClient.getTaxiAvailability()
    ]);

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      transport: {
        carparkAvailability: carparks.status === 'fulfilled' ? carparks.value.data : null,
        taxiAvailability: taxis.status === 'fulfilled' ? taxis.value.data : null
      }
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err?.message || 'Failed to fetch transport data from data.gov.sg v1'
    });
  }
}
