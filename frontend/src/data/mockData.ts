import {
  LandAcquisitionProject,
  CompensationRecord,
  AffectedFamily,
  DocumentRecord,
  SystemAlert,
  ProjectRiskAnalytics,
  AdminRoleConfig,
  AdminUser
} from '../types';

export const INITIAL_PROJECTS: LandAcquisitionProject[] = [
  {
    id: 'proj-001',
    code: 'LA-KA-2026-00127',
    name: 'Bengaluru–Mysuru Highway Expansion (NH-275 10-Lane Corridor)',
    department: 'Ministry of Road Transport & Highways',
    implementingAgency: 'NHAI (National Highways Authority of India)',
    projectType: 'Highway Expansion',
    parentAuthority: 'National Highways Authority of India (NHAI)',
    agencyName: 'PIU Ramanagara / NHAI HQ',
    agencyType: 'Autonomous Central Authority',
    routeId: 'ROUTE-NH275-EXPRESSWAY',
    routeName: 'Bengaluru–Mysuru 10-Lane Greenfield Expressway Alignment',
    startLocation: 'KUMBALGODU JUNCTION (CH 18+200)',
    endLocation: 'NIDAGHATTA BYPASS (CH 74+500)',
    proposedLengthKm: 56.3,
    rowWidthM: 60,
    lanes: 10,
    carriagewayWidthM: 35.0,
    medianWidthM: 5.0,
    serviceRoads: true,
    routeStatus: 'Proposed',
    highwayClassification: 'National Expressway (NE-7)',
    projectPurpose: 'Inter-city rapid transit corridor connecting industrial zones and reducing travel time between Bengaluru and Mysuru to 75 minutes.',
    technicalNotes: {
      structures: 42,
      bridges: 8,
      interchanges: 4,
      flyovers: 12,
      railwayCrossings: 2,
      generalNotes: 'Includes 6-lane main carriageway + 2-lane service roads on both sides. DGPS pegging and joint measurement survey completed.'
    },
    routeWaypoints: [
      [12.8440, 74.9350],
      [12.8465, 74.9395],
      [12.8490, 74.9440],
      [12.8520, 74.9485],
      [12.8550, 74.9530],
      [12.8580, 74.9575]
    ],
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    taluks: ['Ramanagara', 'Channapatna', 'Bidadi', 'Nelamangala'],
    villagesCount: 14,
    landRequiredAcres: 250.0,
    landAcquiredAcres: 164.5,
    progressPercentage: 65.8,
    currentStage: 'Compensation',
    status: 'In Progress',
    riskScore: 74,
    riskLevel: 'High',
    primaryRiskFactor: 'Compensation disbursement pending in Avverahalli & Bidadi clusters; R&R colony litigation',
    expectedDelayDays: 68,
    affectedFamiliesCount: 143,
    displacedFamiliesCount: 28,
    totalCompensationAssessedCr: 120.4,
    totalCompensationPaidCr: 95.2,
    lastUpdated: '2026-08-28 14:30 IST',
    description: 'Land acquisition for widening the key economic corridor connecting Bengaluru to Mysuru, requiring bypass loops, toll plaza realignments, and service road access.',
    stages: [
      {
        stage: 'Proposal',
        status: 'Completed',
        completedDate: '2025-02-10',
        targetDate: '2025-02-15',
        responsibleAuthority: 'Project Director, NHAI PIU Bengaluru',
        documentsCount: 4,
        pendingActionsCount: 0,
        notes: 'Detailed Project Report (DPR) and preliminary alignment approved by Competent Authority.'
      },
      {
        stage: 'Verification',
        status: 'Completed',
        completedDate: '2025-04-18',
        targetDate: '2025-04-20',
        responsibleAuthority: 'Special Land Acquisition Officer (SLAO) Ramanagara',
        documentsCount: 18,
        pendingActionsCount: 0,
        notes: 'Joint Measurement Survey (JMS) completed across all 14 villages with Revenue & Survey Depts.'
      },
      {
        stage: 'Approval',
        status: 'Completed',
        completedDate: '2025-06-22',
        targetDate: '2025-06-30',
        responsibleAuthority: 'Principal Secretary (Revenue), Govt of Karnataka',
        documentsCount: 6,
        pendingActionsCount: 0,
        notes: 'State Level High-Power Committee accorded administrative sanction.'
      },
      {
        stage: 'Notification',
        status: 'Completed',
        completedDate: '2025-09-14',
        targetDate: '2025-09-15',
        responsibleAuthority: 'Ministry of Law & Justice / Central Gazette',
        documentsCount: 12,
        pendingActionsCount: 0,
        notes: 'Section 3A gazette notification published; 21-day objection hearing window concluded.'
      },
      {
        stage: 'Award',
        status: 'Completed',
        completedDate: '2026-01-30',
        targetDate: '2026-01-31',
        responsibleAuthority: 'Competent Authority for Land Acquisition (CALA)',
        documentsCount: 22,
        pendingActionsCount: 0,
        notes: 'Section 3G awards declared under NH Act 1956 in accordance with RFCTLARR 2013 schedule.'
      },
      {
        stage: 'Compensation',
        status: 'In Progress',
        completedDate: undefined,
        targetDate: '2026-09-30',
        responsibleAuthority: 'Special DC (Land Acquisition) & Lead Bank',
        documentsCount: 38,
        pendingActionsCount: 18,
        notes: '₹95.2 Cr disbursed directly via e-Kuber/DBT; 18 parcels awaiting title probate and joint khata dispute resolution.'
      },
      {
        stage: 'Possession',
        status: 'Pending',
        completedDate: undefined,
        targetDate: '2026-11-15',
        responsibleAuthority: 'District Magistrate & Police Commissionerate',
        documentsCount: 5,
        pendingActionsCount: 7,
        notes: 'Section 3E possession notices served for 112 parcels; physical handing-over pending final payment.'
      },
      {
        stage: 'R&R',
        status: 'In Progress',
        completedDate: undefined,
        targetDate: '2026-12-31',
        responsibleAuthority: 'R&R Commissioner, Karnataka',
        documentsCount: 15,
        pendingActionsCount: 7,
        notes: '21 families resettled in Sheshagirihalli layout; 7 families awaiting alternative site allotment.'
      },
      {
        stage: 'Completed',
        status: 'Pending',
        completedDate: undefined,
        targetDate: '2027-03-31',
        responsibleAuthority: 'National Highways Authority of India',
        documentsCount: 0,
        pendingActionsCount: 1,
        notes: 'Final mutation and revenue record transfer to NHAI.'
      }
    ],
    villages: [
      {
        villageName: 'Avverahalli',
        taluk: 'Ramanagara',
        district: 'Bengaluru Rural',
        totalParcels: 32,
        totalAcres: 48.0,
        acquiredAcres: 32.6,
        acquiredPercentage: 67.9,
        affectedFamilies: 36,
        compensationDisbursedCr: 26.4
      },
      {
        villageName: 'Kallugopahalli',
        taluk: 'Bidadi',
        district: 'Bengaluru Rural',
        totalParcels: 28,
        totalAcres: 42.5,
        acquiredAcres: 31.0,
        acquiredPercentage: 72.9,
        affectedFamilies: 29,
        compensationDisbursedCr: 24.8
      },
      {
        villageName: 'Sheshagirihalli',
        taluk: 'Bidadi',
        district: 'Bengaluru Rural',
        totalParcels: 24,
        totalAcres: 38.0,
        acquiredAcres: 28.5,
        acquiredPercentage: 75.0,
        affectedFamilies: 24,
        compensationDisbursedCr: 21.2
      },
      {
        villageName: 'Mayaganahalli',
        taluk: 'Ramanagara',
        district: 'Bengaluru Rural',
        totalParcels: 21,
        totalAcres: 37.0,
        acquiredAcres: 20.0,
        acquiredPercentage: 54.0,
        affectedFamilies: 22,
        compensationDisbursedCr: 12.6
      },
      {
        villageName: 'Channapatna Rural',
        taluk: 'Channapatna',
        district: 'Bengaluru Rural',
        totalParcels: 17,
        totalAcres: 29.0,
        acquiredAcres: 23.8,
        acquiredPercentage: 82.0,
        affectedFamilies: 18,
        compensationDisbursedCr: 10.2
      },
      {
        villageName: 'Kempadyapanahalli',
        taluk: 'Nelamangala',
        district: 'Bengaluru Rural',
        totalParcels: 26,
        totalAcres: 55.5,
        acquiredAcres: 28.6,
        acquiredPercentage: 51.5,
        affectedFamilies: 14,
        compensationDisbursedCr: 0.0
      }
    ]
  },
  {
    id: 'proj-002',
    code: 'LA-KA-2026-00084',
    name: 'Bengaluru Suburban Rail Corridor 2 (Baiyappanahalli–Chikkabanavara)',
    department: 'Ministry of Railways & Infrastructure Dev Dept',
    implementingAgency: 'K-RIDE (Rail Infrastructure Development Co. Karnataka)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    taluks: ['Bengaluru North', 'Yelahanka'],
    villagesCount: 9,
    landRequiredAcres: 180.0,
    landAcquiredAcres: 132.4,
    progressPercentage: 73.5,
    currentStage: 'Possession',
    status: 'In Progress',
    riskScore: 42,
    riskLevel: 'Medium',
    primaryRiskFactor: 'Defence land transfer NOC pending from Ministry of Defence (12 acres in Jalahalli)',
    expectedDelayDays: 24,
    affectedFamiliesCount: 88,
    displacedFamiliesCount: 42,
    totalCompensationAssessedCr: 210.0,
    totalCompensationPaidCr: 178.5,
    lastUpdated: '2026-08-27 17:15 IST',
    description: 'Corridor 2 of the 148km dedicated suburban commuter railway grid to decongest north Bengaluru tech clusters.',
    stages: [
      { stage: 'Proposal', status: 'Completed', completedDate: '2024-08-10', targetDate: '2024-08-15', responsibleAuthority: 'K-RIDE MD', documentsCount: 5, pendingActionsCount: 0, notes: 'Detailed Project Report cleared by Railway Board.' },
      { stage: 'Verification', status: 'Completed', completedDate: '2024-11-20', targetDate: '2024-11-30', responsibleAuthority: 'SLAO Urban', documentsCount: 20, pendingActionsCount: 0, notes: 'Joint boundary pegging with BBMP & Railways done.' },
      { stage: 'Approval', status: 'Completed', completedDate: '2025-01-15', targetDate: '2025-01-20', responsibleAuthority: 'Cabinet Committee on Economic Affairs', documentsCount: 8, pendingActionsCount: 0, notes: 'Union & State cabinet cost-sharing approved.' },
      { stage: 'Notification', status: 'Completed', completedDate: '2025-04-10', targetDate: '2025-04-15', responsibleAuthority: 'State Revenue Dept', documentsCount: 14, pendingActionsCount: 0, notes: 'Section 4(1) under KIAD Act published.' },
      { stage: 'Award', status: 'Completed', completedDate: '2025-08-25', targetDate: '2025-08-30', responsibleAuthority: 'KIADB SLAO', documentsCount: 26, pendingActionsCount: 0, notes: 'Award passed for 168 private survey numbers.' },
      { stage: 'Compensation', status: 'Completed', completedDate: '2026-03-10', targetDate: '2026-03-15', responsibleAuthority: 'Lead Bank & K-RIDE Finance', documentsCount: 45, pendingActionsCount: 0, notes: '₹178.5 Cr paid into individual Aadhaar-linked accounts.' },
      { stage: 'Possession', status: 'In Progress', completedDate: undefined, targetDate: '2026-10-30', responsibleAuthority: 'Deputy Commissioner Bengaluru Urban', documentsCount: 16, pendingActionsCount: 3, notes: 'Civil contractor mobilization initiated on cleared segments.' },
      { stage: 'R&R', status: 'In Progress', completedDate: undefined, targetDate: '2026-11-30', responsibleAuthority: 'BBMP R&R Cell', documentsCount: 18, pendingActionsCount: 4, notes: 'Slum rehabilitation transit flats handed over in Laggere.' },
      { stage: 'Completed', status: 'Pending', completedDate: undefined, targetDate: '2027-06-30', responsibleAuthority: 'Rail Infrastructure Dev Co.', documentsCount: 0, pendingActionsCount: 1, notes: 'Final handover to L&T civil package contractor.' }
    ],
    villages: [
      { villageName: 'Hebbal Kempapura', taluk: 'Bengaluru North', district: 'Bengaluru Urban', totalParcels: 18, totalAcres: 24.0, acquiredAcres: 24.0, acquiredPercentage: 100.0, affectedFamilies: 12, compensationDisbursedCr: 42.0 },
      { villageName: 'Jalahalli West', taluk: 'Bengaluru North', district: 'Bengaluru Urban', totalParcels: 22, totalAcres: 35.0, acquiredAcres: 23.0, acquiredPercentage: 65.7, affectedFamilies: 28, compensationDisbursedCr: 55.2 },
      { villageName: 'Chikkabanavara', taluk: 'Bengaluru North', district: 'Bengaluru Urban', totalParcels: 31, totalAcres: 52.0, acquiredAcres: 41.5, acquiredPercentage: 79.8, affectedFamilies: 30, compensationDisbursedCr: 46.8 },
      { villageName: 'Yeshwanthpur Industrial', taluk: 'Bengaluru North', district: 'Bengaluru Urban', totalParcels: 14, totalAcres: 28.4, acquiredAcres: 28.4, acquiredPercentage: 100.0, affectedFamilies: 8, compensationDisbursedCr: 34.5 }
    ]
  },
  {
    id: 'proj-003',
    code: 'LA-KA-2026-00192',
    name: 'Upper Krishna Irrigation Project Stage-III (Mulwad Lift Canal)',
    department: 'Water Resources Department',
    implementingAgency: 'Krishna Bhagya Jala Nigam Ltd (KBJNL)',
    state: 'Karnataka',
    district: 'Vijayapura',
    taluks: ['Basavana Bagewadi', 'Muddebihal', 'Sindagi'],
    villagesCount: 26,
    landRequiredAcres: 1420.0,
    landAcquiredAcres: 890.0,
    progressPercentage: 62.7,
    currentStage: 'Award',
    status: 'In Progress',
    riskScore: 65,
    riskLevel: 'High',
    primaryRiskFactor: 'Farmer demand for revised market rate multiplier from 1.5x to 2.0x in fertile black soil tracts',
    expectedDelayDays: 45,
    affectedFamiliesCount: 620,
    displacedFamiliesCount: 110,
    totalCompensationAssessedCr: 480.0,
    totalCompensationPaidCr: 290.0,
    lastUpdated: '2026-08-26 11:20 IST',
    description: 'Stage-III canal network to provide assured irrigation to 5.94 lakh hectares of drought-prone taluks in North Karnataka.',
    stages: [
      { stage: 'Proposal', status: 'Completed', completedDate: '2024-03-01', targetDate: '2024-03-10', responsibleAuthority: 'KBJNL Chief Engineer', documentsCount: 8, pendingActionsCount: 0, notes: 'Hydrological and command area surveys approved.' },
      { stage: 'Verification', status: 'Completed', completedDate: '2024-09-15', targetDate: '2024-09-20', responsibleAuthority: 'SLAO Vijayapura', documentsCount: 35, pendingActionsCount: 0, notes: 'Cadastral mapping of 840 survey plots.' },
      { stage: 'Approval', status: 'Completed', completedDate: '2025-02-12', targetDate: '2025-02-15', responsibleAuthority: 'Central Water Commission', documentsCount: 12, pendingActionsCount: 0, notes: 'Environmental & Techno-economic clearance granted.' },
      { stage: 'Notification', status: 'Completed', completedDate: '2025-07-28', targetDate: '2025-08-05', responsibleAuthority: 'District Magistrate Vijayapura', documentsCount: 28, pendingActionsCount: 0, notes: 'Section 11 Preliminary Notification issued under RFCTLARR 2013.' },
      { stage: 'Award', status: 'In Progress', completedDate: undefined, targetDate: '2026-09-30', responsibleAuthority: 'SLAO & Special Collector', documentsCount: 18, pendingActionsCount: 14, notes: 'Determination of market values based on 3-year registered sale deeds.' },
      { stage: 'Compensation', status: 'Pending', completedDate: undefined, targetDate: '2026-12-15', responsibleAuthority: 'Treasury Officer Vijayapura', documentsCount: 10, pendingActionsCount: 22, notes: 'Budget allocation released by Water Resources Ministry.' },
      { stage: 'Possession', status: 'Pending', completedDate: undefined, targetDate: '2027-02-28', responsibleAuthority: 'Revenue Inspector & Police', documentsCount: 2, pendingActionsCount: 26, notes: 'Canal alignment pegs fixed.' },
      { stage: 'R&R', status: 'Pending', completedDate: undefined, targetDate: '2027-05-30', responsibleAuthority: 'R&R Officer Vijayapura', documentsCount: 8, pendingActionsCount: 15, notes: 'Gram Sabha public hearings completed for 18 villages.' },
      { stage: 'Completed', status: 'Pending', completedDate: undefined, targetDate: '2027-10-31', responsibleAuthority: 'KBJNL Executive Engineer', documentsCount: 0, pendingActionsCount: 1, notes: 'Final transfer of canal corridor.' }
    ],
    villages: [
      { villageName: 'Kolhar', taluk: 'Basavana Bagewadi', district: 'Vijayapura', totalParcels: 84, totalAcres: 340.0, acquiredAcres: 240.0, acquiredPercentage: 70.6, affectedFamilies: 145, compensationDisbursedCr: 82.0 },
      { villageName: 'Nidagundi', taluk: 'Basavana Bagewadi', district: 'Vijayapura', totalParcels: 96, totalAcres: 410.0, acquiredAcres: 290.0, acquiredPercentage: 70.7, affectedFamilies: 180, compensationDisbursedCr: 98.0 },
      { villageName: 'Alamatti Rural', taluk: 'Muddebihal', district: 'Vijayapura', totalParcels: 72, totalAcres: 320.0, acquiredAcres: 190.0, acquiredPercentage: 59.4, affectedFamilies: 135, compensationDisbursedCr: 60.0 }
    ]
  },
  {
    id: 'proj-004',
    code: 'LA-KA-2026-00045',
    name: 'Tumakuru Industrial Township & Node (CBIC Corridor)',
    department: 'Commerce & Industries Department',
    implementingAgency: 'KIADB & NICDIT',
    state: 'Karnataka',
    district: 'Tumakuru',
    taluks: ['Vasanthanarasapura', 'Tumakuru'],
    villagesCount: 8,
    landRequiredAcres: 620.0,
    landAcquiredAcres: 540.0,
    progressPercentage: 87.1,
    currentStage: 'R&R',
    status: 'In Progress',
    riskScore: 28,
    riskLevel: 'Low',
    primaryRiskFactor: 'Minor boundary demarcation verification in Phase 3 utility corridor',
    expectedDelayDays: 10,
    affectedFamiliesCount: 112,
    displacedFamiliesCount: 18,
    totalCompensationAssessedCr: 320.0,
    totalCompensationPaidCr: 304.0,
    lastUpdated: '2026-08-25 09:40 IST',
    description: 'Chennai–Bengaluru Industrial Corridor (CBIC) prime manufacturing zone spanning electronics, automotive, and clean-tech clusters.',
    stages: [
      { stage: 'Proposal', status: 'Completed', completedDate: '2024-01-10', targetDate: '2024-01-15', responsibleAuthority: 'KIADB CEO', documentsCount: 6, pendingActionsCount: 0, notes: 'Master planning by NICDIT approved.' },
      { stage: 'Verification', status: 'Completed', completedDate: '2024-05-18', targetDate: '2024-05-20', responsibleAuthority: 'SLAO KIADB', documentsCount: 24, pendingActionsCount: 0, notes: 'Drone survey & digital cadastre finalized.' },
      { stage: 'Approval', status: 'Completed', completedDate: '2024-08-12', targetDate: '2024-08-15', responsibleAuthority: 'Commerce & Industry Minister', documentsCount: 10, pendingActionsCount: 0, notes: 'Statutory clearances secured.' },
      { stage: 'Notification', status: 'Completed', completedDate: '2024-11-20', targetDate: '2024-11-25', responsibleAuthority: 'Govt of Karnataka', documentsCount: 15, pendingActionsCount: 0, notes: 'Section 28(1) KIAD notification.' },
      { stage: 'Award', status: 'Completed', completedDate: '2025-04-10', targetDate: '2025-04-15', responsibleAuthority: 'Competent Authority Tumakuru', documentsCount: 30, pendingActionsCount: 0, notes: 'Consent awards finalized with 98% landowners.' },
      { stage: 'Compensation', status: 'Completed', completedDate: '2025-11-15', targetDate: '2025-11-30', responsibleAuthority: 'KIADB Finance', documentsCount: 52, pendingActionsCount: 0, notes: '₹304 Cr transferred smoothly.' },
      { stage: 'Possession', status: 'Completed', completedDate: '2026-03-20', targetDate: '2026-03-31', responsibleAuthority: 'Tahasildar Tumakuru', documentsCount: 18, pendingActionsCount: 0, notes: 'Physical boundary fencing erected.' },
      { stage: 'R&R', status: 'In Progress', completedDate: undefined, targetDate: '2026-09-30', responsibleAuthority: 'R&R Authority', documentsCount: 12, pendingActionsCount: 2, notes: 'Skill development training center functional.' },
      { stage: 'Completed', status: 'Pending', completedDate: undefined, targetDate: '2026-11-30', responsibleAuthority: 'NICDIT PMU', documentsCount: 0, pendingActionsCount: 1, notes: 'Allotment to industrial anchor investors.' }
    ],
    villages: [
      { villageName: 'Vasanthanarasapura', taluk: 'Tumakuru', district: 'Tumakuru', totalParcels: 64, totalAcres: 310.0, acquiredAcres: 280.0, acquiredPercentage: 90.3, affectedFamilies: 56, compensationDisbursedCr: 160.0 },
      { villageName: 'Kallambella', taluk: 'Tumakuru', district: 'Tumakuru', totalParcels: 52, totalAcres: 210.0, acquiredAcres: 185.0, acquiredPercentage: 88.1, affectedFamilies: 38, compensationDisbursedCr: 110.0 }
    ]
  },
  {
    id: 'proj-005',
    code: 'LA-KA-2026-00210',
    name: 'Hassan–Mangaluru Ghat Rail Section Doubling',
    department: 'Ministry of Railways',
    implementingAgency: 'South Western Railway (SWR)',
    state: 'Karnataka',
    district: 'Hassan',
    taluks: ['Sakleshpur', 'Alur'],
    villagesCount: 11,
    landRequiredAcres: 310.0,
    landAcquiredAcres: 310.0,
    progressPercentage: 100.0,
    currentStage: 'Completed',
    status: 'Completed',
    riskScore: 12,
    riskLevel: 'Low',
    primaryRiskFactor: 'Project fully acquired and handed over to engineering wing',
    expectedDelayDays: 0,
    affectedFamiliesCount: 64,
    displacedFamiliesCount: 14,
    totalCompensationAssessedCr: 98.0,
    totalCompensationPaidCr: 98.0,
    lastUpdated: '2026-08-20 10:00 IST',
    description: 'Capacity enhancement through Western Ghats corridor to boost freight connectivity to New Mangalore Port.',
    stages: [
      { stage: 'Proposal', status: 'Completed', completedDate: '2023-05-10', targetDate: '2023-05-15', responsibleAuthority: 'SWR GM', documentsCount: 4, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'Verification', status: 'Completed', completedDate: '2023-09-12', targetDate: '2023-09-20', responsibleAuthority: 'SLAO Hassan', documentsCount: 15, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'Approval', status: 'Completed', completedDate: '2023-12-10', targetDate: '2023-12-15', responsibleAuthority: 'Railway Board', documentsCount: 8, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'Notification', status: 'Completed', completedDate: '2024-04-18', targetDate: '2024-04-20', responsibleAuthority: 'State Revenue Dept', documentsCount: 12, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'Award', status: 'Completed', completedDate: '2024-10-05', targetDate: '2024-10-10', responsibleAuthority: 'CALA Hassan', documentsCount: 22, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'Compensation', status: 'Completed', completedDate: '2025-03-20', targetDate: '2025-03-25', responsibleAuthority: 'SWR Finance', documentsCount: 34, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'Possession', status: 'Completed', completedDate: '2025-08-15', targetDate: '2025-08-20', responsibleAuthority: 'Deputy Commissioner Hassan', documentsCount: 14, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'R&R', status: 'Completed', completedDate: '2026-02-10', targetDate: '2026-02-15', responsibleAuthority: 'R&R Directorate', documentsCount: 10, pendingActionsCount: 0, notes: 'Completed' },
      { stage: 'Completed', status: 'Completed', completedDate: '2026-06-30', targetDate: '2026-06-30', responsibleAuthority: 'Railway Safety Commissioner', documentsCount: 6, pendingActionsCount: 0, notes: 'Track commissioning handed over.' }
    ],
    villages: [
      { villageName: 'Donigal', taluk: 'Sakleshpur', district: 'Hassan', totalParcels: 35, totalAcres: 120.0, acquiredAcres: 120.0, acquiredPercentage: 100.0, affectedFamilies: 28, compensationDisbursedCr: 45.0 },
      { villageName: 'Yedakumari', taluk: 'Sakleshpur', district: 'Hassan', totalParcels: 28, totalAcres: 95.0, acquiredAcres: 95.0, acquiredPercentage: 100.0, affectedFamilies: 18, compensationDisbursedCr: 32.0 }
    ]
  },
  {
    id: 'proj-006',
    code: 'LA-KA-2026-00305',
    name: 'Ballari Solar Park High-Voltage Power Evacuation Corridor',
    department: 'Energy Department',
    implementingAgency: 'KPTCL (Karnataka Power Transmission Corp Ltd)',
    state: 'Karnataka',
    district: 'Ballari',
    taluks: ['Kudligi', 'Sandur'],
    villagesCount: 16,
    landRequiredAcres: 450.0,
    landAcquiredAcres: 210.0,
    progressPercentage: 46.7,
    currentStage: 'Notification',
    status: 'In Progress',
    riskScore: 58,
    riskLevel: 'Medium',
    primaryRiskFactor: 'Right of Way (RoW) compensation disputes for 400kV transmission tower footings',
    expectedDelayDays: 35,
    affectedFamiliesCount: 195,
    displacedFamiliesCount: 12,
    totalCompensationAssessedCr: 75.0,
    totalCompensationPaidCr: 32.5,
    lastUpdated: '2026-08-24 16:00 IST',
    description: '400kV transmission grid linking clean solar energy capacity to southern national grid nodes.',
    stages: [
      { stage: 'Proposal', status: 'Completed', completedDate: '2025-01-20', targetDate: '2025-01-30', responsibleAuthority: 'KPTCL Director Transmission', documentsCount: 5, pendingActionsCount: 0, notes: 'Grid integration scheme cleared.' },
      { stage: 'Verification', status: 'Completed', completedDate: '2025-06-15', targetDate: '2025-06-25', responsibleAuthority: 'SLAO Ballari', documentsCount: 18, pendingActionsCount: 0, notes: 'Tower footing GPS coordinate mapping completed.' },
      { stage: 'Approval', status: 'Completed', completedDate: '2025-10-10', targetDate: '2025-10-15', responsibleAuthority: 'Karnataka Electricity Regulatory Commission', documentsCount: 6, pendingActionsCount: 0, notes: 'Approved.' },
      { stage: 'Notification', status: 'In Progress', completedDate: undefined, targetDate: '2026-09-15', responsibleAuthority: 'Deputy Commissioner Ballari', documentsCount: 10, pendingActionsCount: 6, notes: 'Section 16 Right of User public notices being published.' },
      { stage: 'Award', status: 'Pending', completedDate: undefined, targetDate: '2026-11-30', responsibleAuthority: 'CALA KPTCL', documentsCount: 0, pendingActionsCount: 16, notes: 'Awaiting notification closure.' },
      { stage: 'Compensation', status: 'Pending', completedDate: undefined, targetDate: '2027-01-31', responsibleAuthority: 'KPTCL Accounts', documentsCount: 0, pendingActionsCount: 20, notes: 'Funds allocated.' },
      { stage: 'Possession', status: 'Pending', completedDate: undefined, targetDate: '2027-03-31', responsibleAuthority: 'Revenue Department', documentsCount: 0, pendingActionsCount: 16, notes: 'RoW possession protocol.' },
      { stage: 'R&R', status: 'Pending', completedDate: undefined, targetDate: '2027-05-30', responsibleAuthority: 'R&R Directorate', documentsCount: 0, pendingActionsCount: 5, notes: 'Crop loss compensation assessed.' },
      { stage: 'Completed', status: 'Pending', completedDate: undefined, targetDate: '2027-08-31', responsibleAuthority: 'KPTCL Engineering', documentsCount: 0, pendingActionsCount: 1, notes: 'Tower foundation work.' }
    ],
    villages: [
      { villageName: 'Gudekote', taluk: 'Kudligi', district: 'Ballari', totalParcels: 48, totalAcres: 160.0, acquiredAcres: 80.0, acquiredPercentage: 50.0, affectedFamilies: 72, compensationDisbursedCr: 12.0 },
      { villageName: 'Chornur', taluk: 'Sandur', district: 'Ballari', totalParcels: 54, totalAcres: 190.0, acquiredAcres: 95.0, acquiredPercentage: 50.0, affectedFamilies: 80, compensationDisbursedCr: 14.5 }
    ]
  }
];


