import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { closeDatabaseConnection, connectToDatabase, getUsersCollection } from './config/database.js';
import type { UserDocument } from './models/user.js';
import type { Role } from './rbac/permissions.js';

const SAMPLE_USERS: Array<{ user_id: string; name: string; email: string; role: Role; password: string }> = [
  { user_id: 'LAMS-USER-001', name: 'System User', email: 'user.user@lams.demo', role: 'user', password: 'User@12345' },
  { user_id: 'LAMS-AGENCY-001', name: 'Project Agency', email: 'project.agen@lams.demo', role: 'project_agency', password: 'Agen@12345' },
  { user_id: 'LAMS-LA-001', name: 'Land Acquisition Officer', email: 'officer.land@lams.demo', role: 'land_acquisition', password: 'Land@12345' },
  { user_id: 'LAMS-FIN-001', name: 'Finance Officer', email: 'officer.fin@lams.demo', role: 'finance_officer', password: 'Fin@12345' },
  { user_id: 'LAMS-DISTRICT-001', name: 'District Officer', email: 'officer.district@lams.demo', role: 'district_officer', password: 'District@12345' },
  { user_id: 'LAMS-MASTER-001', name: 'Master Administrator', email: 'master.master@lams.demo', role: 'master', password: 'Master@12345' },
];

async function seedUsers(): Promise<void> {
  await connectToDatabase();
  const users = getUsersCollection<UserDocument>();
  await users.createIndex(
    { email: 1 },
    { unique: true, name: 'users_email_unique', partialFilterExpression: { email: { $type: 'string' } } }
  );
  await users.createIndex(
    { user_id: 1 },
    { unique: true, name: 'users_user_id_unique', partialFilterExpression: { user_id: { $type: 'string' } } }
  );

  for (const sample of SAMPLE_USERS) {
    const now = new Date();
    const password_hash = await bcrypt.hash(sample.password, 12);
    await users.updateOne(
      { email: sample.email },
      {
        $set: {
          user_id: sample.user_id,
          name: sample.name,
          email: sample.email,
          password_hash,
          role: sample.role,
          is_active: true,
          updated_at: now,
        },
        $setOnInsert: { created_at: now },
      },
      { upsert: true }
    );
    console.log(`[Seed] Upserted ${sample.email} (${sample.role})`);
  }
}

seedUsers()
  .then(() => console.log('[Seed] Six LAMS users are ready in lams_db.users.'))
  .catch((error) => {
    console.error('[Seed] Failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(closeDatabaseConnection);
