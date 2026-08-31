import { Router } from 'express';
import { getProjects, getProjectById, createProject } from '../controllers/projectController.js';

const router = Router();

// Project collection endpoints
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.get('/projects/:id', getProjectById);

export default router;
