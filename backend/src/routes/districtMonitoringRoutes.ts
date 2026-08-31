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

// Accept / Verify Endpoint (supports PATCH, POST, PUT)
router.patch('/projects/:id/verify', verifyProject);
router.post('/projects/:id/verify', verifyProject);
router.put('/projects/:id/verify', verifyProject);

// Return / Reject Endpoint (supports PATCH, POST, PUT on /return and /reject)
router.patch('/projects/:id/return', rejectProject);
router.post('/projects/:id/return', rejectProject);
router.put('/projects/:id/return', rejectProject);
router.patch('/projects/:id/reject', rejectProject);
router.post('/projects/:id/reject', rejectProject);
router.put('/projects/:id/reject', rejectProject);

// Summary Stats & Activity Audit
router.get('/stats', getStats);
router.get('/activity', getActivity);

export default router;
