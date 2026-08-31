import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  verifyProject,
  rejectProject,
  getStats,
  getActivity,
} from '../controllers/districtMonitoringController.js';

const router = Router();

// District Monitoring Endpoints
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects/:id/verify', verifyProject);
router.put('/projects/:id/verify', verifyProject);
router.post('/projects/:id/reject', rejectProject);
router.put('/projects/:id/reject', rejectProject);
router.get('/stats', getStats);
router.get('/activity', getActivity);

export default router;
