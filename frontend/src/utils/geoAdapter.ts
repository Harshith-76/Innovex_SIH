import { LandParcel, ParcelStatus } from '../types';
import { GeoJSONFeature, GeoJSONFeatureCollection } from '../services/api';

/**
 * Converts a GeoJSON [lng, lat] coordinate ring to a Leaflet [lat, lng] coordinate array.
 */
function convertRingToLatLng(ring: number[][]): [number, number][] {
  return ring.map(([lng, lat]) => [lat, lng]);
}

/**
 * Calculates a representative centroid [latitude, longitude] from polygon coordinates.
 */
function computeCentroid(geometry: GeoJSONFeature['geometry']): { latitude: number; longitude: number } {
  try {
    let firstRing: number[][] = [];
    if (geometry.type === 'Polygon') {
      const polyCoords = geometry.coordinates as number[][][];
      firstRing = polyCoords[0] || [];
    } else if (geometry.type === 'MultiPolygon') {
      const multiCoords = geometry.coordinates as number[][][][];
      firstRing = multiCoords[0]?.[0] || [];
    }

    if (!firstRing || firstRing.length === 0) {
      return { latitude: 12.846, longitude: 74.941 }; // Default Dakshina Kannada fallback
    }

    let sumLat = 0;
    let sumLng = 0;
    const count = firstRing.length;

    for (const [lng, lat] of firstRing) {
      sumLat += lat;
      sumLng += lng;
    }

    return {
      latitude: sumLat / count,
      longitude: sumLng / count
    };
  } catch {
    return { latitude: 12.846, longitude: 74.941 };
  }
}

/**
 * Converts GeoJSON geometry into Leaflet compatible coordinate structure [latitude, longitude].
 * Supports both Polygon (with holes) and MultiPolygon geometries.
 */
export function convertGeoJSONGeometryToLeaflet(
  geometry: GeoJSONFeature['geometry']
): [number, number][] | [number, number][][] | [number, number][][][] {
  if (geometry.type === 'Polygon') {
    // Polygon: array of rings (exterior ring + interior hole rings)
    const polyCoords = geometry.coordinates as number[][][];
    const rings = polyCoords.map(convertRingToLatLng);
    return rings.length === 1 ? rings[0] : rings;
  }

  if (geometry.type === 'MultiPolygon') {
    // MultiPolygon: array of polygons, each having an array of rings
    const multiCoords = geometry.coordinates as number[][][][];
    return multiCoords.map((poly) => poly.map(convertRingToLatLng));
  }

  return [];
}

/**
 * Adapts a single GeoJSON Feature from the K-GIS backend into a frontend LandParcel.
 */
export function featureToLandParcel(feature: GeoJSONFeature): LandParcel {
  const props = feature.properties || {};
  const centroid = computeCentroid(feature.geometry);
  const leafletCoordinates = convertGeoJSONGeometryToLeaflet(feature.geometry);

  // Extract nested or top-level properties safely
  const parcelId = props.parcel_id || feature.id || `PCL-${Math.random().toString(36).slice(2, 9)}`;
  const surveyNumber = props.survey_no || '—';
  const cadastralId = props.cadastral_id || props.cadastral?.cadastral_id;
  const ulpin = props.ulpin || props.cadastral?.ulpin;
  const state = props.state || props.location?.state || 'Karnataka';
  const district = props.district || props.location?.district || 'Dakshina Kannada';
  const districtCode = props.district_code || props.location?.district_code;
  const taluk = props.taluk || props.location?.taluk || 'Ullala';
  const talukCode = props.taluk_code || props.location?.taluk_code;
  const hobli = props.hobli || props.location?.hobli || 'Panemangaluru';
  const hobliCode = props.hobli_code || props.location?.hobli_code;
  const village = props.village || props.location?.village || 'Pajeer';
  const villageCode = props.village_code || props.location?.village_code;
  const bhoomiVillageCode = props.bhoomi_village_code || props.location?.bhoomi_village_code;

  const rawArea = props.area !== undefined ? props.area : props.cadastral?.area_acres;
  const areaAcres = typeof rawArea === 'number' ? Number(rawArea.toFixed(3)) : 0;
  const areaUnit = props.area_unit || 'acres';
  const category = props.category || props.cadastral?.category || 'Agricultural';

  // Acquisition status handling
  let acquisitionStatus: ParcelStatus = 'Notification';
  if (props.status?.acquisition_status === 'ACQUIRED') {
    acquisitionStatus = 'Acquired';
  } else if (props.status?.acquisition_status === 'UNDER_ACQUISITION') {
    acquisitionStatus = 'Under Acquisition';
  }

  return {
    parcelId,
    surveyNumber,
    cadastralId,
    ulpin,
    state,
    district,
    districtCode,
    taluk,
    talukCode,
    hobli,
    hobliCode,
    village,
    villageCode,
    bhoomiVillageCode,
    areaAcres,
    areaUnit,
    landType: category,
    latitude: centroid.latitude,
    longitude: centroid.longitude,
    coordinates: leafletCoordinates,
    projectId: 'proj-001',
    projectName: 'Dakshina Kannada Infrastructure Corridor',
    acquisitionStatus,
    compensationAmount: areaAcres * 2500000, // Estimated market base
    compensationPaid: 0,
    compensationStatus: 'Pending Approval',
    possessionStatus: 'Pending',
    rrRequired: false,
    rrStatus: 'Not Required',
    affectedFamiliesCount: 0,
    documentsCount: 0,
    ownerName: props.owner_name || '— (Awaiting Bhoomi RTC sync)',
    khataNumber: props.khata_number || '—',
    soilClassification: props.soil_type || 'Dry Land / Bagayat',
    lastUpdated: 'Real K-GIS Cadastral Sync'
  };
}

/**
 * Adapts an entire GeoJSON FeatureCollection into an array of LandParcels.
 */
export function featureCollectionToLandParcels(fc: GeoJSONFeatureCollection): LandParcel[] {
  if (!fc || !Array.isArray(fc.features)) {
    return [];
  }
  return fc.features.map(featureToLandParcel);
}
