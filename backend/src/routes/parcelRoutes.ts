import { Router } from 'express';
import { getParcels, getParcelById, getHealth } from '../controllers/parcelController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealth);

// Parcel queries and metadata endpoints
router.get('/parcels', authenticate, authorize('gis_land_parcels'), getParcels);
router.get('/parcels/:id', authenticate, authorize('gis_land_parcels'), getParcelById);

export default router;
