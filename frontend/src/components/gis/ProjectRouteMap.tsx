import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { LandParcel } from '../../types';
import { Layers, Map as MapIcon, ZoomIn, ZoomOut, RotateCcw, Trash2, Check, X, ShieldAlert } from 'lucide-react';

interface ProjectRouteMapProps {
  waypoints: [number, number][]; // [lat, lng]
  onWaypointsChange: (newWaypoints: [number, number][]) => void;
  rowWidthM: number;
  isDrawMode: boolean;
  onToggleDrawMode: (active: boolean) => void;
  parcels: LandParcel[];
  selectedParcelId: string | null;
  onSelectParcel: (parcelId: string) => void;
  onAffectedParcelsCalculated?: (affectedParcels: LandParcel[]) => void;
  height?: string;
}

/**
 * Calculates geodesic distance between two points in kilometers (Haversine formula)
 */
export function calculateGeodesicDistanceKm(p1: [number, number], p2: [number, number]): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates total route length from waypoints array in kilometers
 */
export function calculateTotalRouteLengthKm(waypoints: [number, number][]): number {
  if (waypoints.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculateGeodesicDistanceKm(waypoints[i], waypoints[i + 1]);
  }
  return Number(total.toFixed(2));
}

/**
 * Generates an offset corridor buffer polygon around a centerline polyline
 * (Approximates parallel offsets at distance = rowWidthM / 2)
 */
