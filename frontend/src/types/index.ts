export type AcquisitionStage =
  | 'Proposal'
  | 'Verification'
  | 'Approval'
  | 'Notification'
  | 'Award'
  | 'Compensation'
  | 'Possession'
  | 'R&R'
  | 'Completed';

export type ParcelStatus =
  | 'Acquired'
  | 'Under Acquisition'
  | 'Notification'
  | 'Compensation Pending'
  | 'Possession Pending'
  | 'R&R Pending';

export type CompensationStatus =
  | 'Paid'
  | 'Processing'
  | 'Pending Approval'
  | 'Payment Failed';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type AlertSeverity = 'Critical' | 'Warning' | 'Information';

export type ProjectWorkflowStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'RETURNED_FOR_CORRECTION'
  | 'RESUBMITTED'
  | 'VERIFIED'
  | 'FORWARDED_TO_FINANCIAL_OFFICER'
  | 'REJECTED'
  | 'In Progress'
  | 'Approved'
  | 'Delayed'
  | 'Completed';

export type UserRole =
  | 'Land Acquisition Officer'
  | 'Financial Officer / Finance Minister'
  | 'Central Ministry'
  | 'State Government'
  | 'District Administration'
  | 'Land Acquisition Authority'
  | 'Project Implementing Agency';

export interface HissaOwner {
  owner_id: string;
  name: string;
  mobile?: string;
  address?: string;
}

export interface HissaRecord {
  _id: string;
  hissa_id: string;
  parcel_id: string;
  survey_no: string;
  hissa_no: string;
  extent: number;
  extent_unit: string;
  extent_basis?: string;
  owner_id: string;
  owner?: HissaOwner;
  parcel_geometry?: {
    type: string;
    coordinates: any;
  };
  geometry_source?: string;
  parcel_geometry_role?: string;
}

export interface LandParcel {
  parcelId: string;
  surveyNumber: string;
  cadastralId?: string;
  ulpin?: string;
  state: string;
  district: string;
  districtCode?: string;
  taluk: string;
  talukCode?: string;
  hobli?: string;
  hobliCode?: string;
  village: string;
  villageCode?: string;
  bhoomiVillageCode?: string;
  areaAcres: number;
  areaUnit?: string;
  landType: 'Agricultural' | 'Commercial' | 'Residential' | 'Government' | 'Forest' | string;
  latitude: number;
  longitude: number;
  coordinates: [number, number][] | [number, number][][] | [number, number][][][]; // Polygon or MultiPolygon Leaflet [lat, lng] coordinates
  projectId: string;
  projectName: string;
  acquisitionStatus: ParcelStatus;
  compensationAmount: number; // in INR
  compensationPaid: number;
  compensationStatus: CompensationStatus;
  possessionStatus: 'Pending' | 'In Progress' | 'Taken';
  possessionDate?: string;
  rrRequired: boolean;
  rrStatus: 'Not Required' | 'Pending' | 'In Progress' | 'Completed';
  affectedFamiliesCount: number;
  documentsCount: number;
  ownerName: string;
  aadhaarMasked?: string;
  khataNumber?: string;
  soilClassification?: string;
  marketRatePerAcre?: number;
  multiplierFactor?: number;
  solatiumPercentage?: number;
  lastUpdated: string;
  hissaRecords?: HissaRecord[];
  hasHissa?: boolean;
}

export interface VillageSummary {
  villageName: string;
  taluk: string;
  district: string;
  totalParcels: number;
  totalAcres: number;
  acquiredAcres: number;
  acquiredPercentage: number;
  affectedFamilies: number;
  compensationDisbursedCr: number;
}

export interface ProjectStageDetail {
  stage: AcquisitionStage;
  status: 'Completed' | 'In Progress' | 'Pending';
  completedDate?: string;
  targetDate: string;
  responsibleAuthority: string;
  documentsCount: number;
  pendingActionsCount: number;
  notes: string;
}

export interface TechnicalNotes {
  structures?: number;
  bridges?: number;
  interchanges?: number;
  flyovers?: number;
  railwayCrossings?: number;
  generalNotes?: string;
}

export interface LandAcquisitionProject {
  id: string;
  name: string;
  code: string; // e.g. LA-KA-2026-00127
  department: string;
  implementingAgency: string; // NHAI, Rail Infrastructure, Water Resources, etc.
  projectType?: string;
  parentAuthority?: string;
  agencyName?: string;
  agencyType?: string;
  state: string;
  district: string;
  taluks: string[];
  villagesCount: number;
  landRequiredAcres: number;
  landAcquiredAcres: number;
  progressPercentage: number;
  currentStage: AcquisitionStage;
  status: ProjectWorkflowStatus;
  workflowStatus?: ProjectWorkflowStatus;
  submittedAt?: string;
  verification?: {
    status?: ProjectWorkflowStatus;
    officerRemarks?: string;
    checklist?: Record<string, boolean>;
    reviewedAt?: string;
    reviewedBy?: string;
    decision?: 'VERIFIED' | 'RETURNED' | 'REJECTED';
  };
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryRiskFactor: string;
  expectedDelayDays: number;
  affectedFamiliesCount: number;
  displacedFamiliesCount: number;
  totalCompensationAssessedCr: number;
  totalCompensationPaidCr: number;
  lastUpdated: string;
  description: string;
  stages: ProjectStageDetail[];
  villages: VillageSummary[];
  selectedParcelIds?: string[];