// Realistic Compensation Records
export const INITIAL_COMPENSATION_RECORDS: CompensationRecord[] = [
  {
    id: 'CMP-2026-0041',
    parcelId: 'PCL-KA-BLR-079',
    surveyNumber: '79/2',
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    ownerBeneficiary: 'Sri Venkateshwara Warehousing LLP',
    khataNumber: 'KT-AVR-104',
    bankAccountMasked: 'SB-****-****-9014',
    ifscCode: 'SBIN0004521',
    assessedAmount: 4800000,
    approvedAmount: 4800000,
    paidAmount: 4800000,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    disbursementMode: 'RTGS/NEFT Direct Transfer',
    transactionReference: 'RBI-NEFT-20260514-009841',
    lastUpdated: '2026-05-14 11:30 IST',
    awardOrderNumber: 'SLAO/NH-275/AWD/2026/044',
    awardDate: '2026-01-30'
  },
  {
    id: 'CMP-2026-0042',
    parcelId: 'PCL-KA-BLR-083',
    surveyNumber: '83/1',
    village: 'Kallugopahalli',
    taluk: 'Bidadi',
    district: 'Bengaluru Rural',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    ownerBeneficiary: 'R. Krishna Murthy',
    khataNumber: 'KT-KLG-045',
    bankAccountMasked: 'SB-****-****-3319',
    ifscCode: 'CNRB0001289',
    assessedAmount: 3600000,
    approvedAmount: 3600000,
    paidAmount: 3600000,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    disbursementMode: 'RTGS/NEFT Direct Transfer',
    transactionReference: 'RBI-NEFT-20260410-004512',
    lastUpdated: '2026-04-10 14:15 IST',
    awardOrderNumber: 'SLAO/NH-275/AWD/2026/045',
    awardDate: '2026-01-30'
  },
  {
    id: 'CMP-2026-0043',
    parcelId: 'PCL-KA-BLR-078',
    surveyNumber: '78/1',
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    ownerBeneficiary: 'M. Siddalingaiah',
    khataNumber: 'KT-AVR-092',
    bankAccountMasked: 'SB-****-****-6672',
    ifscCode: 'BARB0RAMANA',
    assessedAmount: 1850000,
    approvedAmount: 1850000,
    paidAmount: 0,
    pendingAmount: 1850000,
    paymentStatus: 'Processing',
    disbursementMode: 'RTGS/NEFT Direct Transfer',
    lastUpdated: '2026-08-27 15:40 IST',
    awardOrderNumber: 'SLAO/NH-275/AWD/2026/046',
    awardDate: '2026-01-30'
  },
  {
    id: 'CMP-2026-0044',
    parcelId: 'PCL-KA-BLR-077',
    surveyNumber: '77',
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    ownerBeneficiary: 'Basavaraju Gowda & Parvathamma',
    khataNumber: 'KT-AVR-089',
    bankAccountMasked: 'SB-****-****-4410',
    ifscCode: 'SBIN0004521',
    assessedAmount: 2480000,
    approvedAmount: 2480000,
    paidAmount: 0,
    pendingAmount: 2480000,
    paymentStatus: 'Pending Approval',
    disbursementMode: 'RTGS/NEFT Direct Transfer',
    lastUpdated: '2026-08-28 10:15 IST',
    awardOrderNumber: 'SLAO/NH-275/AWD/2026/047',
    awardDate: '2026-01-30'
  },
  {
    id: 'CMP-2026-0045',
    parcelId: 'PCL-KA-BLR-085',
    surveyNumber: '85/2',
    village: 'Sheshagirihalli',
    taluk: 'Bidadi',
    district: 'Bengaluru Rural',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    ownerBeneficiary: 'Chikkanna & K. Kempaiah',
    khataNumber: 'KT-SGH-088',
    bankAccountMasked: 'SB-****-****-1109',
    ifscCode: 'UBIN0532101',
    assessedAmount: 2900000,
    approvedAmount: 2900000,
    paidAmount: 0,
    pendingAmount: 2900000,
    paymentStatus: 'Payment Failed',
    disbursementMode: 'RTGS/NEFT Direct Transfer',
    lastUpdated: '2026-08-28 09:10 IST',
    awardOrderNumber: 'SLAO/NH-275/AWD/2026/048',
    awardDate: '2026-01-30'
  },
  {
    id: 'CMP-2026-0046',
    parcelId: 'PCL-KA-BLR-082',
    surveyNumber: '82',
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    ownerBeneficiary: 'Govindaraju N.',
    khataNumber: 'KT-AVR-131',
    bankAccountMasked: 'SB-****-****-8843',
    ifscCode: 'KVBL0001402',
    assessedAmount: 2650000,
    approvedAmount: 2650000,
    paidAmount: 2650000,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    disbursementMode: 'RTGS/NEFT Direct Transfer',
    transactionReference: 'RBI-NEFT-20260721-008129',
    lastUpdated: '2026-08-26 16:50 IST',
    awardOrderNumber: 'SLAO/NH-275/AWD/2026/049',
    awardDate: '2026-01-30'
  },
  {
    id: 'CMP-2026-0047',
    parcelId: 'PCL-KA-BLR-080',
    surveyNumber: '80',
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    ownerBeneficiary: 'H. Gangadharaiah & Co-sharers',
    khataNumber: 'KT-AVR-118',
    bankAccountMasked: 'SB-****-****-7712',
    ifscCode: 'SBIN0040182',
    assessedAmount: 3100000,
    approvedAmount: 3100000,
    paidAmount: 1550000,
    pendingAmount: 1550000,
    paymentStatus: 'Processing',
    disbursementMode: 'RTGS/NEFT Direct Transfer',
    transactionReference: 'RBI-NEFT-20260810-001244 (Part 1)',
    lastUpdated: '2026-08-28 11:20 IST',
    awardOrderNumber: 'SLAO/NH-275/AWD/2026/050',
    awardDate: '2026-01-30'
  }
];

