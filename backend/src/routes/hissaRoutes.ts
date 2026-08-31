import { Router } from 'express';
import { getHissaRecords, getHissaByParcelId } from '../controllers/hissaController.js';

const router = Router();

// Hissa records with resolved owner data
router.get('/hissa', getHissaRecords);
router.get('/hissa-records', getHissaRecords);
router.get('/hissa/parcel/:parcelId', getHissaByParcelId);

export default router;
