import { Filter, ObjectId, Document } from 'mongodb';
import { getProjectsCollection } from '../config/database.js';

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
    status: input.status || 'In Progress',
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

  return formatProject(result as ProjectDocument);
}
