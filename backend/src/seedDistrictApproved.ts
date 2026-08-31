import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '172.16.1.1']);
import { MongoClient } from 'mongodb';

async function seedBengaluruProjects() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('lams_db');
  const collection = db.collection('Project_Approved_Project');

  const existingBengaluru = await collection.find({ district: { $regex: /bengaluru/i } }).toArray();
  console.log('Existing Bengaluru approved projects:', existingBengaluru.length);

  if (existingBengaluru.length === 0) {
    const sampleProjects = [
      {
        projectName: 'Bengaluru–Mysuru Expressway Satellite Link',
        projectCode: 'NHAI-KA-2026-088',
        projectType: 'Highway Infrastructure',
        agencyName: 'National Highways Authority of India (NHAI)',
        agencyType: 'Central Highway Authority',
        department: 'Public Works Department',
        implementingAgency: 'NHAI Regional Office Bengaluru',
        parentAuthority: 'Govt of India & Govt of Karnataka PWD',
        district: 'Bengaluru Rural',
        taluks: ['Ramanagara', 'Bidadi'],
        landRequiredAcres: 45.0,
        landAcquiredAcres: 0,
        selectedLandAcres: 45.0,
        selectedParcelCount: 18,
        selectedParcelIds: ['KA-BLR-BID-012', 'KA-BLR-BID-013', 'KA-BLR-BID-014'],
        estimatedCompensationCr: 58.5,
        totalCompensationAssessedCr: 58.5,
        totalCompensationPaidCr: 0,
        financialStatus: 'Approved',
        approvalStatus: 'APPROVED',
        approvedBy: 'Shri V. S. Murthy, Joint Secretary (SIA)',
        approvedAt: '2026-08-31T14:30:00.000Z',
        forwardedAt: '2026-08-31T15:00:00.000Z',
        forwardedTo: 'DISTRICT_OFFICER',
        officerRemarks: 'Statutory Section 3D notification completed. Forwarded to District Officer for land possession and award verification.',
        scope: '4-lane greenfield access-controlled connector link from Bidadi to expressway interchange',
        description: 'Critical corridor for de-congesting traffic and establishing industrial bypass freight access.',
        state: 'Karnataka',
        districtVerification: {
          status: 'PENDING'
        },
        createdAt: new Date('2026-08-31T14:30:00.000Z'),
        updatedAt: new Date('2026-08-31T15:00:00.000Z')
      },
      {
        projectName: 'Bengaluru Suburban Rail Corridor 2 (Baiyappanahalli–Chikkabanavara)',
        projectCode: 'K-RIDE-2026-042',
        projectType: 'Suburban Mass Rapid Transit',
        agencyName: 'Rail Infrastructure Development Company (Karnataka) Ltd (K-RIDE)',
        agencyType: 'State-Central Joint Venture',
        department: 'Infrastructure Development Department',
        implementingAgency: 'K-RIDE Engineering Directorate',
        parentAuthority: 'Govt of Karnataka & Ministry of Railways',
        district: 'Bengaluru Urban',
        taluks: ['Bengaluru North', 'Yelahanka'],
        landRequiredAcres: 32.5,
        landAcquiredAcres: 0,
        selectedLandAcres: 32.5,
        selectedParcelCount: 14,
        selectedParcelIds: ['KA-BLR-YEL-089', 'KA-BLR-YEL-090'],
        estimatedCompensationCr: 84.0,
        totalCompensationAssessedCr: 84.0,
        totalCompensationPaidCr: 0,
        financialStatus: 'Approved',
        approvalStatus: 'APPROVED',
        approvedBy: 'Smt. Ananya Sen, IAS, Special Secretary',
        approvedAt: '2026-08-31T16:15:00.000Z',
        forwardedAt: '2026-08-31T16:30:00.000Z',
        forwardedTo: 'DISTRICT_OFFICER',
        officerRemarks: 'State High Powered Committee approved budgetary allocation and SIA report. Ready for district joint cadastral survey.',
        scope: 'Double line rail corridor with 14 elevated/at-grade suburban stations',
        description: 'Public rail transit reducing carbon emissions and daily commuter travel time across northern Bengaluru corridor.',
        state: 'Karnataka',
        districtVerification: {
          status: 'PENDING'
        },
        createdAt: new Date('2026-08-31T16:15:00.000Z'),
        updatedAt: new Date('2026-08-31T16:30:00.000Z')
      },
      {
        projectName: 'Devanahalli Aerotropolis Multimodal Logistics Park',
        projectCode: 'KIADB-KA-2026-103',
        projectType: 'Industrial & Freight Logistics',
        agencyName: 'Karnataka Industrial Areas Development Board (KIADB)',
        agencyType: 'State Industrial Development Statutory Body',
        department: 'Commerce and Industries Department',
        implementingAgency: 'KIADB Special Projects Wing',
        parentAuthority: 'Commerce and Industries Department, Govt of Karnataka',
        district: 'Bengaluru Rural',
        taluks: ['Devanahalli'],
        landRequiredAcres: 78.0,
        landAcquiredAcres: 0,
        selectedLandAcres: 78.0,
        selectedParcelCount: 22,
        selectedParcelIds: ['KA-BLR-DEV-201', 'KA-BLR-DEV-202', 'KA-BLR-DEV-203'],
        estimatedCompensationCr: 120.0,
        totalCompensationAssessedCr: 120.0,
        totalCompensationPaidCr: 0,
        financialStatus: 'Approved',
        approvalStatus: 'APPROVED',
        approvedBy: 'Shri T. N. Ravikumar, KAS (Chief Executive Officer KIADB)',
        approvedAt: '2026-08-31T17:00:00.000Z',
        forwardedAt: '2026-08-31T17:20:00.000Z',
        forwardedTo: 'DISTRICT_OFFICER',
        officerRemarks: 'Comprehensive SIA baseline and environmental clearance obtained. Forwarded for district land acquisition and rehabilitation award.',
        scope: 'Multi-modal air-cargo logistics and automated warehousing hub adjacent to Kempegowda International Airport',
        description: 'Strategic logistics corridor supporting electronics, aerospace manufacturing, and agricultural cargo exports.',
        state: 'Karnataka',
        districtVerification: {
          status: 'PENDING'
        },
        createdAt: new Date('2026-08-31T17:00:00.000Z'),
        updatedAt: new Date('2026-08-31T17:20:00.000Z')
      }
    ];

    const result = await collection.insertMany(sampleProjects);
    console.log('Inserted Bengaluru approved projects count:', result.insertedCount);
  }

  const allProjects = await collection.find().toArray();
  console.log('All documents in Project_Approved_Project now:');
  for (const p of allProjects) {
    console.log('- ' + p.projectName + ' (' + p.projectCode + ') - District: ' + p.district + ' - Status: ' + (p.districtVerification?.status || 'PENDING'));
  }

  await client.close();
}

seedBengaluruProjects().catch(console.error);
