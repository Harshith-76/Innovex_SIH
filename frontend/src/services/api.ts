export interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface ParcelProperties {
  parcel_id?: string;
  survey_no?: string;
  cadastral_id?: string;
  ulpin?: string;
  district?: string;
  district_code?: string;
  taluk?: string;
  taluk_code?: string;
  hobli?: string;
  hobli_code?: string;
  village?: string;
  village_code?: string;
  bhoomi_village_code?: string;
  state?: string;
  area?: number;
  area_unit?: string;
  category?: string;
  [key: string]: any;
}

export interface GeoJSONFeature {
  type: 'Feature';
  id?: string;
  properties: ParcelProperties;
  geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  totalFeatures?: number;
}

export interface ParcelQueryParams {
  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  survey_no?: string;
  category?: string;
  limit?: string | number;
}

export interface CreateProjectRequest {
  code: string;
  name: string;
  projectType?: string;
  parentAuthority?: string;
  agencyName?: string;
  agencyType?: string;
  state: string;
  district: string;
  landRequiredAcres: number;
  estimatedCompensationCr?: number;
  scope?: string;
  description?: string;
  selectedParcelIds: string[];
}

const API_BASE_URL = ((import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL) || '/api';

/**
 * Verifies backend and database connectivity health.
 */
export async function checkHealth(): Promise<{ status: string; database: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`API health check failed with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetches parcels matching optional query filters as a GeoJSON FeatureCollection.
 */
export async function fetchParcels(params?: ParcelQueryParams): Promise<GeoJSONFeatureCollection> {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.state && params.state !== 'ALL') searchParams.set('state', params.state);
    if (params.district && params.district !== 'ALL') searchParams.set('district', params.district);
    if (params.taluk && params.taluk !== 'ALL') searchParams.set('taluk', params.taluk);
    if (params.village && params.village !== 'ALL') searchParams.set('village', params.village);
    if (params.survey_no && params.survey_no.trim()) searchParams.set('survey_no', params.survey_no.trim());
    if (params.category && params.category !== 'ALL') searchParams.set('category', params.category);
    if (params.limit) searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();
  const url = queryString ? `${API_BASE_URL}/parcels?${queryString}` : `${API_BASE_URL}/parcels?limit=500`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch parcels: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches a single parcel by parcel_id or MongoDB ObjectId.
 */
export async function fetchParcelById(id: string): Promise<GeoJSONFeature> {
  const response = await fetch(`${API_BASE_URL}/parcels/${encodeURIComponent(id.trim())}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch parcel "${id}": ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches all saved projects from MongoDB API.
 */
export async function fetchProjects(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches a single project by ID from MongoDB API.
 */
export async function fetchProjectById(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(id.trim())}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch project "${id}": ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Creates a new project in MongoDB API.
 * Returns the created project object with MongoDB _id.
 */
export async function createProject(data: CreateProjectRequest): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || `Failed to create project: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Updates an existing project in MongoDB API.
 */
export async function updateProject(id: string, data: Record<string, any>): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(id.trim())}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || `Failed to update project: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches all Hissa records with resolved Owner information.
 */
export async function fetchHissaRecords(params?: {
  parcel_id?: string;
  survey_no?: string;
  owner_id?: string;
  owner_name?: string;
}): Promise<any[]> {
  const searchParams = new URLSearchParams();
  if (params?.parcel_id) searchParams.set('parcel_id', params.parcel_id);
  if (params?.survey_no) searchParams.set('survey_no', params.survey_no);
  if (params?.owner_id) searchParams.set('owner_id', params.owner_id);
  if (params?.owner_name) searchParams.set('owner_name', params.owner_name);

  const query = searchParams.toString();
  const url = query ? `${API_BASE_URL}/hissa?${query}` : `${API_BASE_URL}/hissa`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch hissa records: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches Hissa records associated with a specific parcel_id.
 */
export async function fetchHissaByParcelId(parcelId: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/hissa/parcel/${encodeURIComponent(parcelId.trim())}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch hissa records for parcel "${parcelId}": ${response.status} ${response.statusText}`);
  }
  return response.json();
}