// Realistic Affected Families and R&R records
export const INITIAL_AFFECTED_FAMILIES: AffectedFamily[] = [
  {
    familyId: 'FAM-KA-2026-0101',
    headOfFamily: 'Basavaraju Gowda',
    gender: 'Male',
    age: 56,
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    surveyNumber: '77',
    projectId: 'proj-001',
    familyMembersCount: 5,
    affectedType: 'Title Holder',
    isDisplaced: false,
    rrRequired: true,
    rrStatus: 'In Progress',
    compensationStatus: 'Pending',
    subsistenceAllowancePaid: true,
    trainingProvided: true,
    lastAssessedDate: '2026-07-15'
  },
  {
    familyId: 'FAM-KA-2026-0102',
    headOfFamily: 'Smt. Muniyamma',
    gender: 'Female',
    age: 62,
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    surveyNumber: '80',
    projectId: 'proj-001',
    familyMembersCount: 4,
    affectedType: 'Title Holder',
    isDisplaced: true,
    rrRequired: true,
    rrStatus: 'In Progress',
    compensationStatus: 'Processing',
    resettlementSiteName: 'Sheshagirihalli R&R Colony Phase-1',
    plotAllotted: 'Plot No. 14 (30x40 ft)',
    subsistenceAllowancePaid: true,
    trainingProvided: false,
    lastAssessedDate: '2026-08-05'
  },
  {
    familyId: 'FAM-KA-2026-0103',
    headOfFamily: 'Chandrashekar H. G.',
    gender: 'Male',
    age: 38,
    village: 'Avverahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    surveyNumber: '80',
    projectId: 'proj-001',
    familyMembersCount: 3,
    affectedType: 'Tenant / Sharecropper',
    isDisplaced: true,
    rrRequired: true,
    rrStatus: 'Completed',
    compensationStatus: 'Paid',
    resettlementSiteName: 'Sheshagirihalli R&R Colony Phase-1',
    plotAllotted: 'Plot No. 15 (30x40 ft)',
    subsistenceAllowancePaid: true,
    trainingProvided: true,
    lastAssessedDate: '2026-06-20'
  },
  {
    familyId: 'FAM-KA-2026-0104',
    headOfFamily: 'Ranganatha Swamy',
    gender: 'Male',
    age: 44,
    village: 'Sheshagirihalli',
    taluk: 'Bidadi',
    district: 'Bengaluru Rural',
    surveyNumber: '85/2',
    projectId: 'proj-001',
    familyMembersCount: 6,
    affectedType: 'Agricultural Labourer',
    isDisplaced: true,
    rrRequired: true,
    rrStatus: 'Pending',
    compensationStatus: 'Pending',
    resettlementSiteName: 'Sheshagirihalli R&R Colony Phase-2',
    plotAllotted: 'Awaiting SLAO Allotment Order',
    subsistenceAllowancePaid: false,
    trainingProvided: false,
    lastAssessedDate: '2026-08-12'
  },
  {
    familyId: 'FAM-KA-2026-0105',
    headOfFamily: 'K. Kempegowda',
    gender: 'Male',
    age: 51,
    village: 'Kallugopahalli',
    taluk: 'Bidadi',
    district: 'Bengaluru Rural',
    surveyNumber: '83/1',
    projectId: 'proj-001',
    familyMembersCount: 4,
    affectedType: 'Title Holder',
    isDisplaced: false,
    rrRequired: false,
    rrStatus: 'Not Required',
    compensationStatus: 'Paid',
    subsistenceAllowancePaid: true,
    trainingProvided: true,
    lastAssessedDate: '2026-04-18'
  },
  {
    familyId: 'FAM-KA-2026-0106',
    headOfFamily: 'Smt. Rathnamma',
    gender: 'Female',
    age: 49,
    village: 'Mayaganahalli',
    taluk: 'Ramanagara',
    district: 'Bengaluru Rural',
    surveyNumber: '112',
    projectId: 'proj-001',
    familyMembersCount: 3,
    affectedType: 'Artisan',
    isDisplaced: true,
    rrRequired: true,
    rrStatus: 'Completed',
    compensationStatus: 'Paid',
    resettlementSiteName: 'Mayaganahalli Handicraft Cluster R&R',
    plotAllotted: 'Work-shed + Living Unit 08',
    subsistenceAllowancePaid: true,
    trainingProvided: true,
    lastAssessedDate: '2026-07-22'
  }
];

