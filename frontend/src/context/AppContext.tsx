import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LandAcquisitionProject,
  LandParcel,
  CompensationRecord,
  AffectedFamily,
  DocumentRecord,
  SystemAlert,
  ProjectRiskAnalytics,
  AdminRoleConfig,
  AdminUser,
  ParcelStatus,
  CompensationStatus,
  HissaRecord,
  UserRole
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_COMPENSATION_RECORDS,
  INITIAL_AFFECTED_FAMILIES,
  INITIAL_DOCUMENTS,
  INITIAL_ALERTS,
  INITIAL_RISK_ANALYTICS,
  INITIAL_ADMIN_ROLES,
  INITIAL_ADMIN_USERS
} from '../data/mockData';

import {
  fetchParcels,
  fetchProjects,
  fetchHissaRecords,
  createProject,
  updateProject as updateProjectApi,
  fetchApprovedProjectsLA,
  approveProjectLA,
  ParcelQueryParams,
  CreateProjectRequest
} from '../services/api';
import { featureCollectionToLandParcels } from '../utils/geoAdapter';

export type PageId =
  | 'dashboard'
  | 'district-dashboard'
  | 'projects'
  | 'project-detail'
  | 'project-route'
  | 'gis-parcels'
  | 'workflow'
  | 'compensation'
  | 'affected-families'
  | 'documents'
  | 'alerts'
  | 'analytics'
  | 'district-monitoring'
  | 'administration';

