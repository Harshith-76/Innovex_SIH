import { Request, Response, NextFunction } from 'express';
import * as hissaService from '../services/hissaService.js';

/**
 * GET /api/hissa
 * Fetches all Hissa records with joined Owner information.
 * Supports query filters: parcel_id, survey_no, owner_id, owner_name, limit.
 */
export async function getHissaRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { parcel_id, survey_no, owner_id, owner_name, limit } = req.query;

    const hissaRecords = await hissaService.getHissaRecords({
      parcel_id: typeof parcel_id === 'string' ? parcel_id : undefined,
      survey_no: typeof survey_no === 'string' ? survey_no : undefined,
      owner_id: typeof owner_id === 'string' ? owner_id : undefined,
      owner_name: typeof owner_name === 'string' ? owner_name : undefined,
      limit: typeof limit === 'string' ? limit : undefined,
    });

    res.status(200).json(hissaRecords);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/hissa/parcel/:parcelId
 * Fetches all Hissa records belonging to a specific parcel_id.
 */
export async function getHissaByParcelId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { parcelId } = req.params;

    if (!parcelId || !parcelId.trim()) {
      res.status(400).json({ error: 'Parcel ID parameter is required.' });
      return;
    }

    const records = await hissaService.getHissaRecordsByParcelId(parcelId);

    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}