// Realistic Documents Repository
export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'DOC-KA-2026-0091',
    documentName: 'Gazette_Notification_Section_3A_NH_Act_275.pdf',
    category: 'Section 3A Notification',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    version: '3.0',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    uploadedBy: 'Shri R. K. Hegde, SLAO',
    uploadedByRole: 'Special Land Acquisition Officer (Ramanagara)',
    uploadedDate: '2025-09-14 16:30 IST',
    status: 'Verified',
    gazetteNumber: 'CG-DL-E-14092025-248102',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    auditTrail: [
      { timestamp: '2025-09-14 16:30', action: 'Uploaded Final Gazette Publication Copy', actor: 'SLAO Ramanagara' },
      { timestamp: '2025-09-15 10:00', action: 'Digitally Counter-signed & Sealed', actor: 'CALA Bengaluru' },
      { timestamp: '2025-09-15 11:30', action: 'Synchronized with Bhoomi Land Records Gateway', actor: 'System Daemon' }
    ]
  },
  {
    id: 'DOC-KA-2026-0092',
    documentName: 'Section_3D_Declaration_Bengaluru_Mysuru.pdf',
    category: 'Section 3D Declaration',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    version: '1.2',
    fileFormat: 'PDF',
    fileSize: '6.2 MB',
    uploadedBy: 'Shri Anand Kumar, CALA',
    uploadedByRole: 'Competent Authority for Land Acquisition',
    uploadedDate: '2025-11-20 12:15 IST',
    status: 'Verified',
    gazetteNumber: 'CG-DL-E-20112025-259104',
    sha256Hash: 'a7c3b28198f121e49afbc4c8996fa12427ae41e4649b934ca495991b78119022',
    auditTrail: [
      { timestamp: '2025-11-20 12:15', action: 'Declaration Uploaded', actor: 'CALA Bengaluru' },
      { timestamp: '2025-11-21 09:00', action: 'Notified to 14 Village Panchayats', actor: 'Tahasildar Ramanagara' }
    ]
  },
  {
    id: 'DOC-KA-2026-0093',
    documentName: 'SIA_Comprehensive_Report_ISEC_Bengaluru.pdf',
    category: 'Social Impact Assessment (SIA)',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    version: '2.0',
    fileFormat: 'PDF',
    fileSize: '18.4 MB',
    uploadedBy: 'Director, ISEC Bengaluru',
    uploadedByRole: 'Independent SIA Agency (State Empanelled)',
    uploadedDate: '2025-05-18 17:00 IST',
    status: 'Verified',
    sha256Hash: '7b91c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a129',
    auditTrail: [
      { timestamp: '2025-05-18 17:00', action: 'Final SIA Report Submitted', actor: 'ISEC Agency' },
      { timestamp: '2025-05-24 14:00', action: 'Public Hearing Minutes Attached', actor: 'R&R Cell' }
    ]
  },
  {
    id: 'DOC-KA-2026-0094',
    documentName: 'Cadastral_Survey_Map_Avverahalli_Sy77_to_Sy90.dwg',
    category: 'Land Records (RTC/Khata)',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    parcelId: 'PCL-KA-BLR-077',
    surveyNumber: '77',
    version: '1.0',
    fileFormat: 'DWG',
    fileSize: '34.2 MB',
    uploadedBy: 'Assistant Director of Land Records (ADLR)',
    uploadedByRole: 'Survey Settlement & Land Records Dept',
    uploadedDate: '2025-04-12 11:20 IST',
    status: 'Verified',
    sha256Hash: '44fc98b198fc1c149afbf4c8996fb92427ae41e4649b934ca495991b78991200',
    auditTrail: [
      { timestamp: '2025-04-12 11:20', action: 'High-precision DGPS Survey Shapefile Ingested', actor: 'ADLR Team' }
    ]
  },
  {
    id: 'DOC-KA-2026-0095',
    documentName: 'Award_Order_No_SLAO_NH275_2026_044_to_050.pdf',
    category: 'Award Orders',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    version: '1.0',
    fileFormat: 'PDF',
    fileSize: '12.6 MB',
    uploadedBy: 'Shri R. K. Hegde, SLAO',
    uploadedByRole: 'Special Land Acquisition Officer',
    uploadedDate: '2026-01-30 18:00 IST',
    status: 'Verified',
    sha256Hash: '99aa044298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b719',
    auditTrail: [
      { timestamp: '2026-01-30 18:00', action: 'Award Order formally signed & published', actor: 'SLAO' }
    ]
  },
  {
    id: 'DOC-KA-2026-0096',
    documentName: 'Possession_Handover_Order_Segment_2.pdf',
    category: 'Possession Orders',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    version: '1.0',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    uploadedBy: 'Tahasildar Ramanagara',
    uploadedByRole: 'Revenue Officer',
    uploadedDate: '2026-05-18 10:45 IST',
    status: 'Verified',
    sha256Hash: 'bb81744298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c002',
    auditTrail: [
      { timestamp: '2026-05-18 10:45', action: 'Physical Mahazar and Handover memo signed', actor: 'Tahasildar' }
    ]
  }
];

