import { Request, Response, NextFunction } from 'express';
import * as districtService from '../services/districtMonitoringService.js';

/**
 * GET /api/district-monitoring/projects OR /api/district/projects
 * Fetches approved projects forwarded to district with tab and search filters, plus dynamic counts.
 */
export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { district, tab, districtStatus, verificationStatus, search, limit } = req.query;

    const result = await districtService.getDistrictProjects({
      district: typeof district === 'string' ? district : undefined,
      tab: typeof tab === 'string' ? tab : undefined,
      districtStatus: typeof districtStatus === 'string' ? districtStatus : undefined,
      verificationStatus: typeof verificationStatus === 'string' ? verificationStatus : undefined,
      search: typeof search === 'string' ? search : undefined,
      limit: typeof limit === 'string' ? limit : undefined,
    });

    res.status(200).json({
      success: true,
      counts: result.counts,
      count: result.projects.length,
      data: result.projects,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/district-monitoring/projects/:id OR /api/district/projects/:id
 * Fetches a single approved project document.
 */
export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { district } = req.query;

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Project ID parameter is required.' });
      return;
    }

    const project = await districtService.getDistrictProjectById(
      id,
      typeof district === 'string' ? district : undefined
    );

    if (!project) {
      res.status(404).json({ error: `Approved project not found with ID: ${id}` });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH / POST / PUT /api/district-monitoring/projects/:id/verify
 * Verifies and accepts a project at district level.
 */
export async function verifyProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { officerName, officerDistrict, officerRole, remarks } = req.body || {};

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Project ID parameter is required.' });
      return;
    }

    const updatedProject = await districtService.verifyDistrictProject(
      id,
      officerName,
      officerDistrict,
      remarks
    );

    res.status(200).json({
      success: true,
      message: 'Project successfully verified and accepted for district operations.',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH / POST / PUT /api/district-monitoring/projects/:id/return OR /reject
 * Rejects / returns a project at district level with a required justification.
 */
export async function rejectProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { reason, justification, officerName, officerDistrict, officerRole } = req.body || {};

    if (!id || !id.trim()) {
      res.status(400).json({ error: 'Project ID parameter is required.' });
      return;
    }

    const finalReason = String(justification || reason || '').trim();
    if (!finalReason) {
      res.status(400).json({ error: 'Justification/reason for return/rejection is mandatory and cannot be empty.' });
      return;
    }

    const updatedProject = await districtService.rejectDistrictProject(
      id,
      finalReason,
      officerName,
      officerDistrict,
      officerRole
    );

    res.status(200).json({
      success: true,
      message: 'Project returned with recorded justification.',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/district-monitoring/stats OR /api/district/stats
 * Returns district summary metrics and financial/land totals.
 */
export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { district } = req.query;

    const stats = await districtService.getDistrictStats(
      typeof district === 'string' ? district : undefined
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/district-monitoring/activity OR /api/district/activity
 * Returns audit log of recent district verification actions.
 */
export async function getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { district } = req.query;

    const activity = await districtService.getRecentActivity(
      typeof district === 'string' ? district : undefined
    );

    res.status(200).json({
      success: true,
      count: activity.length,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
}
