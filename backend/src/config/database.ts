import { MongoClient, Db, Collection, ServerApiVersion, Document } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const DB_NAME = process.env.DB_NAME || 'lams_db';
const PARCELS_COLLECTION = 'parcels';
const PROJECTS_COLLECTION = 'projects';

/**
 * Establishes and caches the MongoDB Atlas connection.
 * Reuses the existing client instance if already connected.
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) {
    return { client, db };
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    throw new Error(
      'CRITICAL: MONGODB_URI environment variable is missing. Please configure MONGODB_URI in your environment or backend/.env file.'
    );
  }

  try {
    const mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    await mongoClient.connect();

    // Verify connectivity by running a ping command
    const targetDb = mongoClient.db(DB_NAME);
    await targetDb.command({ ping: 1 });

    client = mongoClient;
    db = targetDb;

    console.log(`[Database] Successfully connected to MongoDB Atlas database: "${DB_NAME}"`);

    return { client, db };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Database] Failed to connect to MongoDB Atlas: ${errorMessage}`);
    throw error;
  }
}

/**
 * Returns the active MongoDB database instance.
 * Throws an error if connectToDatabase() has not been called.
 */
export function getDb(): Db {
  if (!db) {
    throw new Error('Database is not initialized. Call connectToDatabase() first.');
  }
  return db;
}

/**
 * Returns the typed parcels collection from the active database.
 */
export function getParcelsCollection<T extends Document = Document>(): Collection<T> {
  return getDb().collection<T>(PARCELS_COLLECTION);
}

/**
 * Returns the typed projects collection from the active database.
 */
export function getProjectsCollection<T extends Document = Document>(): Collection<T> {
  return getDb().collection<T>(PROJECTS_COLLECTION);
}

/**
 * Pings the database to verify active connection health.
 */
export async function pingDatabase(): Promise<{ connected: boolean; dbName: string; totalParcels: number }> {
  try {
    const activeDb = getDb();
    await activeDb.command({ ping: 1 });
    const count = await activeDb.collection(PARCELS_COLLECTION).countDocuments();
    return {
      connected: true,
      dbName: DB_NAME,
      totalParcels: count,
    };
  } catch {
    return {
      connected: false,
      dbName: DB_NAME,
      totalParcels: 0,
    };
  }
}

/**
 * Gracefully closes the MongoDB client connection.
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('[Database] MongoDB connection closed.');
  }
}