// Realistic System Alerts
export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'ALT-KA-2026-0081',
    title: 'Compensation payment overdue for 18 parcels in Avverahalli & Bidadi',
    description: 'Statutory 30-day window following Section 3G Award passed on 2026-01-30 has lapsed. 18 bank transfers delayed due to IFSC/Khata reconciliation mismatches.',
    category: 'Critical',
    alertType: 'Compensation Overdue',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    parcelId: 'PCL-KA-BLR-085',
    surveyNumber: '85/2',
    district: 'Bengaluru Rural',
    createdDate: '2026-08-28 08:30 IST',
    assignedOfficer: 'Shri R. K. Hegde (SLAO Ramanagara)',
    assignedOfficerRole: 'Special Land Acquisition Officer',
    status: 'Open'
  },
  {
    id: 'ALT-KA-2026-0082',
    title: 'Possession delayed for 7 parcels along NH-275 corridor',
    description: 'Physical possession delayed due to pending standing crop harvest compensation assessment and transit accommodation handovers.',
    category: 'Critical',
    alertType: 'Possession Delay',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    parcelId: 'PCL-KA-BLR-080',
    surveyNumber: '80',
    district: 'Bengaluru Rural',
    createdDate: '2026-08-27 14:15 IST',
    assignedOfficer: 'Tahasildar Ramanagara & PIU NHAI',
    assignedOfficerRole: 'Revenue Authority',
    status: 'Open'
  },
  {
    id: 'ALT-KA-2026-0083',
    title: 'Section 3A Gazette Notification approaching statutory 1-year lapsing deadline (3 parcels)',
    description: 'Section 3A notification published on 2025-09-14 will lapse in 16 days if Section 3D declaration is not published in gazette.',
    category: 'Warning',
    alertType: 'Notification Deadline',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    district: 'Bengaluru Rural',
    createdDate: '2026-08-26 10:00 IST',
    assignedOfficer: 'CALA Bengaluru & NHAI Project Director',
    assignedOfficerRole: 'Competent Authority',
    status: 'Under Investigation'
  },
  {
    id: 'ALT-KA-2026-0084',
    title: 'R&R allotment verification pending for 12 affected families',
    description: 'Gram Sabha eligibility verification documents for Sheshagirihalli Phase-2 layout need DC countersignature.',
    category: 'Warning',
    alertType: 'R&R Pending',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    district: 'Bengaluru Rural',
    createdDate: '2026-08-25 11:45 IST',
    assignedOfficer: 'R&R Commissioner, Karnataka',
    assignedOfficerRole: 'State R&R Director',
    status: 'Open'
  },
  {
    id: 'ALT-KA-2026-0085',
    title: 'High-resolution DGPS Cadastral shapefile uploaded for Survey No. 77 to 90',
    description: 'Survey Settlement & Land Records Dept uploaded georeferenced boundary GeoTIFF & DWG files for Avverahalli village.',
    category: 'Information',
    alertType: 'Document Upload',
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    parcelId: 'PCL-KA-BLR-077',
    surveyNumber: '77',
    district: 'Bengaluru Rural',
    createdDate: '2026-08-24 16:20 IST',
    assignedOfficer: 'ADLR Ramanagara',
    assignedOfficerRole: 'Assistant Director Land Records',
    status: 'Resolved',
    resolutionNotes: 'Verified and ingested into central GIS cadastre repository on 2026-08-25.'
  },
  {
    id: 'ALT-KA-2026-0086',
    title: 'Farmer representation received regarding black soil valuation multiplier',
    description: 'Gram Panchayat Nidagundi filed representation requesting 2.0x rural multiplier index instead of 1.5x.',
    category: 'Warning',
    alertType: 'Boundary Dispute',
    projectId: 'proj-003',
    projectName: 'Upper Krishna Irrigation Project Stage-III',
    district: 'Vijayapura',
    createdDate: '2026-08-23 09:30 IST',
    assignedOfficer: 'SLAO Vijayapura',
    assignedOfficerRole: 'Special Collector',
    status: 'Under Investigation'
  }
];