export type JurisdictionLevel = 'National' | 'State' | 'District' | 'Project';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedParcelId: string | null;
  setSelectedParcelId: (id: string | null) => void;
  selectedFamilyId: string | null;
  setSelectedFamilyId: (id: string | null) => void;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  jurisdictionLevel: JurisdictionLevel;
  setJurisdictionLevel: (level: JurisdictionLevel) => void;
  selectedJurisdictionName: string;
  setSelectedJurisdictionName: (name: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data Entities
  projects: LandAcquisitionProject[];
  approvedProjectsLA: any[];
  parcels: LandParcel[];
  isParcelsLoading: boolean;
  parcelsError: string | null;
  hissaRecords: HissaRecord[];
  hissaByParcel: Record<string, HissaRecord[]>;
  getHissaByParcelId: (parcelId: string) => HissaRecord[];
  reloadParcels: (params?: ParcelQueryParams) => Promise<void>;
  compensationRecords: CompensationRecord[];
  affectedFamilies: AffectedFamily[];
  documents: DocumentRecord[];
  alerts: SystemAlert[];
  riskAnalytics: ProjectRiskAnalytics[];
  adminRoles: AdminRoleConfig[];
  adminUsers: AdminUser[];
  
  // Computed helpers
  activeProject: LandAcquisitionProject | undefined;
  activeParcel: LandParcel | undefined;
  activeFamily: AffectedFamily | undefined;
  activeDocument: DocumentRecord | undefined;
  unreadAlertsCount: number;

  // Actions
  updateParcelStatus: (parcelId: string, newStatus: ParcelStatus, newCompStatus?: CompensationStatus) => void;
  updateCompensationStatus: (recordId: string, newStatus: CompensationStatus, transactionRef?: string) => void;
  resolveAlert: (alertId: string, notes: string) => void;
  addDocument: (newDoc: Omit<DocumentRecord, 'id' | 'uploadedDate' | 'sha256Hash' | 'auditTrail'>) => void;
  addNewProject: (project: Partial<LandAcquisitionProject>) => void;
  createProjectRecord: (projectData: CreateProjectRequest) => Promise<LandAcquisitionProject>;
  navigateToProject: (projectId: string) => void;
  openProjectDetail: (projectId: string) => void;
  openProjectRoute: (projectId: string) => void;
  updateProjectRoute: (projectId: string, routeData: Partial<LandAcquisitionProject>) => void;
  updateProjectVerification: (projectId: string, updates: Partial<LandAcquisitionProject>) => Promise<void>;
  navigateToParcelInGis: (parcelId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('Land Acquisition Officer');
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-001');
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [jurisdictionLevel, setJurisdictionLevel] = useState<JurisdictionLevel>('State');
  const [selectedJurisdictionName, setSelectedJurisdictionName] = useState<string>('Karnataka');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain state
  const [projects, setProjects] = useState<LandAcquisitionProject[]>(INITIAL_PROJECTS);
  const [approvedProjectsLA, setApprovedProjectsLA] = useState<any[]>([]);
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [hissaRecords, setHissaRecords] = useState<HissaRecord[]>([]);
  const [hissaByParcel, setHissaByParcel] = useState<Record<string, HissaRecord[]>>({});
  const [isParcelsLoading, setIsParcelsLoading] = useState<boolean>(true);
  const [parcelsError, setParcelsError] = useState<string | null>(null);
  const [compensationRecords, setCompensationRecords] = useState<CompensationRecord[]>(INITIAL_COMPENSATION_RECORDS);
  const [affectedFamilies, setAffectedFamilies] = useState<AffectedFamily[]>(INITIAL_AFFECTED_FAMILIES);
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [riskAnalytics, setRiskAnalytics] = useState<ProjectRiskAnalytics[]>(INITIAL_RISK_ANALYTICS);
  const [adminRoles, setAdminRoles] = useState<AdminRoleConfig[]>(INITIAL_ADMIN_ROLES);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);

  const getHissaByParcelId = (parcelId: string): HissaRecord[] => {
    return hissaByParcel[parcelId] || [];
  };

  const reloadParcels = async (params?: ParcelQueryParams) => {
    setIsParcelsLoading(true);
    setParcelsError(null);
    try {
      const [featureCollection, hissaList] = await Promise.all([
        fetchParcels(params),
        fetchHissaRecords().catch((hErr) => {
          console.warn('[AppContext] Could not fetch hissa records:', hErr);
          return [] as HissaRecord[];
        })
      ]);

      const hissaMap: Record<string, HissaRecord[]> = {};
      for (const h of hissaList) {
        if (!hissaMap[h.parcel_id]) {
          hissaMap[h.parcel_id] = [];
        }
        hissaMap[h.parcel_id].push(h);
      }

      setHissaRecords(hissaList);
      setHissaByParcel(hissaMap);

      const adapted = featureCollectionToLandParcels(featureCollection);
      
      // Merge Hissa records and resolved owner information into each parcel
      const enrichedParcels = adapted.map((parcel) => {
        const associatedHissas = hissaMap[parcel.parcelId] || [];
        const hasHissa = associatedHissas.length > 0;
        
        let ownerDisplay = parcel.ownerName;
        if (hasHissa) {
          const validOwnerNames = associatedHissas
            .map((h) => h.owner?.name)
            .filter((name): name is string => Boolean(name && name.trim()));
          
          if (validOwnerNames.length > 0) {
            ownerDisplay = validOwnerNames.join(', ');
          }
        }

        return {
          ...parcel,
          hissaRecords: associatedHissas,
          hasHissa,
          ownerName: ownerDisplay
        };
      });

      setParcels(enrichedParcels);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('[AppContext] Error loading real K-GIS parcels:', errorMsg);
      setParcelsError(errorMsg);
    } finally {
      setIsParcelsLoading(false);
    }
  };

  const loadProjectsFromApi = async () => {
    try {
      const dbProjects = await fetchProjects();
      if (Array.isArray(dbProjects) && dbProjects.length > 0) {
        const adaptedDbProjects: LandAcquisitionProject[] = dbProjects.map((p) => ({
          id: p._id || p.id,
          code: p.code,
          name: p.name,
          projectType: p.projectType || 'Highway Infrastructure',
          parentAuthority: p.parentAuthority || 'Public Works Department, Govt of Karnataka',
          agencyName: p.agencyName || 'Karnataka State Highway Improvement Project',
          agencyType: p.agencyType || 'State Highway Authority',
          department: 'Public Works Department',
          implementingAgency: p.agencyName || 'Karnataka State Highway Improvement Project',
          state: p.state || 'Karnataka',
          district: p.district,
          taluks: [p.district],
          villagesCount: p.selectedParcelCount || 1,
          landRequiredAcres: p.landRequiredAcres,
          landAcquiredAcres: p.landAcquiredAcres || p.selectedLandAcres || 0,
          progressPercentage: p.progressPercentage || 0,
          currentStage: p.currentStage || 'Proposal',
          status: p.status || 'In Progress',
          riskScore: 25,
          riskLevel: 'Low',
          primaryRiskFactor: 'Land Acquisition & Cadastral Verification',
          expectedDelayDays: 0,
          affectedFamiliesCount: 0,
          displacedFamiliesCount: 0,
          totalCompensationAssessedCr: p.estimatedCompensationCr || 0,
          totalCompensationPaidCr: 0,
          lastUpdated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-IN') : 'Just now',
          description: p.description || p.scope || '',
          selectedParcelIds: Array.isArray(p.selectedParcelIds) ? p.selectedParcelIds : [],
          routeWaypoints: p.routeWaypoints || undefined,
          proposedLengthKm: p.proposedLengthKm || p.routeLengthKm || undefined,
          routeLengthKm: p.routeLengthKm || p.proposedLengthKm || undefined,
          rowWidthM: p.rowWidthM || undefined,
          routeStatus: p.routeStatus || undefined,
          submittedAt: p.submittedAt || (p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : undefined),
          verification: p.verification || undefined,
          stages: [
            { stage: 'Proposal', status: 'In Progress', targetDate: '2026-10-31', responsibleAuthority: p.agencyName || 'PIU Director', documentsCount: 1, pendingActionsCount: 1, notes: 'Land selection completed' },
            { stage: 'Verification', status: 'Pending', targetDate: '2026-12-31', responsibleAuthority: 'SLAO', documentsCount: 0, pendingActionsCount: 2, notes: 'JMS pending' }
          ],
          villages: []
        }));
        
        setProjects((prev) => {
          // Prepend DB projects, avoiding duplicate IDs
          const existingIds = new Set(adaptedDbProjects.map(dp => dp.id));
          return [...adaptedDbProjects, ...prev.filter(p => !existingIds.has(p.id))];
        });
      }
    } catch (err) {
      console.warn('[AppContext] Could not fetch projects from API:', err);
    }
  };

  const loadApprovedProjectsLA = async () => {
    try {
      const approved = await fetchApprovedProjectsLA();
      if (Array.isArray(approved)) {
        setApprovedProjectsLA(approved);
      }
    } catch (err) {
      console.warn('[AppContext] Could not fetch Project_Approval_LA:', err);
    }
  };

  useEffect(() => {
    reloadParcels();
    loadProjectsFromApi();
    loadApprovedProjectsLA();

    const intervalId = setInterval(() => {
      loadProjectsFromApi();
      loadApprovedProjectsLA();
    }, 8000); // Poll every 8s for new proposal arrivals & approvals

    return () => clearInterval(intervalId);
  }, []);

  const createProjectRecord = async (projectData: CreateProjectRequest): Promise<LandAcquisitionProject> => {
    const created = await createProject(projectData);
    const mongoId = created._id || created.id;

    const newProject: LandAcquisitionProject = {
      id: mongoId,
      code: created.code,
      name: created.name,
      projectType: created.projectType || 'Highway Infrastructure',
      parentAuthority: created.parentAuthority || 'Public Works Department, Govt of Karnataka',
      agencyName: created.agencyName || 'Karnataka State Highway Improvement Project',
      agencyType: created.agencyType || 'State Highway Authority',
      department: 'Public Works Department',
      implementingAgency: created.agencyName || 'Karnataka State Highway Improvement Project',
      state: created.state || 'Karnataka',
      district: created.district,
      taluks: [created.district],
      villagesCount: created.selectedParcelCount || 1,
      landRequiredAcres: Number(created.landRequiredAcres),
      landAcquiredAcres: Number(created.landAcquiredAcres || created.selectedLandAcres || 0),
      progressPercentage: created.progressPercentage || 0,
      currentStage: 'Proposal',
      status: 'In Progress',
      riskScore: 20,
      riskLevel: 'Low',
      primaryRiskFactor: 'Cadastral Parcel Acquisition',
      expectedDelayDays: 0,
      affectedFamiliesCount: 0,
      displacedFamiliesCount: 0,
      totalCompensationAssessedCr: Number(created.estimatedCompensationCr || 0),
      totalCompensationPaidCr: 0,
      lastUpdated: 'Just now (Saved in MongoDB)',
      description: created.description || created.scope || '',
      selectedParcelIds: created.selectedParcelIds || projectData.selectedParcelIds || [],
      stages: [
        { stage: 'Proposal', status: 'In Progress', targetDate: '2026-10-31', responsibleAuthority: created.agencyName || 'PIU Director', documentsCount: 1, pendingActionsCount: 1, notes: 'Land selection registered' },
        { stage: 'Verification', status: 'Pending', targetDate: '2026-12-31', responsibleAuthority: 'SLAO', documentsCount: 0, pendingActionsCount: 2, notes: 'JMS pending' }
      ],
      villages: []
    };

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setCurrentPage('project-detail');
    return newProject;
  };

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const activeParcel = parcels.find(p => p.parcelId === selectedParcelId);
  const activeFamily = affectedFamilies.find(f => f.familyId === selectedFamilyId);
  const activeDocument = documents.find(d => d.id === selectedDocumentId);
  const unreadAlertsCount = alerts.filter(a => a.status === 'Open').length;

  const navigateToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project-detail');
  };

  const openProjectDetail = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project-detail');
  };

  const openProjectRoute = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project-route');
  };

  const updateProjectRoute = async (projectId: string, routeData: Partial<LandAcquisitionProject>) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            ...routeData,
            lastUpdated: 'Just now (Route Alignment Updated)'
          };
        }
        return p;
      })
    );

    try {
      await updateProjectApi(projectId, routeData);
    } catch (err) {
      console.warn('[AppContext] Could not persist route update to API:', err);
    }
  };

  const updateProjectVerification = async (projectId: string, updates: Partial<LandAcquisitionProject>) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            ...updates,
            lastUpdated: 'Just now (Verification Updated)'
          };
        }
        return p;
      })
    );

    try {
      if (
        updates.status === 'FORWARDED_TO_FINANCIAL_OFFICER' ||
        updates.status === 'VERIFIED' ||
        updates.verification?.status === 'FORWARDED_TO_FINANCIAL_OFFICER' ||
        updates.verification?.decision === 'VERIFIED'
      ) {
        await approveProjectLA(projectId, updates.verification || updates);
        await loadApprovedProjectsLA();
      } else {
        await updateProjectApi(projectId, updates);
      }
    } catch (err) {
      console.warn('[AppContext] Could not persist verification update to API:', err);
    }
  };

  const navigateToParcelInGis = (parcelId: string) => {
    setSelectedParcelId(parcelId);
    setCurrentPage('gis-parcels');
  };

  const updateParcelStatus = (parcelId: string, newStatus: ParcelStatus, newCompStatus?: CompensationStatus) => {
    setParcels(prev =>
      prev.map(p => {
        if (p.parcelId === parcelId) {
          return {
            ...p,
            acquisitionStatus: newStatus,
            compensationStatus: newCompStatus || p.compensationStatus,
            lastUpdated: 'Just now (Updated by SLAO)'
          };
        }
        return p;
      })
    );
  };

  const updateCompensationStatus = (recordId: string, newStatus: CompensationStatus, transactionRef?: string) => {
    setCompensationRecords(prev =>
      prev.map(rec => {
        if (rec.id === recordId) {
          const isPaid = newStatus === 'Paid';
          return {
            ...rec,
            paymentStatus: newStatus,
            paidAmount: isPaid ? rec.approvedAmount : rec.paidAmount,
            pendingAmount: isPaid ? 0 : rec.pendingAmount,
            transactionReference: transactionRef || (isPaid ? `RBI-NEFT-${Date.now()}` : rec.transactionReference),
            lastUpdated: 'Just now (e-Kuber Disbursed)'
          };
        }
        return rec;
      })
    );
  };

  const resolveAlert = (alertId: string, notes: string) => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            status: 'Resolved',
            resolutionNotes: notes || 'Administrative review completed by SLAO.'
          };
        }
        return a;
      })
    );
  };

  const addDocument = (newDoc: Omit<DocumentRecord, 'id' | 'uploadedDate' | 'sha256Hash' | 'auditTrail'>) => {
    const docId = `DOC-KA-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' IST';
    const completeDoc: DocumentRecord = {
      ...newDoc,
      id: docId,
      uploadedDate: dateStr,
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      auditTrail: [
        {
          timestamp: dateStr,
          action: 'Document Uploaded & Registered in Digitized Land Repository',
          actor: newDoc.uploadedBy
        }
      ]
    };
    setDocuments(prev => [completeDoc, ...prev]);
  };

  const addNewProject = (projectData: Partial<LandAcquisitionProject>) => {
    const projId = `proj-${String(projects.length + 1).padStart(3, '0')}`;
    const code = `LA-KA-2026-${String(Math.floor(10000 + Math.random() * 90000)).slice(0, 5)}`;
    const newProj: LandAcquisitionProject = {
      id: projId,
      code: projectData.code || code,
      name: projectData.name || 'New Infrastructure Acquisition Corridor',
      department: projectData.department || 'Public Works Department',
      implementingAgency: projectData.implementingAgency || 'KRDCL',
      state: projectData.state || 'Karnataka',
      district: projectData.district || 'Bengaluru Rural',
      taluks: projectData.taluks || ['Ramanagara'],
      villagesCount: projectData.villagesCount || 6,
      landRequiredAcres: projectData.landRequiredAcres || 120.0,
      landAcquiredAcres: 0,
      progressPercentage: 0,
      currentStage: 'Proposal',
      status: 'In Progress',
      riskScore: 35,
      riskLevel: 'Low',
      primaryRiskFactor: 'Initial joint boundary pegging and SIA baseline survey scheduled',
      expectedDelayDays: 0,
      affectedFamiliesCount: projectData.affectedFamiliesCount || 45,
      displacedFamiliesCount: 10,
      totalCompensationAssessedCr: projectData.totalCompensationAssessedCr || 60.0,
      totalCompensationPaidCr: 0,
      lastUpdated: 'Just now',
      description: projectData.description || 'Newly registered public infrastructure land acquisition project.',
      stages: [
        { stage: 'Proposal', status: 'In Progress', targetDate: '2026-10-31', responsibleAuthority: 'PIU Director', documentsCount: 1, pendingActionsCount: 1, notes: 'DPR submission' },
        { stage: 'Verification', status: 'Pending', targetDate: '2026-12-31', responsibleAuthority: 'SLAO', documentsCount: 0, pendingActionsCount: 2, notes: 'JMS pending' },
        { stage: 'Approval', status: 'Pending', targetDate: '2027-02-28', responsibleAuthority: 'State High Power Committee', documentsCount: 0, pendingActionsCount: 1, notes: 'Cabinet note' },
        { stage: 'Notification', status: 'Pending', targetDate: '2027-04-30', responsibleAuthority: 'Revenue Dept', documentsCount: 0, pendingActionsCount: 1, notes: 'Preliminary notice' },
        { stage: 'Award', status: 'Pending', targetDate: '2027-08-31', responsibleAuthority: 'CALA', documentsCount: 0, pendingActionsCount: 1, notes: 'Award order' },
        { stage: 'Compensation', status: 'Pending', targetDate: '2027-11-30', responsibleAuthority: 'Treasury / Lead Bank', documentsCount: 0, pendingActionsCount: 1, notes: 'DBT release' },
        { stage: 'Possession', status: 'Pending', targetDate: '2028-02-28', responsibleAuthority: 'DC Office', documentsCount: 0, pendingActionsCount: 1, notes: 'Fencing' },
        { stage: 'R&R', status: 'Pending', targetDate: '2028-05-31', responsibleAuthority: 'R&R Commissioner', documentsCount: 0, pendingActionsCount: 1, notes: 'Plot handovers' },
        { stage: 'Completed', status: 'Pending', targetDate: '2028-08-31', responsibleAuthority: 'Agency MD', documentsCount: 0, pendingActionsCount: 1, notes: 'Final mutation' }
      ],
      villages: [
        { villageName: 'Bidadi North', taluk: 'Bidadi', district: 'Bengaluru Rural', totalParcels: 20, totalAcres: 45.0, acquiredAcres: 0, acquiredPercentage: 0, affectedFamilies: 18, compensationDisbursedCr: 0 },
        { villageName: 'Kallugopa', taluk: 'Ramanagara', district: 'Bengaluru Rural', totalParcels: 25, totalAcres: 75.0, acquiredAcres: 0, acquiredPercentage: 0, affectedFamilies: 27, compensationDisbursedCr: 0 }
      ]
    };
    setProjects(prev => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProjectId,
        setSelectedProjectId,
        selectedParcelId,
        setSelectedParcelId,
        selectedFamilyId,
        setSelectedFamilyId,
        selectedDocumentId,
        setSelectedDocumentId,
        jurisdictionLevel,
        setJurisdictionLevel,
        selectedJurisdictionName,
        setSelectedJurisdictionName,
        searchQuery,
        setSearchQuery,
        projects,
        approvedProjectsLA,
        parcels,
        isParcelsLoading,
        parcelsError,
        hissaRecords,
        hissaByParcel,
        getHissaByParcelId,
        reloadParcels,
        compensationRecords,
        affectedFamilies,
        documents,
        alerts,
        riskAnalytics,
        adminRoles,
        adminUsers,
        activeProject,
        activeParcel,
        activeFamily,
        activeDocument,
        unreadAlertsCount,
        updateParcelStatus,
        updateCompensationStatus,
        resolveAlert,
        addDocument,
        addNewProject,
        createProjectRecord,
        navigateToProject,
        openProjectDetail,
        openProjectRoute,
        updateProjectRoute,
        updateProjectVerification,
        navigateToParcelInGis,
        currentRole,
        setCurrentRole
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
