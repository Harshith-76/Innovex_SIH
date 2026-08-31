import { Filter, Document } from 'mongodb';
import { getHissaCollection } from '../config/database.js';

export interface HissaOwner {
  owner_id: string;
  name: string;
  mobile?: string;
  address?: string;
}

export interface HissaRecordDocument extends Document {
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

export interface HissaQueryParams {
  parcel_id?: string;
  survey_no?: string;
  owner_id?: string;
  owner_name?: string;
  limit?: string | number;
}

/**
 * Builds the MongoDB Aggregation Pipeline joining hissa_records with owners.
 */
function buildHissaLookupPipeline(matchStage: Filter<Document>, limit: number) {
  return [
    { $match: matchStage },
    {
      $lookup: {
        from: 'owners',
        localField: 'owner_id',
        foreignField: 'owner_id',
        as: 'owner_doc',
      },
    },
    {
      $unwind: {
        path: '$owner_doc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        hissa_id: { $ifNull: ['$hissa_id', '$_id'] },
        parcel_id: 1,
        survey_no: 1,
        hissa_no: 1,
        extent: 1,
        extent_unit: 1,
        extent_basis: 1,
        owner_id: 1,
        owner: {
          $cond: {
            if: '$owner_doc',
            then: {
              owner_id: '$owner_doc.owner_id',
              name: '$owner_doc.name',
              mobile: '$owner_doc.mobile',
              address: '$owner_doc.address',
            },
            else: null,
          },
        },
        parcel_geometry: 1,
        geometry_source: 1,
        parcel_geometry_role: 1,
      },
    },
    { $limit: limit },
  ];
}

/**
 * Fetches all Hissa records with resolved Owner information.
 */
export async function getHissaRecords(params?: HissaQueryParams): Promise<HissaRecordDocument[]> {
  const collection = getHissaCollection();
  const matchStage: Filter<Document> = {};

  if (params?.parcel_id && params.parcel_id.trim()) {
    matchStage.parcel_id = params.parcel_id.trim();
  }

  if (params?.survey_no && params.survey_no.trim()) {
    matchStage.survey_no = params.survey_no.trim();
  }

  if (params?.owner_id && params.owner_id.trim()) {
    matchStage.owner_id = params.owner_id.trim();
  }

  const parsedLimit = params?.limit ? parseInt(String(params.limit), 10) : 1000;
  const safeLimit = Math.min(Math.max(isNaN(parsedLimit) ? 1000 : parsedLimit, 1), 2500);

  const pipeline = buildHissaLookupPipeline(matchStage, safeLimit);

  if (params?.owner_name && params.owner_name.trim()) {
    // Add a post-lookup match for owner name
    pipeline.push({
      $match: {
        'owner.name': { $regex: new RegExp(params.owner_name.trim(), 'i') },
      },
    } as any);
  }

  const docs = await collection.aggregate<HissaRecordDocument>(pipeline).toArray();
  return docs;
}

/**
 * Fetches all Hissa records associated with a specific parcel_id.
 */
export async function getHissaRecordsByParcelId(parcelId: string): Promise<HissaRecordDocument[]> {
  if (!parcelId || !parcelId.trim()) {
    return [];
  }

  const collection = getHissaCollection();
  const matchStage = { parcel_id: parcelId.trim() };
  const pipeline = buildHissaLookupPipeline(matchStage, 100);

  const docs = await collection.aggregate<HissaRecordDocument>(pipeline).toArray();
  return docs;
}
