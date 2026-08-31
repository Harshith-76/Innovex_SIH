import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LandParcel, ParcelStatus } from '../../types';
import { Layers, Map, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface LeafletGisMapProps {
  parcels: LandParcel[];
  selectedParcelId: string | null;
  onSelectParcel: (parcelId: string) => void;
  height?: string;
  showLegend?: boolean;
  showLayerToggle?: boolean;
  /** Optional extra IDs to highlight (wizard multi-select). GIS page can omit this. */
  selectedParcelIds?: string[];
  /** Optional map center [lat, lng]. GIS page omits this and keeps the default Karnataka view. */
  viewCenter?: [number, number];
  /** When false, the built-in empty overlay is hidden so a parent can show its own status. */
  showEmptyState?: boolean;
}

const getStatusColor = (status: ParcelStatus) => {
  switch (status) {
    case 'Acquired':
      return { fill: '#22c55e', stroke: '#15803d' };
    case 'Under Acquisition':
      return { fill: '#3b82f6', stroke: '#1d4ed8' };
    case 'Notification':
      return { fill: '#f59e0b', stroke: '#b45309' };
    case 'Compensation Pending':
      return { fill: '#fb923c', stroke: '#c2410c' };
    case 'Possession Pending':
      return { fill: '#a855f7', stroke: '#7e22ce' };
    case 'R&R Pending':
      return { fill: '#ef4444', stroke: '#b91c1c' };
    default:
      return { fill: '#94a3b8', stroke: '#475569' };
  }
};

export const LeafletGisMap: React.FC<LeafletGisMapProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  height = '100%',
  showLegend = true,
  showLayerToggle = true,
  selectedParcelIds,
  viewCenter,
  showEmptyState = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<{ [key: string]: L.Polygon }>({});
  const [mapLayerType, setMapLayerType] = useState<'osm' | 'satellite'>('osm');
  const [showRoadAlignment, setShowRoadAlignment] = useState<boolean>(false);
  const [showGridNumbers, setShowGridNumbers] = useState<boolean>(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const alignmentLayerRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Karnataka overview (or a caller-provided district center)
    const map = L.map(mapContainerRef.current, {
      center: viewCenter || [12.9716, 77.5946],
      zoom: 10,
      zoomControl: false,
      attributionControl: true
    });

    // Add Base Tile Layer
    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    const invalidate = window.setTimeout(() => {
      map.invalidateSize();
    }, 80);

    return () => {
      window.clearTimeout(invalidate);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (mapLayerType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }

    const newTile = L.tileLayer(url, { maxZoom: 19, attribution }).addTo(map);
    tileLayerRef.current = newTile;
  }, [mapLayerType]);

  // Render & Update Parcels Polygons
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old polygon layers
    Object.values(polygonLayersRef.current).forEach((layer) => {
      map.removeLayer(layer);
    });
    polygonLayersRef.current = {};

    const featureGroup = L.featureGroup();

    parcels.forEach((parcel) => {
      const colors = getStatusColor(parcel.acquisitionStatus);
      const isSelected =
        parcel.parcelId === selectedParcelId ||
        (selectedParcelIds?.includes(parcel.parcelId) ?? false);

      const polygon = L.polygon(parcel.coordinates as any, {
        color: isSelected ? '#1e3a8a' : colors.stroke,
        weight: isSelected ? 4 : 2,
        fillColor: isSelected ? '#f59e0b' : colors.fill,
        fillOpacity: isSelected ? 0.75 : 0.45,
        dashArray: parcel.acquisitionStatus === 'Notification' ? '5, 5' : undefined
      }).addTo(map);

      // Tooltip with survey details
      polygon.bindTooltip(
        `
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; padding: 2px;">
          <div style="font-weight: 700; color: #0e2238;">Survey No: ${parcel.surveyNumber}</div>
          <div style="color: #475569;">${parcel.village}, ${parcel.taluk}</div>
          <div style="color: #0f172a; font-weight: 600; margin-top: 2px;">${parcel.areaAcres} Acres · ${parcel.landType}</div>
          <div style="margin-top: 4px; font-size: 10px; font-weight: 600; color: ${colors.stroke};">
            ● ${parcel.acquisitionStatus}
          </div>
        </div>
        `,
        {
          permanent: showGridNumbers,
          direction: 'center',
          className: 'cadastral-tooltip'
        }
      );

      // Click event
      polygon.on('click', () => {
        onSelectParcel(parcel.parcelId);
      });

      polygonLayersRef.current[parcel.parcelId] = polygon;
      featureGroup.addLayer(polygon);
    });

    // Automatically fit map view to the bounding box of the loaded parcels
    if (parcels.length > 0 && featureGroup.getLayers().length > 0 && !selectedParcelId) {
      try {
        const bounds = featureGroup.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
        }
      } catch (err) {
        console.warn('[LeafletGisMap] Could not auto-fit bounds:', err);
      }
    } else if (parcels.length === 0 && viewCenter) {
      map.setView(viewCenter, 10);
    }
  }, [parcels, selectedParcelId, selectedParcelIds, onSelectParcel, showGridNumbers, viewCenter]);

  // Pan / Zoom to selected parcel when selected
  useEffect(() => {
    if (!selectedParcelId || !mapInstanceRef.current) return;
    const targetParcel = parcels.find((p) => p.parcelId === selectedParcelId);
    if (targetParcel) {
      const poly = polygonLayersRef.current[targetParcel.parcelId];
      if (poly) {
        mapInstanceRef.current.fitBounds(poly.getBounds(), { padding: [50, 50], maxZoom: 18 });
      } else {
        mapInstanceRef.current.flyTo(
          [targetParcel.latitude, targetParcel.longitude],
          16,
          { duration: 0.8 }
        );
      }
    }
  }, [selectedParcelId, parcels]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Empty State Banner when no parcels are loaded */}
      {showEmptyState && parcels.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--gov-slate-300)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 24px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)', fontSize: '13px' }}>
            No parcel data loaded.
          </div>
          <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginTop: '4px' }}>
            Cadastral parcel boundaries will be fetched from the backend API.
          </div>
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
        {/* Layer switch buttons */}
        {showLayerToggle && (
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
              <Map size={13} /> OpenStreetMap
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
              <Layers size={13} /> Satellite Imagery
            </button>
          </div>
        )}

        {/* Overlays toggle */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--gov-slate-200)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            padding: '8px 10px',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showRoadAlignment}
              onChange={(e) => setShowRoadAlignment(e.target.checked)}
            />
            <span>Corridor Alignment</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showGridNumbers}
              onChange={(e) => setShowGridNumbers(e.target.checked)}
            />
            <span>Survey No. Labels</span>
          </label>
        </div>

        {/* Zoom In / Out Buttons */}
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
            style={{
              padding: '6px 8px',
              border: 'none',
              background: '#ffffff',
              borderBottom: '1px solid var(--gov-slate-200)',
              cursor: 'pointer'
            }}
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
          >
            <ZoomIn size={15} color="var(--gov-slate-700)" />
          </button>
          <button
            style={{
              padding: '6px 8px',
              border: 'none',
              background: '#ffffff',
              cursor: 'pointer'
            }}
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
          >
            <ZoomOut size={15} color="var(--gov-slate-700)" />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay */}
      {showLegend && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid var(--gov-slate-300)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            padding: '10px 14px',
            fontSize: '11px',
            backdropFilter: 'blur(4px)',
            maxWidth: '320px'
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--gov-navy-900)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Compass size={13} /> Cadastral Survey Legend
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#22c55e', border: '1px solid #15803d', borderRadius: '2px' }} />
              <span>Acquired</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#3b82f6', border: '1px solid #1d4ed8', borderRadius: '2px' }} />
              <span>Under Acquisition</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#f59e0b', border: '1px solid #b45309', borderRadius: '2px' }} />
              <span>Notification</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#fb923c', border: '1px solid #c2410c', borderRadius: '2px' }} />
              <span>Comp. Pending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#a855f7', border: '1px solid #7e22ce', borderRadius: '2px' }} />
              <span>Possession Pending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#ef4444', border: '1px solid #b91c1c', borderRadius: '2px' }} />
              <span>R&R Pending</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
