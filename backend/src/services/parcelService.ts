import { Filter, ObjectId, Document } from 'mongodb';
import { getParcelsCollection, pingDatabase } from '../config/database.js';

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

export interface ParcelDocument extends Document, ParcelProperties {
  _id: ObjectId;
  geometry: GeoJSONGeometry;
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
  district?: string;
  taluk?: string;
  village?: string;
  survey_no?: string;
  category?: string;
  limit?: string | number;
}

/**
 * Transforms a raw MongoDB parcel document into a valid GeoJSON Feature.
 * Preserves standard GeoJSON [longitude, latitude] coordinates.
 */
function toGeoJSONFeature(doc: ParcelDocument): GeoJSONFeature {
  const { _id, geometry, ...restProperties } = doc;

  const district = doc.district || doc.location?.district;
  const district_code = doc.district_code || doc.location?.district_code;
  const taluk = doc.taluk || doc.location?.taluk;
  const taluk_code = doc.taluk_code || doc.location?.taluk_code;
  const hobli = doc.hobli || doc.location?.hobli;
  const hobli_code = doc.hobli_code || doc.location?.hobli_code;
  const village = doc.village || doc.location?.village;
  const village_code = doc.village_code || doc.location?.village_code;
  const bhoomi_village_code = doc.bhoomi_village_code || doc.location?.bhoomi_village_code;
  const state = doc.state || doc.location?.state || 'Karnataka';

  const cadastral_id = doc.cadastral_id || doc.cadastral?.cadastral_id;
  const ulpin = doc.ulpin || doc.cadastral?.ulpin;
  const area = doc.area !== undefined ? doc.area : (doc.cadastral?.area_acres !== undefined ? doc.cadastral.area_acres : undefined);
  const area_unit = doc.area_unit || 'acres';
  const category = doc.category || doc.cadastral?.category || 'Parcel';

  return {
    type: 'Feature',
    id: doc.parcel_id || _id.toString(),
    properties: {
      parcel_id: doc.parcel_id,
      survey_no: doc.survey_no,
      cadastral_id,
      ulpin,
      district,
      district_code,
      taluk,
      taluk_code,
      hobli,
      hobli_code,
      village,
      village_code,
      bhoomi_village_code,
      state,
      area,
      area_unit,
      category,
      ...restProperties,
    },
    geometry: geometry,
  };
}

/**
 * Fetches parcels matching optional query filters, formatted as a GeoJSON FeatureCollection.
 */
export async function getParcels(params: ParcelQueryParams): Promise<GeoJSONFeatureCollection> {
  const collection = getParcelsCollection<ParcelDocument>();
  const mongoFilter: Filter<ParcelDocument> = {};
  const andClauses: Filter<ParcelDocument>[] = [];

  if (params.district && params.district.trim()) {
    const reg = { $regex: new RegExp(`^${params.district.trim()}$`, 'i') };
    andClauses.push({ $or: [{ district: reg }, { 'location.district': reg }] });
  }

  if (params.taluk && params.taluk.trim()) {
    const reg = { $regex: new RegExp(`^${params.taluk.trim()}$`, 'i') };
    andClauses.push({ $or: [{ taluk: reg }, { 'location.taluk': reg }] });
  }

  if (params.village && params.village.trim()) {
    const reg = { $regex: new RegExp(`^${params.village.trim()}$`, 'i') };
    andClauses.push({ $or: [{ village: reg }, { 'location.village': reg }] });
  }

  if (params.survey_no && params.survey_no.trim()) {
    const sNo = params.survey_no.trim();
    andClauses.push({ $or: [{ survey_no: sNo }, { survey_no: { $regex: new RegExp(`^${sNo}$`, 'i') } }] });
  }

  if (params.category && params.category.trim()) {
    const reg = { $regex: new RegExp(`^${params.category.trim()}$`, 'i') };
    andClauses.push({ $or: [{ category: reg }, { 'cadastral.category': reg }] });
  }

  if (andClauses.length > 0) {
    mongoFilter.$and = andClauses;
  }

  // Parse and enforce pagination limit
  const parsedLimit = params.limit ? parseInt(String(params.limit), 10) : 500;
  const safeLimit = Math.min(Math.max(isNaN(parsedLimit) ? 500 : parsedLimit, 1), 2500);

  const rawDocs = await collection
    .find(mongoFilter)
    .limit(safeLimit)
    .toArray();

  const features = rawDocs.map(toGeoJSONFeature);

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Fetches a single parcel by parcel_id or MongoDB ObjectId.
 */
export async function getParcelById(id: string): Promise<GeoJSONFeature | null> {
  const collection = getParcelsCollection<ParcelDocument>();
  const trimmedId = id.trim();

  // Try searching by parcel_id first
  let doc = await collection.findOne({ parcel_id: trimmedId });

  // If not found and the ID is a valid 24-character hex ObjectId, search by _id
  if (!doc && ObjectId.isValid(trimmedId)) {
    doc = await collection.findOne({ _id: new ObjectId(trimmedId) });
  }

  if (!doc) {
    return null;
  }

  return toGeoJSONFeature(doc);
}

/**
 * Checks MongoDB database connectivity and total parcel count.
 */
export async function getDatabaseHealth() {
  return await pingDatabase();
}