  // Route & Alignment Information
  routeId?: string;
  routeName?: string;
  startLocation?: string;
  endLocation?: string;
  proposedLengthKm?: number;
  routeLengthKm?: number;
  rowWidthM?: number;
  lanes?: number;
  carriagewayWidthM?: number;
  medianWidthM?: number;
  serviceRoads?: boolean;
  routeStatus?: 'Draft' | 'Proposed' | 'Under Review' | 'Approved';
  highwayClassification?: string;
  projectPurpose?: string;
  technicalNotes?: TechnicalNotes;
  routeWaypoints?: [number, number][];
}

export interface CompensationRecord {
  id: string;
  parcelId: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  district: string;
  projectId: string;
  projectName: string;
  ownerBeneficiary: string;
  khataNumber: string;
  bankAccountMasked: string;
  ifscCode: string;
  assessedAmount: number; // in INR
  approvedAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: CompensationStatus;
  disbursementMode: 'RTGS/NEFT Direct Transfer' | 'Escrow Account' | 'Court Deposit (Dispute)';
  transactionReference?: string;
  lastUpdated: string;
  awardOrderNumber: string;
  awardDate: string;
}

export interface AffectedFamily {
  familyId: string;
  headOfFamily: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  village: string;
  taluk: string;
  district: string;
  surveyNumber: string;
  projectId: string;
  familyMembersCount: number;
  affectedType: 'Title Holder' | 'Tenant / Sharecropper' | 'Agricultural Labourer' | 'Artisan';
  isDisplaced: boolean;
  rrRequired: boolean;
  rrStatus: 'Not Required' | 'Pending' | 'In Progress' | 'Completed';
  compensationStatus: 'Paid' | 'Processing' | 'Pending';
  resettlementSiteName?: string;
  plotAllotted?: string;
  subsistenceAllowancePaid: boolean;
  trainingProvided: boolean;
  lastAssessedDate: string;
}

export interface DocumentRecord {
  id: string;
  documentName: string;
  category:
    | 'Project Proposal'
    | 'Land Records (RTC/Khata)'
    | 'Section 3A Notification'
    | 'Section 3D Declaration'
    | 'Social Impact Assessment (SIA)'
    | 'Award Orders'
    | 'Compensation Sanctions'
    | 'Possession Orders'
    | 'R&R Entitlements';
  projectId: string;
  projectName: string;
  parcelId?: string;
  surveyNumber?: string;
  version: string;
  fileFormat: 'PDF' | 'GeoTIFF' | 'DWG' | 'DOCX' | 'XLSX';
  fileSize: string;
  uploadedBy: string;
  uploadedByRole: string;
  uploadedDate: string;
  status: 'Verified' | 'Pending Verification' | 'Rejected' | 'Archived';
  gazetteNumber?: string;
  sha256Hash: string;
  auditTrail: {
    timestamp: string;
    action: string;
    actor: string;
  }[];
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  category: AlertSeverity;
  alertType:
    | 'Compensation Overdue'
    | 'Possession Delay'
    | 'Notification Deadline'
    | 'R&R Pending'
    | 'Document Upload'
    | 'Litigation / Stay Order'
    | 'Boundary Dispute';
  projectId: string;
  projectName: string;
  parcelId?: string;
  surveyNumber?: string;
  district: string;
  createdDate: string;
  assignedOfficer: string;
  assignedOfficerRole: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
  resolutionNotes?: string;
}

export interface ProjectRiskAnalytics {
  id?: string;
  projectId: string;
  projectName: string;
  district: string;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryIssue: string;
  expectedDelay: string;
  lastAssessment: string;
  factors: {
    name: string;
    impactScore: number; // 0-100
    weight: string;
    status: 'Normal' | 'Warning' | 'Critical';
    details: string;
  }[];
  trendData: { month: string; score: number }[];
}

export interface AdminRoleConfig {
  id: string;
  roleTitle: UserRole;
  jurisdictionLevel: 'National' | 'State' | 'District' | 'Taluk' | 'Project Zone';
  description: string;
  activeUsersCount: number;
  permissions: {
    viewProjects: boolean;
    manageProjects: boolean;
    viewLandParcels: boolean;
    updateAcquisitionStatus: boolean;
    manageCompensation: boolean;
    manageRR: boolean;
    uploadDocuments: boolean;
    viewAnalytics: boolean;
    systemConfiguration: boolean;
  };
  lastActivity: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  designation: string;
  role: UserRole;
  jurisdiction: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  badgeId: string;
}
