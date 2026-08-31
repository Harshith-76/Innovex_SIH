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

const router = Router();

// Project collection endpoints
router.get('/projects', getProjects);
router.get('/projects/approved-la', getApprovedProjectsLA);
router.post('/projects', createProject);
router.post('/projects/:id/approve-la', approveProjectLA);
router.get('/projects/:id', getProjectById);
router.patch('/projects/:id', updateProject);
router.put('/projects/:id', updateProject);
router.post('/projects/:id/approve', approveProject);

export default router;
