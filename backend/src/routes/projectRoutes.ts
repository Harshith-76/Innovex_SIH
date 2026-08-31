import { Router } from 'express';
import { getProjects, getProjectById, createProject, updateProject } from '../controllers/projectController.js';

const router = Router();

// Project collection endpoints
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.get('/projects/:id', getProjectById);
router.patch('/projects/:id', updateProject);
router.put('/projects/:id', updateProject);

export default router;
