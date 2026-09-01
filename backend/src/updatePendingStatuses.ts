import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '172.16.1.1']);
import { MongoClient } from 'mongodb';

async function updateDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('lams_db');
  const collection = db.collection('Project_Approved_Project');

  // Set 3 projects to PENDING_REVIEW
  await collection.updateOne(
    { projectCode: 'NHAI-KA-2026-088' },
    { $set: { districtStatus: 'PENDING_REVIEW', 'districtVerification.status': 'PENDING_REVIEW' } }
  );

  await collection.updateOne(
    { projectCode: 'K-RIDE-2026-042' },
    { 
      $set: { 
        districtStatus: 'PENDING_REVIEW', 
        'districtVerification.status': 'PENDING_REVIEW',
        officerRemarks: 'State High Powered Committee approved budgetary allocation and SIA report. Ready for district joint cadastral survey.'
      },
      $unset: { districtRejectionReason: '', districtReviewedAt: '', districtReviewedBy: '' }
    }
  );

  await collection.updateOne(
    { projectCode: 'KIADB-KA-2026-103' },
    { 
      $set: { 
        districtStatus: 'PENDING_REVIEW', 
        'districtVerification.status': 'PENDING_REVIEW',
        officerRemarks: 'Comprehensive SIA baseline and environmental clearance obtained. Forwarded for district land acquisition and rehabilitation award.'
      },
      $unset: { districtVerifiedAt: '', districtVerifiedBy: '' }
    }
  );

  const docs = await collection.find({ district: { $regex: /bengaluru/i } }).toArray();
  console.log('Bengaluru documents in MongoDB now:');
  for (const d of docs) {
    console.log('- ' + d.projectName + ' (' + d.projectCode + ') => Status: ' + (d.districtStatus || d.districtVerification?.status || 'PENDING_REVIEW'));
  }

  await client.close();
}

updateDb().catch(console.error);