// Explainable Rule-Based Risk Analytics Data
export const INITIAL_RISK_ANALYTICS: ProjectRiskAnalytics[] = [
  {
    projectId: 'proj-001',
    projectName: 'Bengaluru–Mysuru Highway Expansion',
    district: 'Bengaluru Rural',
    riskScore: 74,
    riskLevel: 'High',
    primaryIssue: 'Compensation disbursement pending in Avverahalli & Bidadi clusters; R&R colony litigation',
    expectedDelay: '68 Days Projected Delay',
    lastAssessment: '2026-08-28 14:00 IST',
    factors: [
      {
        name: 'Compensation Disbursement Ratio',
        impactScore: 82,
        weight: '30%',
        status: 'Critical',
        details: '₹25.2 Cr pending disbursement across 18 high-priority parcels along main carriageway alignment.'
      },
      {
        name: 'R&R Resettlement Backlog',
        impactScore: 76,
        weight: '25%',
        status: 'Critical',
        details: '7 out of 28 displaced families awaiting final site handover before demolition notice can execute.'
      },
      {
        name: 'Statutory Notification Lapsing Risk',
        impactScore: 68,
        weight: '20%',
        status: 'Warning',
        details: 'Section 3A notice for 3 bypass loops approaching 1-year validity threshold.'
      },
      {
        name: 'Possession Handover Velocity',
        impactScore: 64,
        weight: '15%',
        status: 'Warning',
        details: 'Possession conversion rate slowed to 4.2 acres/month versus planned 12.0 acres/month.'
      },
      {
        name: 'Pending Administrative Clearances',
        impactScore: 45,
        weight: '10%',
        status: 'Normal',
        details: 'Tree felling and forest diversion clearances received; utility shifting estimates cleared.'
      }
    ],
    trendData: [
      { month: 'Apr 2026', score: 38 },
      { month: 'May 2026', score: 46 },
      { month: 'Jun 2026', score: 55 },
      { month: 'Jul 2026', score: 68 },
      { month: 'Aug 2026', score: 74 }
    ]
  },
  {
    projectId: 'proj-003',
    projectName: 'Upper Krishna Irrigation Project Stage-III',
    district: 'Vijayapura',
    riskScore: 65,
    riskLevel: 'High',
    primaryIssue: 'Farmer demand for revised market rate multiplier from 1.5x to 2.0x in fertile black soil tracts',
    expectedDelay: '45 Days Projected Delay',
    lastAssessment: '2026-08-26 11:00 IST',
    factors: [
      {
        name: 'Valuation & Multiplier Consensus',
        impactScore: 80,
        weight: '35%',
        status: 'Critical',
        details: 'Representation from 4 Gram Panchayats submitted to High-Power Valuation Committee.'
      },
      {
        name: 'Award Declaration Velocity',
        impactScore: 60,
        weight: '25%',
        status: 'Warning',
        details: '14 awards pending final scrutiny at DC office.'
      },
      {
        name: 'Budgetary Liquidity Release',
        impactScore: 40,
        weight: '20%',
        status: 'Normal',
        details: 'Treasury green-channel fund allocation secured.'
      },
      {
        name: 'R&R Public Hearing Compliance',
        impactScore: 50,
        weight: '20%',
        status: 'Normal',
        details: 'SIA hearings completed with 82% quorum recorded.'
      }
    ],
    trendData: [
      { month: 'Apr 2026', score: 40 },
      { month: 'May 2026', score: 48 },
      { month: 'Jun 2026', score: 52 },
      { month: 'Jul 2026', score: 61 },
      { month: 'Aug 2026', score: 65 }
    ]
  },
  {
    projectId: 'proj-006',
    projectName: 'Ballari Solar Park High-Voltage Power Evacuation Corridor',
    district: 'Ballari',
    riskScore: 58,
    riskLevel: 'Medium',
    primaryIssue: 'Right of Way (RoW) compensation disputes for 400kV transmission tower footings',
    expectedDelay: '35 Days Projected Delay',
    lastAssessment: '2026-08-24 15:00 IST',
    factors: [
      {
        name: 'Right of Way (RoW) Notice Issuance',
        impactScore: 65,
        weight: '30%',
        status: 'Warning',
        details: '6 out of 16 villages notified under Indian Telegraph Act / Electricity Act provisions.'
      },
      {
        name: 'Tower Footing Pegging Verification',
        impactScore: 55,
        weight: '25%',
        status: 'Warning',
        details: 'Agricultural standing crop compensation assessment underway.'
      },
      {
        name: 'Budgetary Sanctions',
        impactScore: 30,
        weight: '25%',
        status: 'Normal',
        details: 'KPTCL capital budget approved.'
      },
      {
        name: 'Litigation Exposure',
        impactScore: 45,
        weight: '20%',
        status: 'Normal',
        details: 'No High Court stay orders active.'
      }
    ],
    trendData: [
      { month: 'Apr 2026', score: 32 },
      { month: 'May 2026', score: 41 },
      { month: 'Jun 2026', score: 49 },
      { month: 'Jul 2026', score: 54 },
      { month: 'Aug 2026', score: 58 }
    ]
  },
  {
    projectId: 'proj-002',
    projectName: 'Bengaluru Suburban Rail Corridor 2',
    district: 'Bengaluru Urban',
    riskScore: 42,
    riskLevel: 'Medium',
    primaryIssue: 'Defence land transfer NOC pending from Ministry of Defence (12 acres in Jalahalli)',
    expectedDelay: '24 Days Projected Delay',
    lastAssessment: '2026-08-27 16:30 IST',
    factors: [
      {
        name: 'Inter-Ministerial Land Transfer (Defence)',
        impactScore: 68,
        weight: '35%',
        status: 'Warning',
        details: 'Inter-ministerial group meeting scheduled for next week to finalize equal-value exchange land.'
      },
      {
        name: 'Possession Clearance in Urban Sections',
        impactScore: 42,
        weight: '25%',
        status: 'Normal',
        details: 'BBMP cleared 14.5 km of parallel railway right-of-way.'
      },
      {
        name: 'Compensation Liquidity',
        impactScore: 20,
        weight: '25%',
        status: 'Normal',
        details: '100% of awarded private compensation deposited in escrow.'
      },
      {
        name: 'R&R Relocation',
        impactScore: 35,
        weight: '15%',
        status: 'Normal',
        details: 'Slum clearance transit apartments occupied.'
      }
    ],
    trendData: [
      { month: 'Apr 2026', score: 62 },
      { month: 'May 2026', score: 55 },
      { month: 'Jun 2026', score: 48 },
      { month: 'Jul 2026', score: 45 },
      { month: 'Aug 2026', score: 42 }
    ]
  },
  {
    id: 'proj-004',
    projectId: 'proj-004',
    projectName: 'Tumakuru Industrial Township & Node',
    district: 'Tumakuru',
    riskScore: 28,
    riskLevel: 'Low',
    primaryIssue: 'Minor boundary demarcation verification in Phase 3 utility corridor',
    expectedDelay: '10 Days Projected Delay',
    lastAssessment: '2026-08-25 09:00 IST',
    factors: [
      {
        name: 'Land Handover & Fencing',
        impactScore: 25,
        weight: '30%',
        status: 'Normal',
        details: '540 acres out of 620 acres already secured with peripheral boundary wall.'
      },
      {
        name: 'Compensation Payout',
        impactScore: 15,
        weight: '30%',
        status: 'Normal',
        details: '₹304 Cr disbursed with 98% beneficiary satisfaction index.'
      },
      {
        name: 'R&R Center',
        impactScore: 30,
        weight: '20%',
        status: 'Normal',
        details: 'Industrial training institute (ITI) admissions underway.'
      },
      {
        name: 'Clearances',
        impactScore: 20,
        weight: '20%',
        status: 'Normal',
        details: 'All statutory environmental and water NOCs in place.'
      }
    ],
    trendData: [
      { month: 'Apr 2026', score: 45 },
      { month: 'May 2026', score: 39 },
      { month: 'Jun 2026', score: 34 },
      { month: 'Jul 2026', score: 30 },
      { month: 'Aug 2026', score: 28 }
    ]
  },
  {
    id: 'proj-005',
    projectId: 'proj-005',
    projectName: 'Hassan–Mangaluru Ghat Rail Section Doubling',
    district: 'Hassan',
    riskScore: 12,
    riskLevel: 'Low',
    primaryIssue: 'Project fully acquired and handed over to engineering wing',
    expectedDelay: '0 Days (On Schedule)',
    lastAssessment: '2026-08-20 09:30 IST',
    factors: [
      {
        name: 'Lifecycle Status',
        impactScore: 10,
        weight: '50%',
        status: 'Normal',
        details: '100% land possession handed over and mutated in Bhoomi revenue portal.'
      },
      {
        name: 'Dispute Resolution',
        impactScore: 14,
        weight: '50%',
        status: 'Normal',
        details: 'All civil court references settled with zero outstanding appeals.'
      }
    ],
    trendData: [
      { month: 'Apr 2026', score: 25 },
      { month: 'May 2026', score: 20 },
      { month: 'Jun 2026', score: 18 },
      { month: 'Jul 2026', score: 14 },
      { month: 'Aug 2026', score: 12 }
    ]
  }
];

