import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '172.16.1.1']);
import { MongoClient } from 'mongodb';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('lams_db');
  const collection = db.collection('Project_Approved_Project');

  // Clear existing Bengaluru projects to reset to clean state
  await collection.deleteMany({ district: { $regex: /bengaluru/i } });

  const bengaluruProjects = [
    {
      projectName: 'Bengaluru–Mysuru Expressway Satellite Link',
      projectCode: 'NHAI-KA-2026-088',
      projectType: 'Highway Infrastructure',
      district: 'Bengaluru Rural',
      implementingAgency: 'NHAI Regional Office Bengaluru',
      agencyName: 'National Highways Authority of India (NHAI)',
      agencyType: 'Central Highway Authority',
      parentAuthority: 'Govt of India & Govt of Karnataka PWD',
      department: 'Public Works Department',
      description: '4-lane greenfield access-controlled connector link from Bidadi to expressway interchange for industrial freight access.',
      landRequiredAcres: 45.0,
      landAcquiredAcres: 0,
      estimatedCompensationCr: 58.5,
      approvalStatus: 'APPROVED',
      approvedAt: '2026-08-31T14:30:00.000Z',
      approvedBy: 'Shri V. S. Murthy, Joint Secretary (SIA)',
      forwardedAt: '2026-08-31T15:00:00.000Z',
      forwardedTo: 'DISTRICT_OFFICER',
      financialStatus: 'Approved',
      officerRemarks: 'Statutory Section 3D notification completed. Forwarded to District Officer for land possession and award verification.',
      districtStatus: 'PENDING_REVIEW',
      districtVerification: {
        status: 'PENDING_REVIEW'
      },
      taluks: ['Ramanagara', 'Bidadi'],
      selectedParcelCount: 18,
      createdAt: new Date('2026-08-31T14:30:00.000Z'),
      updatedAt: new Date('2026-08-31T15:00:00.000Z')
    },
    {
      projectName: 'Bengaluru Suburban Rail Corridor 2 (Baiyappanahalli–Chikkabanavara)',
      projectCode: 'K-RIDE-2026-042',
      projectType: 'Suburban Mass Rapid Transit',
      district: 'Bengaluru Urban',
      implementingAgency: 'K-RIDE Engineering Directorate',
      agencyName: 'Rail Infrastructure Development Company (Karnataka) Ltd',
      agencyType: 'State-Central Joint Venture',
      parentAuthority: 'Govt of Karnataka & Ministry of Railways',
      department: 'Infrastructure Development Department',
      description: 'Double line rail corridor with 14 elevated/at-grade suburban stations to reduce carbon emissions and daily commuter travel time.',
      landRequiredAcres: 32.5,
      landAcquiredAcres: 0,
      estimatedCompensationCr: 84.0,
      approvalStatus: 'APPROVED',
      approvedAt: '2026-08-31T16:15:00.000Z',
      approvedBy: 'Smt. Ananya Sen, IAS, Special Secretary',
      forwardedAt: '2026-08-31T16:30:00.000Z',
      forwardedTo: 'DISTRICT_OFFICER',
      financialStatus: 'Approved',
      officerRemarks: 'State High Powered Committee approved budgetary allocation and SIA report. Ready for district joint cadastral survey.',
      districtStatus: 'PENDING_REVIEW',
      districtVerification: {
        status: 'PENDING_REVIEW'
      },
      taluks: ['Bengaluru North', 'Yelahanka'],
      selectedParcelCount: 14,
      createdAt: new Date('2026-08-31T16:15:00.000Z'),
      updatedAt: new Date('2026-08-31T16:30:00.000Z')
    },
    {
      projectName: 'Devanahalli Aerotropolis Multimodal Logistics Park',
      projectCode: 'KIADB-KA-2026-103',
      projectType: 'Industrial & Freight Logistics',
      district: 'Bengaluru Rural',
      implementingAgency: 'KIADB Special Projects Wing',
      agencyName: 'Karnataka Industrial Areas Development Board (KIADB)',
      agencyType: 'State Industrial Development Statutory Body',
      parentAuthority: 'Commerce and Industries Department, Govt of Karnataka',
      department: 'Commerce and Industries Department',
      description: 'Multi-modal air-cargo logistics and automated warehousing hub adjacent to Kempegowda International Airport.',
      landRequiredAcres: 78.0,
      landAcquiredAcres: 0,
      estimatedCompensationCr: 120.0,
      approvalStatus: 'APPROVED',
      approvedAt: '2026-08-31T17:00:00.000Z',
      approvedBy: 'Shri T. N. Ravikumar, KAS (CEO KIADB)',
      forwardedAt: '2026-08-31T17:20:00.000Z',
      forwardedTo: 'DISTRICT_OFFICER',
      financialStatus: 'Approved',
      officerRemarks: 'Comprehensive SIA baseline and environmental clearance obtained. Forwarded for district land acquisition and rehabilitation award.',
      districtStatus: 'PENDING_REVIEW',
      districtVerification: {
        status: 'PENDING_REVIEW'
      },
      taluks: ['Devanahalli'],
      selectedParcelCount: 22,
      createdAt: new Date('2026-08-31T17:00:00.000Z'),
      updatedAt: new Date('2026-08-31T17:20:00.000Z')
    },
    {
      projectName: 'Kengeri-Bidadi Metro Line Western Extension',
      projectCode: 'BMRCL-KA-2026-055',
      projectType: 'Urban Metro Rail Transit',
      district: 'Bengaluru Rural',
      implementingAgency: 'Bangalore Metro Rail Corporation Ltd (BMRCL)',
      agencyName: 'Bangalore Metro Rail Corporation Ltd',
      agencyType: 'Special Purpose Vehicle (SPV)',
      parentAuthority: 'Ministry of Housing and Urban Affairs & Govt of Karnataka',
      department: 'Urban Development Department',
      description: 'Purple Line extension westward towards Bidadi industrial cluster with 6 elevated metro stations and depot facility.',
      landRequiredAcres: 28.0,
      landAcquiredAcres: 28.0,
      estimatedCompensationCr: 65.0,
      approvalStatus: 'APPROVED',
      approvedAt: '2026-08-30T10:00:00.000Z',
      approvedBy: 'Managing Director BMRCL',
      forwardedAt: '2026-08-30T11:00:00.000Z',
      forwardedTo: 'DISTRICT_OFFICER',
      financialStatus: 'Approved',
      officerRemarks: 'Statutory Section 4(1) preliminary survey verified. Forwarded for district officer verification.',
      districtStatus: 'VERIFIED',
      districtVerifiedAt: '2026-08-31T18:00:00.000Z',
      districtVerifiedBy: 'Shri R. K. Hegde, KAS (District Officer)',
      districtVerification: {
        status: 'VERIFIED',
        verifiedAt: '2026-08-31T18:00:00.000Z',
        verifiedBy: 'Shri R. K. Hegde, KAS (District Officer)',
        remarks: 'Cadastral parcels verified with Bhoomi RTC records. Approved for award determination.'
      },
      taluks: ['Bidadi', 'Kengeri'],
      selectedParcelCount: 16,
      createdAt: new Date('2026-08-30T10:00:00.000Z'),
      updatedAt: new Date('2026-08-31T18:00:00.000Z')
    },
    {
      projectName: 'Hosakote Industrial Freight Corridor',
      projectCode: 'KRDCL-KA-2026-071',
      projectType: 'Industrial Freight Corridor',
      district: 'Bengaluru Rural',
      implementingAgency: 'Karnataka Road Development Corporation Ltd (KRDCL)',
      agencyName: 'Karnataka Road Development Corporation Ltd',
      agencyType: 'State Road Authority',
      parentAuthority: 'Public Works Department, Govt of Karnataka',
      department: 'Public Works Department',
      description: 'Dedicated freight corridor connecting Hosakote industrial area to STRR peripheral highway.',
      landRequiredAcres: 36.0,
      landAcquiredAcres: 0,
      estimatedCompensationCr: 42.0,
      approvalStatus: 'APPROVED',
      approvedAt: '2026-08-29T09:00:00.000Z',
      approvedBy: 'Chief Engineer KRDCL',
      forwardedAt: '2026-08-29T10:00:00.000Z',
      forwardedTo: 'DISTRICT_OFFICER',
      financialStatus: 'Approved',
      officerRemarks: 'Forwarded for district land acquisition review.',
      districtStatus: 'REJECTED',
      districtRejectionReason: 'Discrepancy in survey numbers: Survey No. 42/1 and 42/3 overlap with pending writ petition in High Court. Returned for re-alignment.',
      districtReviewedAt: '2026-08-31T17:30:00.000Z',
      districtReviewedBy: 'Shri R. K. Hegde, KAS (District Officer)',
      districtVerification: {
        status: 'REJECTED',
        rejectedAt: '2026-08-31T17:30:00.000Z',
        rejectedBy: 'Shri R. K. Hegde, KAS (District Officer)',
        reason: 'Discrepancy in survey numbers: Survey No. 42/1 and 42/3 overlap with pending writ petition in High Court. Returned for re-alignment.'
      },
      taluks: ['Hosakote'],
      selectedParcelCount: 12,
      createdAt: new Date('2026-08-29T09:00:00.000Z'),
      updatedAt: new Date('2026-08-31T17:30:00.000Z')
    }
  ];

  await collection.insertMany(bengaluruProjects);
  console.log('Successfully seeded clean Bengaluru projects with full status coverage.');

  const total = await collection.countDocuments();
  console.log('Total documents in Project_Approved_Project now:', total);

  await client.close();
}
seed().catch(console.error);
