import { Request, Response, NextFunction } from 'express';
import * as parcelService from '../services/parcelService.js';

/**
 * GET /api/parcels
 * Queries parcels by district, taluk, village, survey_no, category, limit.
 * Returns a valid GeoJSON FeatureCollection.
 */
export async function getParcels(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { district, taluk, village, survey_no, category, limit } = req.query;

    const featureCollection = await parcelService.getParcels({
      district: typeof district === 'string' ? district : undefined,
      taluk: typeof taluk === 'string' ? taluk : undefined,
      village: typeof village === 'string' ? village : undefined,
      survey_no: typeof survey_no === 'string' ? survey_no : undefined,
      category: typeof category === 'string' ? category : undefined,
      limit: typeof limit === 'string' ? limit : undefined,
    });

    res.status(200).json(featureCollection);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/parcels/:id
 * Fetches one parcel by parcel_id (e.g. KA-DK-ULL-KON-113-C1589316).
 * Returns HTTP 404 if the parcel does not exist.
 */
export async function getParcelById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Parcel ID parameter is required.' });
      return;
    }

    const parcel = await parcelService.getParcelById(id);

    if (!parcel) {
      res.status(404).json({ error: `Parcel not found with ID: ${id}` });
      return;
    }

    res.status(200).json(parcel);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/health
 * Verifies active database connection and service health.
 */
export async function getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const health = await parcelService.getDatabaseHealth();

    if (!health.connected) {
      res.status(503).json({
        status: 'error',
        database: 'disconnected',
      });
      return;
    }

    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    next(error);
  }
}
