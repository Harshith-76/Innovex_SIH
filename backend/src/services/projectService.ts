import { Filter, ObjectId, Document } from 'mongodb';
import { getProjectsCollection, getApprovedProjectsCollection, getParcelsCollection, getProjectApprovalLACollection } from '../config/database.js';

export interface ProjectDocument extends Document {
  _id: ObjectId;
  code: string;
  name: string;
  projectType: string;
  parentAuthority: string;
  agencyName: string;
  agencyType: string;
  department: string;
  implementingAgency: string;
  state: string;
  district: string;
  taluks?: string[];
  landRequiredAcres: number;
  landAcquiredAcres: number;
  selectedLandAcres?: number;
  selectedParcelCount: number;
  progressPercentage: number;
  currentStage: string;
  status: string;
  riskScore: number;
  riskLevel: string;
  primaryRiskFactor?: string;
  estimatedCompensationCr: number;
  totalCompensationAssessedCr?: number;
  totalCompensationPaidCr?: number;
  scope?: string;
  description?: string;
  selectedParcelIds: string[];
  stages?: any[];
  villages?: any[];
  routeWaypoints?: [number, number][];
  routeLengthKm?: number;
  proposedLengthKm?: number;
  rowWidthM?: number;
  routeStatus?: string;
  submittedAt?: string;
  reviewedAt?: string;
  verifiedAt?: string;
  verification?: {
    status?: string;
    officerRemarks?: string;
    checklist?: Record<string, boolean>;
    reviewedAt?: string;
    reviewedBy?: string;
    decision?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  code: string;
  name: string;
  projectType?: string;
  parentAuthority?: string;
  agencyName?: string;
  agencyType?: string;
  department?: string;
  implementingAgency?: string;
  state?: string;
  district: string;
  taluks?: string[];
  landRequiredAcres?: number | string;
  landAcquiredAcres?: number | string;
  selectedLandAcres?: number | string;
  estimatedCompensationCr?: number | string;
  scope?: string;
  description?: string;
  selectedParcelIds?: string[];
  status?: string;
  currentStage?: string;
  progressPercentage?: number;
  stages?: any[];
}

export interface ProjectQueryParams {
  state?: string;
  district?: string;
  status?: string;
  limit?: string | number;
}

/**
 * Normalizes a Project Document for JSON API response.
 * Guarantees `id` string matches `_id`.
 */
function formatProject(doc: ProjectDocument) {
  return {
    ...doc,
    id: doc._id.toString(),
    _id: doc._id.toString(),
  };
}

/**
 * Creates a new project in the MongoDB projects collection.
 */
export async function createProject(input: CreateProjectInput): Promise<any> {
  const collection = getProjectsCollection<ProjectDocument>();

  if (!input.code || !input.code.trim()) {
    throw new Error('Project code is required.');
  }

  if (!input.name || !input.name.trim()) {
    throw new Error('Project name is required.');
  }

  if (!input.district || !input.district.trim()) {
    throw new Error('District is required.');
  }

  const selectedParcelIds = Array.isArray(input.selectedParcelIds) ? input.selectedParcelIds : [];
  const landRequiredAcres = Number(input.landRequiredAcres) || 0;
  const estimatedCompensationCr = Number(input.estimatedCompensationCr) || 0;

  const now = new Date();

  const projectToInsert: Omit<ProjectDocument, '_id'> = {
    code: input.code.trim(),
    name: input.name.trim(),
    projectType: input.projectType || 'Highway Infrastructure',
    parentAuthority: input.parentAuthority || 'Public Works Department, Govt of Karnataka',
    agencyName: input.agencyName || 'Karnataka State Highway Improvement Project',
    agencyType: input.agencyType || 'State Highway Authority',
    department: input.department || 'Public Works Department',
    implementingAgency: input.implementingAgency || input.agencyName || 'Karnataka State Highway Improvement Project',
    state: input.state || 'Karnataka',
    district: input.district.trim(),
    taluks: input.taluks || [input.district.trim()],
    landRequiredAcres,
    landAcquiredAcres: Number(input.landAcquiredAcres) || Number(input.selectedLandAcres) || 0,
    selectedLandAcres: Number(input.selectedLandAcres) || 0,
    selectedParcelCount: selectedParcelIds.length,
    progressPercentage: input.progressPercentage !== undefined ? Number(input.progressPercentage) : 0,
    currentStage: input.currentStage || 'Proposal',
    status: input.status || 'SUBMITTED',
    submittedAt: now.toISOString(),
    riskScore: 20,
    riskLevel: 'Low',
    primaryRiskFactor: 'Cadastral Parcel Acquisition',
    estimatedCompensationCr,
    totalCompensationAssessedCr: estimatedCompensationCr,
    totalCompensationPaidCr: 0,
    scope: input.scope || '',
    description: input.description || input.scope || '',
    selectedParcelIds,
    stages: input.stages || [
      { stage: 'Proposal', status: 'In Progress', targetDate: '2026-10-31', responsibleAuthority: input.agencyName || 'PIU Director', documentsCount: 1, pendingActionsCount: 1, notes: 'Land selection registered' },
      { stage: 'Verification', status: 'Pending', targetDate: '2026-12-31', responsibleAuthority: 'SLAO', documentsCount: 0, pendingActionsCount: 2, notes: 'JMS pending' }
    ],
    villages: [],
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(projectToInsert as any);
  
  const createdDoc = await collection.findOne({ _id: result.insertedId });
  if (!createdDoc) {
    throw new Error('Failed to retrieve newly created project from database.');
  }

  return formatProject(createdDoc);
}

/**
 * Fetches all projects matching optional filters.
 */
export async function getProjects(params?: ProjectQueryParams): Promise<any[]> {
  const collection = getProjectsCollection<ProjectDocument>();
  const mongoFilter: Filter<ProjectDocument> = {};

  if (params?.district && params.district.trim() && params.district !== 'ALL') {
    mongoFilter.district = { $regex: new RegExp(`^${params.district.trim()}$`, 'i') } as any;
  }

  if (params?.state && params.state.trim() && params.state !== 'ALL') {
    mongoFilter.state = { $regex: new RegExp(`^${params.state.trim()}$`, 'i') } as any;
  }

  if (params?.status && params.status.trim() && params.status !== 'ALL') {
    mongoFilter.status = { $regex: new RegExp(`^${params.status.trim()}$`, 'i') } as any;
  }

  const parsedLimit = params?.limit ? parseInt(String(params.limit), 10) : 500;
  const safeLimit = Math.min(Math.max(isNaN(parsedLimit) ? 500 : parsedLimit, 1), 1000);

  const docs = await collection
    .find(mongoFilter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(safeLimit)
    .toArray();

  return docs.map(formatProject);
}

/**
 * Fetches a single project by MongoDB ObjectId or project code.
 */
export async function getProjectById(id: string): Promise<any | null> {
  const collection = getProjectsCollection<ProjectDocument>();
  const trimmedId = id.trim();

  let doc: ProjectDocument | null = null;

  if (ObjectId.isValid(trimmedId)) {
    doc = await collection.findOne({ _id: new ObjectId(trimmedId) });
  }

  if (!doc) {
    doc = await collection.findOne({ code: trimmedId });
  }

  if (!doc) {
    return null;
  }

  return formatProject(doc);
}

/**
 * Updates an existing project document in the MongoDB projects collection.
 * Automatically saves a complete approved snapshot to lams_db.Project_Approval_LA if forwarded to financial officer.
 */
export async function updateProject(id: string, updates: Partial<ProjectDocument>): Promise<any | null> {
  const collection = getProjectsCollection<ProjectDocument>();
  const trimmedId = id.trim();

  let filter: Filter<ProjectDocument> = {};
  if (ObjectId.isValid(trimmedId)) {
    filter = { _id: new ObjectId(trimmedId) };
  } else {
    filter = { code: trimmedId };
  }

  const { _id, id: _, createdAt, ...allowedUpdates } = updates as any;
  allowedUpdates.updatedAt = new Date();

  const result = await collection.findOneAndUpdate(
    filter,
    { $set: allowedUpdates },
    { returnDocument: 'after' }
  );

  if (!result) {
    return null;
  }

  const formatted = formatProject(result as ProjectDocument);

  // If status is updated to FORWARDED_TO_FINANCIAL_OFFICER or decision is VERIFIED, save complete snapshot to Project_Approval_LA
  if (
    updates.status === 'FORWARDED_TO_FINANCIAL_OFFICER' ||
    updates.status === 'VERIFIED' ||
    updates.verification?.status === 'FORWARDED_TO_FINANCIAL_OFFICER' ||
    updates.verification?.decision === 'VERIFIED'
  ) {
    try {
      await saveProjectApprovalLA(id, updates.verification);
    } catch (err) {
      console.error('[projectService] Failed to auto-save Project_Approval_LA snapshot:', err);
    }
  }

  return formatted;
}

/**
 * Saves or updates a COMPLETE approved project snapshot in lams_db.Project_Approval_LA.
 * Duplicate approvals for the same project are prevented by using `sourceProjectId` upsert.
 */
export async function saveProjectApprovalLA(projectId: string, verificationData?: any): Promise<any> {
  const projectsCol = getProjectsCollection<ProjectDocument>();
  const parcelsCol = getParcelsCollection();
  const approvalCol = getProjectApprovalLACollection();

  const trimmedId = projectId.trim();
  let projectDoc: ProjectDocument | null = null;

  if (ObjectId.isValid(trimmedId)) {
    projectDoc = await projectsCol.findOne({ _id: new ObjectId(trimmedId) });
  }
  if (!projectDoc) {
    projectDoc = await projectsCol.findOne({ code: trimmedId });
  }
  if (!projectDoc) {
    throw new Error(`Cannot create approval snapshot: Project not found with ID/code: ${projectId}`);
  }

  // Fetch full associated parcel documents from parcels collection for selectedParcelIds
  let selectedParcelDocs: any[] = [];
  if (Array.isArray(projectDoc.selectedParcelIds) && projectDoc.selectedParcelIds.length > 0) {
    selectedParcelDocs = await parcelsCol
      .find({ parcelId: { $in: projectDoc.selectedParcelIds } })
      .toArray();
  }

  const now = new Date();
  const sourceProjId = projectDoc._id.toString();

  const snapshotDoc = {
    sourceProjectId: sourceProjId,
    projectCode: projectDoc.code,
    projectName: projectDoc.name,
    projectType: projectDoc.projectType || 'Highway Infrastructure',
    parentAuthority: projectDoc.parentAuthority || 'Public Works Department, Govt of Karnataka',
    agencyName: projectDoc.agencyName || projectDoc.implementingAgency || 'KSHIP',
    agencyType: projectDoc.agencyType || 'State Authority',
    department: projectDoc.department || 'Public Works Department',
    implementingAgency: projectDoc.implementingAgency || projectDoc.agencyName || 'KSHIP',
    state: projectDoc.state || 'Karnataka',
    district: projectDoc.district,
    taluks: projectDoc.taluks || [projectDoc.district],
    landRequiredAcres: projectDoc.landRequiredAcres,
    landAcquiredAcres: projectDoc.landAcquiredAcres || projectDoc.selectedLandAcres || 0,
    selectedLandAcres: projectDoc.selectedLandAcres || projectDoc.landAcquiredAcres || 0,
    selectedParcelCount: projectDoc.selectedParcelCount || (projectDoc.selectedParcelIds ? projectDoc.selectedParcelIds.length : 0),
    estimatedCompensationCr: projectDoc.estimatedCompensationCr,
    totalCompensationAssessedCr: projectDoc.totalCompensationAssessedCr || projectDoc.estimatedCompensationCr || 0,
    totalCompensationPaidCr: projectDoc.totalCompensationPaidCr || 0,
    scope: projectDoc.scope || projectDoc.description || '',
    description: projectDoc.description || projectDoc.scope || '',
    selectedParcelIds: projectDoc.selectedParcelIds || [],
    selectedParcels: selectedParcelDocs, // full parcel objects with survey numbers, area, village, owners, geometries
    routeWaypoints: projectDoc.routeWaypoints || [],
    routeLengthKm: projectDoc.routeLengthKm || projectDoc.proposedLengthKm || 0,
    proposedLengthKm: projectDoc.proposedLengthKm || projectDoc.routeLengthKm || 0,
    rowWidthM: projectDoc.rowWidthM || 30,
    routeStatus: projectDoc.routeStatus || 'APPROVED',
    stages: projectDoc.stages || [],
    villages: projectDoc.villages || [],
    submittedAt: projectDoc.submittedAt || projectDoc.createdAt,
    verification: projectDoc.verification || verificationData || {},
    officerRemarks: verificationData?.officerRemarks || projectDoc.verification?.officerRemarks || '',
    verificationChecklist: verificationData?.checklist || projectDoc.verification?.checklist || {},
    approvalStatus: 'APPROVED',
    forwardedTo: 'FINANCIAL_OFFICER',
    approvedBy: verificationData?.reviewedBy || projectDoc.verification?.reviewedBy || 'Shri R. K. Hegde, SLAO Ramanagara',
    approvedAt: now.toISOString(),
    forwardedAt: now.toISOString(),
    updatedAt: now
  };

  // Upsert into Project_Approval_LA using sourceProjectId to prevent duplicate records
  await approvalCol.updateOne(
    { sourceProjectId: sourceProjId },
    { $set: snapshotDoc },
    { upsert: true }
  );

  const savedRecord = await approvalCol.findOne({ sourceProjectId: sourceProjId });
  return {
    ...savedRecord,
    id: savedRecord?._id.toString()
  };
}

/**
 * Retrieves all approved project records from lams_db.Project_Approval_LA for Financial Officer / Finance Minister.
 */
export async function getApprovedProjectsLA(): Promise<any[]> {
  const approvalCol = getProjectApprovalLACollection();
  const docs = await approvalCol
    .find({})
    .sort({ approvedAt: -1, updatedAt: -1 })
    .toArray();

  return docs.map(doc => ({
    ...doc,
    id: doc._id.toString(),
    _id: doc._id.toString()
  }));
}

/**
 * Approves a project and stores it in the Project_Approved_Project collection.
 */
export async function approveProject(id: string): Promise<any | null> {
  const collection = getProjectsCollection<ProjectDocument>();
  const approvedCollection = getApprovedProjectsCollection<ProjectDocument>();
  const trimmedId = id.trim();

  let filter: Filter<ProjectDocument> = {};
  if (ObjectId.isValid(trimmedId)) {
    filter = { _id: new ObjectId(trimmedId) };
  } else {
    filter = { code: trimmedId };
  }

  const result = await collection.findOneAndUpdate(
    filter,
    { $set: { financialStatus: 'Approved', updatedAt: new Date() } as any },
    { returnDocument: 'after' }
  );

  if (!result) {
    return null;
  }

  // Insert into approved collection (using upsert to avoid duplicates)
  await approvedCollection.updateOne(
    { _id: result._id },
    { $set: result },
    { upsert: true }
  );

  return formatProject(result as ProjectDocument);
}
