import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/projectService.js';

/**
 * GET /api/projects
 * Fetches all saved projects with optional filters (state, district, status, limit).
 */
export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { state, district, status, limit } = req.query;

    const projects = await projectService.getProjects({
      state: typeof state === 'string' ? state : undefined,
      district: typeof district === 'string' ? district : undefined,
      status: typeof status === 'string' ? status : undefined,
      limit: typeof limit === 'string' ? limit : undefined,
    });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/projects/:id
 * Fetches a single project by MongoDB ObjectId or project code.
 */
export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Project ID parameter is required.' });
      return;
    }

    const project = await projectService.getProjectById(id);

    if (!project) {
      res.status(404).json({ error: `Project not found with ID or code: ${id}` });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/projects
 * Creates a new project in MongoDB Atlas and returns the saved document.
 */
export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Request body must be a valid JSON object.' });
      return;
    }

    if (!body.code || !String(body.code).trim()) {
      res.status(400).json({ error: 'Project code is required.' });
      return;
    }

    if (!body.name || !String(body.name).trim()) {
      res.status(400).json({ error: 'Project name is required.' });
      return;
    }

    if (!body.district || !String(body.district).trim()) {
      res.status(400).json({ error: 'Project district is required.' });
      return;
    }

    const projectInput = req.authUser?.role === 'project_agency'
      ? {
          ...body,
          status: 'SUBMITTED',
          verification: undefined,
          financialStatus: undefined,
          districtStatus: undefined,
          createdByUserId: req.authUser.user_id,
        }
      : body;
    const createdProject = await projectService.createProject(projectInput);

    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/projects/:id
 * Updates an existing project document in MongoDB Atlas.
 */
export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Project ID parameter is required.' });
      return;
    }

    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Request body must be a valid JSON object.' });
      return;
    }

    const role = req.authUser?.role;
    const protectedFinancialFields = ['financialStatus', 'districtStatus', 'districtVerification', 'approvalStatus', 'approvedAt'];
    if (role !== 'master' && protectedFinancialFields.some((field) => Object.prototype.hasOwnProperty.call(body, field))) {
      res.status(403).json({ error: 'You do not have permission to update protected approval fields.' });
      return;
    }
    if (role === 'project_agency') {
      const allowedAgencyStatuses = new Set(['DRAFT', 'SUBMITTED', 'RESUBMITTED']);
      if (body.verification || (body.status && !allowedAgencyStatuses.has(String(body.status)))) {
        res.status(403).json({ error: 'You do not have permission to update acquisition review fields.' });
        return;
      }
    }

    if (role === 'land_acquisition' && body.verification) {
      body.verification = { ...body.verification, reviewedBy: req.authUser?.name };
    }

    const updated = await projectService.updateProject(id, body);

    if (!updated) {
      res.status(404).json({ error: `Project not found with ID or code: ${id}` });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/projects/:id/approve
 * Approves an existing project document and stores it in Project_Approved_Project collection.
 */
export async function approveProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Project ID parameter is required.' });
      return;
    }

    const approved = await projectService.approveProject(id);

    if (!approved) {
      res.status(404).json({ error: `Project not found with ID or code: ${id}` });
      return;
    }

    res.status(200).json(approved);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/projects/:id/approve-la
 * Explicit endpoint for Land Acquisition Minister approval.
 * Updates project status to FORWARDED_TO_FINANCIAL_OFFICER and saves full snapshot to lams_db.Project_Approval_LA.
 */
export async function approveProjectLA(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const body = { ...(req.body || {}), reviewedBy: req.authUser?.name };

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Project ID parameter is required.' });
      return;
    }

    // Update main project status
    await projectService.updateProject(id, {
      status: 'FORWARDED_TO_FINANCIAL_OFFICER',
      verification: body
    });

    // Create/update full snapshot in Project_Approval_LA
    const snapshot = await projectService.saveProjectApprovalLA(id, body);

    res.status(200).json({
      message: 'Project successfully approved by Land Acquisition Minister and forwarded to Financial Officer.',
      approvalSnapshot: snapshot
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/projects/approved-la
 * Fetches all approved project records stored in lams_db.Project_Approval_LA for the Finance Minister.
 */
export async function getApprovedProjectsLA(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const approvedProjects = await projectService.getApprovedProjectsLA();
    res.status(200).json(approvedProjects);
  } catch (error) {
    next(error);
  }
}