export function generateCorridorBufferPolygon(waypoints: [number, number][], rowWidthM: number): [number, number][] {
  if (waypoints.length < 2) return [];

  const bufferMeters = rowWidthM / 2;
  const metersPerDegreeLat = 111320;
  
  const leftSide: [number, number][] = [];
  const rightSide: [number, number][] = [];

  for (let i = 0; i < waypoints.length; i++) {
    const p = waypoints[i];
    let dx = 0;
    let dy = 0;

    if (i < waypoints.length - 1) {
      const next = waypoints[i + 1];
      dy += next[0] - p[0];
      dx += (next[1] - p[1]) * Math.cos((p[0] * Math.PI) / 180);
    }
    if (i > 0) {
      const prev = waypoints[i - 1];
      dy += p[0] - prev[0];
      dx += (p[1] - prev[1]) * Math.cos((p[0] * Math.PI) / 180);
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue;

    // Normal vector perpendicular to direction
    const nx = -dy / len;
    const ny = dx / len;

    const metersPerDegreeLng = metersPerDegreeLat * Math.cos((p[0] * Math.PI) / 180);
    const dLat = (ny * bufferMeters) / metersPerDegreeLat;
    const dLng = (nx * bufferMeters) / metersPerDegreeLng;

    leftSide.push([p[0] + dLat, p[1] + dLng]);
    rightSide.push([p[0] - dLat, p[1] - dLng]);
  }

  // Construct closed polygon loop
  return [...leftSide, ...rightSide.reverse()];
}

/**
 * Checks if a point [lat, lng] is within a given distance threshold from a polyline
 */
export function isParcelNearRoute(parcelLat: number, parcelLng: number, waypoints: [number, number][], thresholdMeters: number): boolean {
  if (waypoints.length === 0) return false;
  const thresholdKm = thresholdMeters / 1000;

  for (let i = 0; i < waypoints.length; i++) {
    const dist = calculateGeodesicDistanceKm([parcelLat, parcelLng], waypoints[i]);
    if (dist <= thresholdKm) return true;
  }
  return false;
}

export const ProjectRouteMap: React.FC<ProjectRouteMapProps> = ({
  waypoints,
  onWaypointsChange,
  rowWidthM,
  isDrawMode,
  onToggleDrawMode,
  parcels,
  selectedParcelId,
  onSelectParcel,
  onAffectedParcelsCalculated,
  height = '500px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const bufferPolygonRef = useRef<L.Polygon | null>(null);
  const waypointMarkersRef = useRef<L.CircleMarker[]>([]);
  const parcelPolygonsRef = useRef<{ [key: string]: L.Polygon }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapLayerType, setMapLayerType] = useState<'osm' | 'satellite'>('osm');

  // Compute affected parcels that intersect with route corridor
  const affectedParcels = useMemo(() => {
    if (waypoints.length < 2) return [];
    const thresholdMeters = Math.max(rowWidthM * 1.5, 100);
    return parcels.filter(p => isParcelNearRoute(p.latitude, p.longitude, waypoints, thresholdMeters));
  }, [waypoints, rowWidthM, parcels]);

  // Notify parent of affected parcels calculation
  useEffect(() => {
    if (onAffectedParcelsCalculated) {
      onAffectedParcelsCalculated(affectedParcels);
    }
  }, [affectedParcels, onAffectedParcelsCalculated]);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center near Karnataka / Bengaluru Rural
    const map = L.map(mapContainerRef.current, {
      center: waypoints.length > 0 ? waypoints[0] : [12.846, 74.941],
      zoom: 13,
      zoomControl: false,
      attributionControl: true
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Map Tile Switcher
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attr = '&copy; OpenStreetMap';

    if (mapLayerType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = 'Tiles &copy; Esri World Imagery';
    }

    const newTile = L.tileLayer(url, { maxZoom: 19, attribution: attr }).addTo(map);
    tileLayerRef.current = newTile;
  }, [mapLayerType]);

  // Handle Map Click in Draw Mode
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawMode) return;
      const newPt: [number, number] = [Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))];
      onWaypointsChange([...waypoints, newPt]);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawMode, waypoints, onWaypointsChange]);

  // Draw Polyline, Corridor Buffer, and Waypoint Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous layers
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (bufferPolygonRef.current) {
      map.removeLayer(bufferPolygonRef.current);
      bufferPolygonRef.current = null;
    }
    waypointMarkersRef.current.forEach(m => map.removeLayer(m));
    waypointMarkersRef.current = [];

    // Render ROW Corridor Buffer Polygon
    if (waypoints.length >= 2) {
      const bufferCoords = generateCorridorBufferPolygon(waypoints, rowWidthM);
      if (bufferCoords.length > 0) {
        bufferPolygonRef.current = L.polygon(bufferCoords, {
          color: '#a855f7',
          weight: 2,
          dashArray: '6, 6',
          fillColor: '#c084fc',
          fillOpacity: 0.25
        }).addTo(map);
        bufferPolygonRef.current.bindTooltip(
          `<div style="font-size: 11px; font-weight: 700; color: #6b21a8;">Indicative ROW Corridor (${rowWidthM}m Buffer)</div>`,
          { sticky: true }
        );
      }
    }

    // Render Centerline Polyline
    if (waypoints.length >= 2) {
      routePolylineRef.current = L.polyline(waypoints, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }

    // Render Waypoint Circle Markers
    waypoints.forEach((pt, index) => {
      const isStart = index === 0;
      const isEnd = index === waypoints.length - 1 && waypoints.length > 1;

      const marker = L.circleMarker(pt, {
        radius: isStart || isEnd ? 8 : 6,
        fillColor: isStart ? '#22c55e' : isEnd ? '#ef4444' : '#3b82f6',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1
      }).addTo(map);

      marker.bindTooltip(
        `<div style="font-size: 11px; font-weight: 700;">${isStart ? 'Start Point' : isEnd ? 'End Point' : `Waypoint ${index + 1}`}</div>`,
        { direction: 'top' }
      );

      waypointMarkersRef.current.push(marker);
    });

    // Auto-fit bounds on initial load if route exists or if project parcels exist
    if (!isDrawMode) {
      try {
        if (waypoints.length >= 2) {
          const bounds = L.latLngBounds(waypoints);
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
          }
        } else if (parcels.length > 0) {
          const allCoords: [number, number][] = [];
          parcels.forEach(p => {
            if (Array.isArray(p.coordinates)) {
              if (typeof p.coordinates[0]?.[0] === 'number') {
                allCoords.push(p.coordinates as any);
              } else if (Array.isArray(p.coordinates[0])) {
                (p.coordinates as any).forEach((ring: any) => {
                  if (Array.isArray(ring)) {
                    ring.forEach((pt: any) => {
                      if (Array.isArray(pt) && pt.length >= 2) allCoords.push([pt[0], pt[1]]);
                    });
                  }
                });
              }
            }
          });
          if (allCoords.length > 0) {
            const bounds = L.latLngBounds(allCoords);
            if (bounds.isValid()) {
              map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
            }
          }
        }
      } catch (err) {
        // ignore
      }
    }
  }, [waypoints, rowWidthM, isDrawMode, parcels]);

  // Render Cadastral Parcels and Highlight Intersecting Ones
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old parcel layers
    Object.values(parcelPolygonsRef.current).forEach(l => map.removeLayer(l));
    parcelPolygonsRef.current = {};

    const affectedIds = new Set(affectedParcels.map(p => p.parcelId));

    parcels.forEach((parcel) => {
      const isAffected = affectedIds.has(parcel.parcelId);
      const isSelected = parcel.parcelId === selectedParcelId;

      let color = isSelected ? '#1d4ed8' : isAffected ? '#eab308' : '#059669';
      let fillColor = isSelected ? '#3b82f6' : isAffected ? '#fde047' : '#10b981';
      let fillOpacity = isSelected ? 0.65 : isAffected ? 0.55 : 0.40;

      const polygon = L.polygon(parcel.coordinates as any, {
        color,
        weight: isSelected ? 4 : isAffected ? 3 : 2.5,
        fillColor,
        fillOpacity,
        dashArray: isAffected ? '4, 4' : undefined
      }).addTo(map);

      polygon.bindTooltip(
        `
        <div style="font-size: 11px; padding: 2px;">
          <div style="font-weight: 700; color: #0f172a;">Selected Land: Sy. No. ${parcel.surveyNumber} (${parcel.village})</div>
          <div style="color: #047857; font-weight: 600;">${parcel.areaAcres} Acres · ${parcel.landType}</div>
          ${isAffected ? '<div style="color: #b45309; font-weight: 700; margin-top: 2px;">⚠️ Within Proposed ROW Corridor</div>' : '<div style="color: #059669; font-weight: 600; margin-top: 2px;">✓ Selected Project Land Area</div>'}
        </div>
        `,
        { direction: 'center' }
      );

      polygon.on('click', () => {
        onSelectParcel(parcel.parcelId);
      });

      parcelPolygonsRef.current[parcel.parcelId] = polygon;
    });
  }, [parcels, affectedParcels, selectedParcelId, onSelectParcel]);

  const routeLengthKm = calculateTotalRouteLengthKm(waypoints);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }} />

      {/* Draw Mode Overlay Notification */}
      {isDrawMode && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(30, 41, 59, 0.94)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(4px)'
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 1.5s infinite' }} />
          <span>Click on the map to place alignment waypoints ({waypoints.length} points placed)</span>
        </div>
      )}

      {/* Floating GIS Map Controls */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* Layer Switcher */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--gov-slate-200)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            padding: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <button
            className="gov-btn gov-btn-sm"
            style={{
              backgroundColor: mapLayerType === 'osm' ? 'var(--gov-blue-50)' : '#ffffff',
              color: mapLayerType === 'osm' ? 'var(--gov-blue-700)' : 'var(--gov-slate-700)',
              border: 'none',
              justifyContent: 'flex-start',
              fontSize: '11px'
            }}
            onClick={() => setMapLayerType('osm')}
          >
            <MapIcon size={13} /> Map View
          </button>
          <button
            className="gov-btn gov-btn-sm"
            style={{
              backgroundColor: mapLayerType === 'satellite' ? 'var(--gov-blue-50)' : '#ffffff',
              color: mapLayerType === 'satellite' ? 'var(--gov-blue-700)' : 'var(--gov-slate-700)',
              border: 'none',
              justifyContent: 'flex-start',
              fontSize: '11px'
            }}
            onClick={() => setMapLayerType('satellite')}
          >
            <Layers size={13} /> Satellite
          </button>
        </div>

        {/* Zoom Controls */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--gov-slate-200)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <button
            style={{ padding: '6px 8px', border: 'none', background: '#ffffff', borderBottom: '1px solid var(--gov-slate-200)', cursor: 'pointer' }}
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
          >
            <ZoomIn size={15} color="var(--gov-slate-700)" />
          </button>
          <button
            style={{ padding: '6px 8px', border: 'none', background: '#ffffff', cursor: 'pointer' }}
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
          >
            <ZoomOut size={15} color="var(--gov-slate-700)" />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid var(--gov-slate-300)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: '10px 14px',
          fontSize: '11px',
          backdropFilter: 'blur(4px)',
          maxWidth: '300px'
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '6px' }}>
          Alignment & Corridor Map Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '3px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
            <span>Proposed Centerline Polyline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '8px', backgroundColor: '#c084fc', border: '1px dashed #a855f7', borderRadius: '2px' }} />
            <span>Right of Way (ROW) Buffer Corridor ({rowWidthM}m)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#fde047', border: '1px dashed #eab308', borderRadius: '2px' }} />
            <span>Intersecting / Affected Parcels ({affectedParcels.length})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRouteMap;
