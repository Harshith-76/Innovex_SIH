import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  verifyProject,
  rejectProject,
  getStats,
  getActivity,
} from '../controllers/districtMonitoringController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('district_monitoring'));

// District Monitoring Endpoints
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);

// Accept / Verify Endpoint (supports PATCH, POST, PUT)
router.patch('/projects/:id/verify', authorize('district_review'), verifyProject);
router.post('/projects/:id/verify', authorize('district_review'), verifyProject);
router.put('/projects/:id/verify', authorize('district_review'), verifyProject);

// Return / Reject Endpoint (supports PATCH, POST, PUT on /return and /reject)
router.patch('/projects/:id/return', authorize('district_review'), rejectProject);
router.post('/projects/:id/return', authorize('district_review'), rejectProject);
router.put('/projects/:id/return', authorize('district_review'), rejectProject);
router.patch('/projects/:id/reject', authorize('district_review'), rejectProject);
router.post('/projects/:id/reject', authorize('district_review'), rejectProject);
router.put('/projects/:id/reject', authorize('district_review'), rejectProject);

// Summary Stats & Activity Audit
router.get('/stats', getStats);
router.get('/activity', getActivity);

export default router;