// Administration & RBAC Data
export const INITIAL_ADMIN_ROLES: AdminRoleConfig[] = [
  {
    id: 'role-001',
    roleTitle: 'Central Ministry',
    jurisdictionLevel: 'National',
    description: 'Union Ministries (MoRTH, MoR, MoWR, MoPNG) national oversight, policy formulation, capital allocation, and macro KPI monitoring.',
    activeUsersCount: 42,
    permissions: {
      viewProjects: true,
      manageProjects: false,
      viewLandParcels: true,
      updateAcquisitionStatus: false,
      manageCompensation: false,
      manageRR: false,
      uploadDocuments: false,
      viewAnalytics: true,
      systemConfiguration: false
    },
    lastActivity: '2026-08-29 15:10 IST'
  },
  {
    id: 'role-002',
    roleTitle: 'State Government',
    jurisdictionLevel: 'State',
    description: 'State Revenue Department, Principal Secretaries, State R&R Commissioners, and High-Power Project Steering Committees.',
    activeUsersCount: 118,
    permissions: {
      viewProjects: true,
      manageProjects: true,
      viewLandParcels: true,
      updateAcquisitionStatus: true,
      manageCompensation: true,
      manageRR: true,
      uploadDocuments: true,
      viewAnalytics: true,
      systemConfiguration: true
    },
    lastActivity: '2026-08-29 16:02 IST'
  },
  {
    id: 'role-003',
    roleTitle: 'District Administration',
    jurisdictionLevel: 'District',
    description: 'Deputy Commissioners (DC), District Magistrates (DM), Tahasildars, and Revenue Inspectors executing field possession and dispute mahazars.',
    activeUsersCount: 384,
    permissions: {
      viewProjects: true,
      manageProjects: true,
      viewLandParcels: true,
      updateAcquisitionStatus: true,
      manageCompensation: true,
      manageRR: true,
      uploadDocuments: true,
      viewAnalytics: true,
      systemConfiguration: false
    },
    lastActivity: '2026-08-29 15:58 IST'
  },
  {
    id: 'role-004',
    roleTitle: 'Land Acquisition Authority',
    jurisdictionLevel: 'Taluk',
    description: 'Special Land Acquisition Officers (SLAO), Competent Authorities (CALA), and ADLR surveyors responsible for cadastre, 3A-3G awards & DBT payout.',
    activeUsersCount: 265,
    permissions: {
      viewProjects: true,
      manageProjects: true,
      viewLandParcels: true,
      updateAcquisitionStatus: true,
      manageCompensation: true,
      manageRR: true,
      uploadDocuments: true,
      viewAnalytics: true,
      systemConfiguration: false
    },
    lastActivity: '2026-08-29 16:05 IST'
  },
  {
    id: 'role-005',
    roleTitle: 'Project Implementing Agency',
    jurisdictionLevel: 'Project Zone',
    description: 'Project Directors & Chief Engineers from NHAI, K-RIDE, KBJNL, KIADB, and Railways tracking possession chainage and utility clearance.',
    activeUsersCount: 210,
    permissions: {
      viewProjects: true,
      manageProjects: false,
      viewLandParcels: true,
      updateAcquisitionStatus: false,
      manageCompensation: false,
      manageRR: false,
      uploadDocuments: true,
      viewAnalytics: true,
      systemConfiguration: false
    },
    lastActivity: '2026-08-29 14:45 IST'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'USR-KA-001',
    fullName: 'Shri R. K. Hegde, KAS',
    email: 'slao.ramanagara@karnataka.gov.in',
    designation: 'Special Land Acquisition Officer (SLAO)',
    role: 'Land Acquisition Authority',
    jurisdiction: 'Bengaluru Rural & Ramanagara',
    department: 'Revenue & Land Records Dept',
    status: 'Active',
    lastLogin: '2026-08-29 15:45 IST',
    badgeId: 'KAS-2014-0891'
  },
  {
    id: 'USR-KA-002',
    fullName: 'Dr. N. Manjunatha Prasad, IAS',
    email: 'dc.bengalururural@karnataka.gov.in',
    designation: 'Deputy Commissioner & District Magistrate',
    role: 'District Administration',
    jurisdiction: 'District: Bengaluru Rural',
    department: 'Department of Revenue',
    status: 'Active',
    lastLogin: '2026-08-29 14:10 IST',
    badgeId: 'IAS-2002-0144'
  },
  {
    id: 'USR-KA-003',
    fullName: 'Shri Anand Kumar, IRSE',
    email: 'pd.bengaluru@nhai.org',
    designation: 'Project Director (PIU Bengaluru)',
    role: 'Project Implementing Agency',
    jurisdiction: 'NHAI Project Corridor NH-275',
    department: 'National Highways Authority of India',
    status: 'Active',
    lastLogin: '2026-08-29 13:20 IST',
    badgeId: 'NHAI-PD-052'
  },
  {
    id: 'USR-KA-004',
    fullName: 'Smt. Vandita Sharma, IAS',
    email: 'prlsec.revenue@karnataka.gov.in',
    designation: 'Principal Secretary (Revenue & Disaster Mgmt)',
    role: 'State Government',
    jurisdiction: 'State: Karnataka',
    department: 'Government of Karnataka',
    status: 'Active',
    lastLogin: '2026-08-29 11:05 IST',
    badgeId: 'IAS-1996-0031'
  },
  {
    id: 'USR-KA-005',
    fullName: 'Shri Rajesh Gupta, Joint Secretary',
    email: 'js.land@morth.nic.in',
    designation: 'Joint Secretary (Land Acquisition & Highways)',
    role: 'Central Ministry',
    jurisdiction: 'National (MORTH/NHAI)',
    department: 'Ministry of Road Transport & Highways',
    status: 'Active',
    lastLogin: '2026-08-29 10:15 IST',
    badgeId: 'MORTH-JS-018'
  }
];
