import { Router } from 'express';
import { getParcels, getParcelById, getHealth } from '../controllers/parcelController.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealth);

// Parcel queries and metadata endpoints
router.get('/parcels', getParcels);
router.get('/parcels/:id', getParcelById);

export default router;
