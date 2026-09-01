import { Router } from 'express';
import { getHissaRecords, getHissaByParcelId } from '../controllers/hissaController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Hissa records with resolved owner data
router.get('/hissa', authenticate, authorize('gis_land_parcels'), getHissaRecords);
router.get('/hissa-records', authenticate, authorize('gis_land_parcels'), getHissaRecords);
router.get('/hissa/parcel/:parcelId', authenticate, authorize('gis_land_parcels'), getHissaByParcelId);

export default router;
