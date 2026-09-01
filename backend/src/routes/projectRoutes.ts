import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  approveProject,
  approveProjectLA,
  getApprovedProjectsLA
} from '../controllers/projectController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Project collection endpoints
router.get('/projects', authenticate, authorize('projects_directory'), getProjects);
router.get('/projects/approved-la', authenticate, authorize('approved_projects'), getApprovedProjectsLA);
router.post('/projects', authenticate, authorize('project_create'), createProject);
router.post('/projects/:id/approve-la', authenticate, authorize('acquisition_review'), approveProjectLA);
router.get('/projects/:id', authenticate, authorize('projects_directory'), getProjectById);
router.patch('/projects/:id', authenticate, authorize('project_update'), updateProject);
router.put('/projects/:id', authenticate, authorize('project_update'), updateProject);
router.post('/projects/:id/approve', authenticate, authorize('financial_approval'), approveProject);

export default router;
