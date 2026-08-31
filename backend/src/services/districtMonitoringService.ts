import { Filter, ObjectId, Document } from 'mongodb';
import { getApprovedProjectsCollection, getVerificationAuditCollection } from '../config/database.js';

export interface DistrictVerificationState {
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'RETURNED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: string | Date;
  rejectedBy?: string;
  rejectedAt?: string | Date;
  reason?: string;
  remarks?: string;
}

export interface VerificationAuditEntry {
  id?: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  district: string;
  action: 'VERIFIED' | 'RETURNED' | 'REJECTED';
  officer: string;
  date: string;
  remarks?: string;
  reason?: string;
}

export interface ApprovedProjectDocument extends Document {
  _id: ObjectId | string;
  projectName?: string;
  projectCode?: string;
  name?: string;
  code?: string;
  projectType?: string;
  agencyName?: string;
  agencyType?: string;
  department?: string;
  district: string;
  implementingAgency?: string;
  parentAuthority?: string;
  landRequiredAcres?: number;
  landAcquiredAcres?: number;
  selectedLandAcres?: number;
  selectedParcelCount?: number;
  selectedParcelIds?: string[];
  estimatedCompensationCr?: number;
  totalCompensationAssessedCr?: number;
  totalCompensationPaidCr?: number;
  financialStatus?: string;
  approvalStatus?: string;
  approvedBy?: string;
  approvedAt?: string | Date;
  forwardedAt?: string | Date;
  forwardedTo?: string;
  officerRemarks?: string;
  scope?: string;
  description?: string;
  state?: string;
  taluks?: string[];
  districtStatus?: 'PENDING_REVIEW' | 'VERIFIED' | 'RETURNED' | 'REJECTED';
  districtVerifiedAt?: string | Date;
  districtVerifiedBy?: string;
  districtRejectionReason?: string;
  districtReviewedAt?: string | Date;
  districtReviewedBy?: string;
  districtVerification?: DistrictVerificationState;
  verificationAudit?: VerificationAuditEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DistrictQueryParams {
  district?: string;
  tab?: 'pending' | 'verified' | 'returned' | 'all' | string;
  districtStatus?: string;
  verificationStatus?: string;
  search?: string;
  limit?: number | string;
}

export interface DistrictProjectResponse {
  projects: any[];
  counts: {
    pending: number;
    verified: number;
    returned: number;
    all: number;
  };
}

export function normalizeDistrictStatus(rawStatus?: string): 'PENDING_REVIEW' | 'VERIFIED' | 'RETURNED' {
  if (!rawStatus) return 'PENDING_REVIEW';
  const upper = rawStatus.toUpperCase().trim();
  if (upper === 'VERIFIED') return 'VERIFIED';
  if (upper === 'RETURNED' || upper === 'REJECTED') return 'RETURNED';
  return 'PENDING_REVIEW';
}

export function formatApprovedProject(doc: ApprovedProjectDocument): any {
  const pName = doc.projectName || doc.name || 'N/A';
  const pCode = doc.projectCode || doc.code || 'N/A';
  const landReq = doc.landRequiredAcres !== undefined && doc.landRequiredAcres !== null ? Number(doc.landRequiredAcres) : 0;
  const landAcq = doc.landAcquiredAcres !== undefined && doc.landAcquiredAcres !== null ? Number(doc.landAcquiredAcres) : 0;
  const pendingLand = Math.max(0, landReq - landAcq);
  const estComp = doc.estimatedCompensationCr !== undefined && doc.estimatedCompensationCr !== null
    ? Number(doc.estimatedCompensationCr)
    : (doc.totalCompensationAssessedCr !== undefined && doc.totalCompensationAssessedCr !== null ? Number(doc.totalCompensationAssessedCr) : 0);

  const status = normalizeDistrictStatus(doc.districtStatus || doc.districtVerification?.status);

  return {
    ...doc,
    id: doc._id.toString(),
    _id: doc._id.toString(),
    projectName: pName,
    projectCode: pCode,
    projectType: doc.projectType || 'General Infrastructure',
    district: doc.district || 'N/A',
    agencyName: doc.agencyName || doc.implementingAgency || 'N/A',
    implementingAgency: doc.implementingAgency || doc.agencyName || 'N/A',
    agencyType: doc.agencyType || 'N/A',
    parentAuthority: doc.parentAuthority || 'Govt of Karnataka',
    department: doc.department || 'Public Works Department',
    description: doc.description || doc.scope || 'N/A',
    landRequiredAcres: landReq,
    landAcquiredAcres: landAcq,
    pendingLandAcquisition: pendingLand,
    pendingLandAcres: pendingLand,
    estimatedCompensationCr: estComp,
    approvalStatus: doc.approvalStatus || 'APPROVED',
    approvedBy: doc.approvedBy || 'N/A',
    approvedAt: doc.approvedAt || 'N/A',
    forwardedAt: doc.forwardedAt || 'N/A',
    forwardedTo: doc.forwardedTo || 'DISTRICT_OFFICER',
    financialStatus: doc.financialStatus || 'Approved',
    officerRemarks: doc.officerRemarks || 'N/A',
    districtStatus: status,
    districtVerifiedAt: doc.districtVerifiedAt || doc.districtVerification?.verifiedAt || null,
    districtVerifiedBy: doc.districtVerifiedBy || doc.districtVerification?.verifiedBy || null,
    districtRejectionReason: doc.districtRejectionReason || doc.districtVerification?.reason || null,
    districtReviewedAt: doc.districtReviewedAt || doc.districtVerification?.rejectedAt || null,
    districtReviewedBy: doc.districtReviewedBy || doc.districtVerification?.rejectedBy || null,
  };
}

/**
 * Retrieves projects from Project_Approved_Project with status mapping, district filtering, search, and dynamic tab counts.
 */
export async function getDistrictProjects(params?: DistrictQueryParams): Promise<DistrictProjectResponse> {
  const collection = getApprovedProjectsCollection<ApprovedProjectDocument>();

  // Base district filter
  const districtFilter: Filter<ApprovedProjectDocument> = {};
  if (params?.district && params.district.trim() && params.district.toUpperCase() !== 'ALL') {
    const d = params.district.trim();
    districtFilter.district = { $regex: new RegExp(d, 'i') } as any;
  }

  // Determine Tab / Status
  const rawTab = (params?.tab || params?.districtStatus || params?.verificationStatus || 'all').toLowerCase().trim();

  // Status Filter Conditions
  const pendingCondition: Filter<ApprovedProjectDocument> = {
    $or: [
      { districtStatus: { $in: ['PENDING_REVIEW', 'PENDING', null] as any } },
      { districtStatus: { $exists: false } },
      { 'districtVerification.status': { $in: ['PENDING_REVIEW', 'PENDING', null] as any } }
    ]
  };

  const verifiedCondition: Filter<ApprovedProjectDocument> = {
    $or: [
      { districtStatus: 'VERIFIED' as any },
      { 'districtVerification.status': 'VERIFIED' as any }
    ]
  };

  const returnedCondition: Filter<ApprovedProjectDocument> = {
    $or: [
      { districtStatus: { $in: ['RETURNED', 'REJECTED'] } as any },
      { 'districtVerification.status': { $in: ['RETURNED', 'REJECTED'] } as any }
    ]
  };

  // Compute Tab Counts across all documents for the current district filter
  const [allDocsInDistrict, verifiedCount, returnedCount] = await Promise.all([
    collection.find(districtFilter).toArray(),
    collection.countDocuments({ ...districtFilter, ...verifiedCondition }),
    collection.countDocuments({ ...districtFilter, ...returnedCondition }),
  ]);

  const allCount = allDocsInDistrict.length;
  const pendingCount = Math.max(0, allCount - (verifiedCount + returnedCount));

  // Build the final query filter for the requested tab & search
  const queryFilter: Filter<ApprovedProjectDocument> = { ...districtFilter };

  if (rawTab === 'pending' || rawTab === 'pending_review') {
    Object.assign(queryFilter, pendingCondition);
  } else if (rawTab === 'verified') {
    Object.assign(queryFilter, verifiedCondition);
  } else if (rawTab === 'returned' || rawTab === 'rejected') {
    Object.assign(queryFilter, returnedCondition);
  }

  // Search Filter
  if (params?.search && params.search.trim()) {
    const s = params.search.trim();
    const searchCondition = {
      $or: [
        { projectName: { $regex: new RegExp(s, 'i') } },
        { projectCode: { $regex: new RegExp(s, 'i') } },
        { name: { $regex: new RegExp(s, 'i') } },
        { code: { $regex: new RegExp(s, 'i') } },
        { implementingAgency: { $regex: new RegExp(s, 'i') } },
        { agencyName: { $regex: new RegExp(s, 'i') } },
        { projectType: { $regex: new RegExp(s, 'i') } }
      ]
    };

    if (queryFilter.$or) {
      const existingOr = queryFilter.$or;
      delete queryFilter.$or;
      queryFilter.$and = [{ $or: existingOr }, searchCondition] as any;
    } else {
      Object.assign(queryFilter, searchCondition);
    }
  }

  const parsedLimit = params?.limit ? parseInt(String(params.limit), 10) : 500;
  const safeLimit = Math.min(Math.max(isNaN(parsedLimit) ? 500 : parsedLimit, 1), 1000);

  const docs = await collection
    .find(queryFilter)
    .sort({ forwardedAt: -1, approvedAt: -1, createdAt: -1, _id: -1 })
    .limit(safeLimit)
    .toArray();

  return {
    projects: docs.map(formatApprovedProject),
    counts: {
      pending: pendingCount,
      verified: verifiedCount,
      returned: returnedCount,
      all: allCount,
    }
  };
}

/**
 * Retrieves a single approved project document by ID.
 */
export async function getDistrictProjectById(id: string, officerDistrict?: string): Promise<any | null> {
  const collection = getApprovedProjectsCollection<ApprovedProjectDocument>();
  const trimmedId = id.trim();

  let doc: ApprovedProjectDocument | null = null;

  if (ObjectId.isValid(trimmedId)) {
    doc = await collection.findOne({ _id: new ObjectId(trimmedId) });
  }

  if (!doc) {
    doc = await collection.findOne({
      $or: [
        { projectCode: trimmedId },
        { code: trimmedId },
        { _id: trimmedId as any }
      ]
    });
  }

  if (!doc) {
    return null;
  }

  if (officerDistrict && officerDistrict.trim() && officerDistrict.toUpperCase() !== 'ALL') {
    const reg = new RegExp(officerDistrict.trim(), 'i');
    if (!reg.test(doc.district || '')) {
      throw new Error(`Unauthorized: Project belongs to "${doc.district}" which is outside your jurisdiction ("${officerDistrict}").`);
    }
  }

  return formatApprovedProject(doc);
}

/**
 * Verifies and accepts an approved project for the district.
 */
export async function verifyDistrictProject(
  id: string,
  officerName?: string,
  officerDistrict?: string,
  remarks?: string
): Promise<any> {
  const collection = getApprovedProjectsCollection<ApprovedProjectDocument>();
  const auditCollection = getVerificationAuditCollection<VerificationAuditEntry>();
  const trimmedId = id.trim();

  let filter: Filter<ApprovedProjectDocument> = {};
  if (ObjectId.isValid(trimmedId)) {
    filter = { _id: new ObjectId(trimmedId) };
  } else {
    filter = { $or: [{ projectCode: trimmedId }, { code: trimmedId }, { _id: trimmedId as any }] };
  }

  const project = await collection.findOne(filter);
  if (!project) {
    throw new Error(`Project not found with ID: ${id}`);
  }

  if (officerDistrict && officerDistrict.trim() && officerDistrict.toUpperCase() !== 'ALL') {
    const reg = new RegExp(officerDistrict.trim(), 'i');
    if (!reg.test(project.district || '')) {
      throw new Error(`Unauthorized: Project belongs to "${project.district}" which is outside your jurisdiction ("${officerDistrict}").`);
    }
  }

  const officer = officerName?.trim() || 'Shri R. K. Hegde, KAS (District Officer)';
  const nowStr = new Date().toISOString();
  const noteRemarks = remarks?.trim() || 'Verified and accepted by District Officer';

  const verificationState: DistrictVerificationState = {
    status: 'VERIFIED',
    verifiedBy: officer,
    verifiedAt: nowStr,
    remarks: noteRemarks
  };

  const auditEntry: VerificationAuditEntry = {
    projectId: project._id.toString(),
    projectName: project.projectName || project.name || 'N/A',
    projectCode: project.projectCode || project.code || 'N/A',
    district: project.district,
    action: 'VERIFIED',
    officer,
    date: nowStr,
    remarks: noteRemarks
  };

  await collection.updateOne(filter, {
    $set: {
      districtStatus: 'VERIFIED',
      districtVerifiedAt: nowStr,
      districtVerifiedBy: officer,
      districtVerification: verificationState,
      updatedAt: new Date()
    },
    $push: {
      verificationAudit: auditEntry
    } as any
  });

  await auditCollection.insertOne(auditEntry as any);

  const updated = await collection.findOne(filter);
  return formatApprovedProject(updated!);
}

/**
 * Rejects / returns a project back with required reason.
 */
export async function rejectDistrictProject(
  id: string,
  reason: string,
  officerName?: string,
  officerDistrict?: string
): Promise<any> {
  if (!reason || !reason.trim()) {
    throw new Error('A specific justification/reason for returning/rejecting is strictly required.');
  }

  const collection = getApprovedProjectsCollection<ApprovedProjectDocument>();
  const auditCollection = getVerificationAuditCollection<VerificationAuditEntry>();
  const trimmedId = id.trim();

  let filter: Filter<ApprovedProjectDocument> = {};
  if (ObjectId.isValid(trimmedId)) {
    filter = { _id: new ObjectId(trimmedId) };
  } else {
    filter = { $or: [{ projectCode: trimmedId }, { code: trimmedId }, { _id: trimmedId as any }] };
  }

  const project = await collection.findOne(filter);
  if (!project) {
    throw new Error(`Project not found with ID: ${id}`);
  }

  if (officerDistrict && officerDistrict.trim() && officerDistrict.toUpperCase() !== 'ALL') {
    const reg = new RegExp(officerDistrict.trim(), 'i');
    if (!reg.test(project.district || '')) {
      throw new Error(`Unauthorized: Project belongs to "${project.district}" which is outside your jurisdiction ("${officerDistrict}").`);
    }
  }

  const officer = officerName?.trim() || 'Shri R. K. Hegde, KAS (District Officer)';
  const nowStr = new Date().toISOString();
  const cleanReason = reason.trim();

  const verificationState: DistrictVerificationState = {
    status: 'RETURNED',
    rejectedBy: officer,
    rejectedAt: nowStr,
    reason: cleanReason
  };

  const auditEntry: VerificationAuditEntry = {
    projectId: project._id.toString(),
    projectName: project.projectName || project.name || 'N/A',
    projectCode: project.projectCode || project.code || 'N/A',
    district: project.district,
    action: 'RETURNED',
    officer,
    date: nowStr,
    reason: cleanReason,
    remarks: cleanReason
  };

  await collection.updateOne(filter, {
    $set: {
      districtStatus: 'RETURNED',
      districtRejectionReason: cleanReason,
      districtReviewedAt: nowStr,
      districtReviewedBy: officer,
      districtVerification: verificationState,
      updatedAt: new Date()
    },
    $push: {
      verificationAudit: auditEntry
    } as any
  });

  await auditCollection.insertOne(auditEntry as any);

  const updated = await collection.findOne(filter);
  return formatApprovedProject(updated!);
}

/**
 * Calculates district summary KPIs and financial/land totals strictly from the database.
 */
export async function getDistrictStats(district?: string): Promise<any> {
  const collection = getApprovedProjectsCollection<ApprovedProjectDocument>();
  const filter: Filter<ApprovedProjectDocument> = {};

  if (district && district.trim() && district.toUpperCase() !== 'ALL') {
    filter.district = { $regex: new RegExp(district.trim(), 'i') } as any;
  }

  const docs = await collection.find(filter).toArray();

  let totalLandRequired = 0;
  let totalLandAcquired = 0;
  let totalEstimatedCompensation = 0;
  let totalPaidCompensation = 0;

  let projectsReceived = docs.length;
  let pendingVerification = 0;
  let verifiedProjects = 0;
  let returnedProjects = 0;

  for (const doc of docs) {
    const lReq = Number(doc.landRequiredAcres) || 0;
    const lAcq = Number(doc.landAcquiredAcres) || 0;
    const compEst = Number(doc.estimatedCompensationCr) || Number(doc.totalCompensationAssessedCr) || 0;
    const compPaid = Number(doc.totalCompensationPaidCr) || 0;

    totalLandRequired += lReq;
    totalLandAcquired += lAcq;
    totalEstimatedCompensation += compEst;
    totalPaidCompensation += compPaid;

    const status = normalizeDistrictStatus(doc.districtStatus || doc.districtVerification?.status);
    if (status === 'VERIFIED') {
      verifiedProjects++;
    } else if (status === 'RETURNED') {
      returnedProjects++;
    } else {
      pendingVerification++;
    }
  }

  const pendingLand = Math.max(0, totalLandRequired - totalLandAcquired);
  const pendingCompensation = Math.max(0, totalEstimatedCompensation - totalPaidCompensation);
  const acquisitionCompletionPercentage =
    totalLandRequired > 0 ? Number(((totalLandAcquired / totalLandRequired) * 100).toFixed(1)) : 0;
  const compensationPayoutPercentage =
    totalEstimatedCompensation > 0
      ? Number(((totalPaidCompensation / totalEstimatedCompensation) * 100).toFixed(1))
      : 0;

  return {
    district: district || 'All Districts',
    projectsReceived,
    pendingVerification,
    verifiedProjects,
    returnedProjects,
    totalLandRequiredAcres: Number(totalLandRequired.toFixed(2)),
    totalLandAcquiredAcres: Number(totalLandAcquired.toFixed(2)),
    pendingLandAcres: Number(pendingLand.toFixed(2)),
    acquisitionCompletionPercentage,
    totalEstimatedCompensationCr: Number(totalEstimatedCompensation.toFixed(2)),
    totalPaidCompensationCr: Number(totalPaidCompensation.toFixed(2)),
    pendingCompensationCr: Number(pendingCompensation.toFixed(2)),
    compensationPayoutPercentage,
  };
}

/**
 * Fetches recent verification activity records from audit trail.
 */
export async function getRecentActivity(district?: string): Promise<any[]> {
  const auditCollection = getVerificationAuditCollection<VerificationAuditEntry>();
  const filter: Filter<VerificationAuditEntry> = {};

  if (district && district.trim() && district.toUpperCase() !== 'ALL') {
    filter.district = { $regex: new RegExp(district.trim(), 'i') } as any;
  }

  const auditDocs = await auditCollection
    .find(filter)
    .sort({ date: -1, _id: -1 })
    .limit(25)
    .toArray();

  return auditDocs.map(a => ({
    ...a,
    id: a._id.toString()
  }));
}
