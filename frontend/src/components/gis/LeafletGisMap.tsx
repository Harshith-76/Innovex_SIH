import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LandParcel, ParcelStatus } from '../../types';
import { Layers, Map, ZoomIn, ZoomOut, Compass, Info, CheckCircle2, AlertCircle } from 'lucide-react';

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

/**
 * Clean, low-opacity parcel styling palette.
 * Keeps satellite imagery and roads crisp and visible beneath cadastral boundaries.
 */
const getParcelStyle = (parcel: LandParcel, isSelected: boolean) => {
  if (isSelected) {
    return {
      color: '#1d4ed8', // Royal Blue
      weight: 3,
      fillColor: '#3b82f6',
      fillOpacity: 0.28,
      dashArray: undefined,
    };
  }

  if (parcel.hasHissa && parcel.hissaRecords && parcel.hissaRecords.length > 0) {
    return {
      color: '#4f46e5', // Indigo Accent for Hissa Linked Parcels
      weight: 1.8,
      fillColor: '#818cf8',
      fillOpacity: 0.16,
      dashArray: undefined,
    };
  }

  // Standard K-GIS Land Parcel
  return {
    color: '#0284c7', // Subtle Sky/Slate Blue
    weight: 1.2,
    fillColor: '#38bdf8',
    fillOpacity: 0.12,
    dashArray: undefined,
  };
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
  const [mapLayerType, setMapLayerType] = useState<'osm' | 'satellite'>('satellite'); // Default to Satellite for rich GIS view
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
      center: viewCenter || [12.846, 74.941],
      zoom: 13,
      zoomControl: false,
      attributionControl: true
    });

    // Default to Satellite Imagery for professional GIS context
    const tileLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and GIS User Community'
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

    let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let attribution = 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and GIS User Community';

    if (mapLayerType === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
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
      const isSelected =
        parcel.parcelId === selectedParcelId ||
        (selectedParcelIds?.includes(parcel.parcelId) ?? false);

      const style = getParcelStyle(parcel, isSelected);

      const polygon = L.polygon(parcel.coordinates as any, {
        color: style.color,
        weight: style.weight,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        dashArray: style.dashArray,
      }).addTo(map);

      // Tooltip with survey details & Hissa owner indicators
      const hissaCount = parcel.hissaRecords ? parcel.hissaRecords.length : 0;
      const ownerNames = parcel.hissaRecords && parcel.hissaRecords.length > 0
        ? parcel.hissaRecords.map(h => h.owner?.name).filter(Boolean).slice(0, 2).join(', ')
        : (parcel.ownerName && !parcel.ownerName.includes('Awaiting') ? parcel.ownerName : null);

      polygon.bindTooltip(
        `
        <div style="font-family: 'Inter', sans-serif; font-size: 11.5px; padding: 4px 6px; min-width: 180px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="font-weight: 700; color: #0f172a; font-size: 12px;">Survey No: ${parcel.surveyNumber}</span>
            ${hissaCount > 0 
              ? `<span style="background: #e0e7ff; color: #4338ca; padding: 1px 5px; border-radius: 3px; font-size: 9.5px; font-weight: 600;">${hissaCount} Hissa${hissaCount > 1 ? 's' : ''}</span>`
              : `<span style="background: #f1f5f9; color: #64748b; padding: 1px 5px; border-radius: 3px; font-size: 9.5px;">K-GIS Parcel</span>`
            }
          </div>
          <div style="color: #64748b; font-size: 10.5px; margin-top: 2px;">${parcel.village}, ${parcel.taluk}</div>
          <div style="color: #334155; font-size: 11px; margin-top: 3px;">
            <strong>Extent:</strong> ${parcel.areaAcres} Acres
          </div>
          ${ownerNames 
            ? `<div style="color: #1e293b; font-size: 10.5px; margin-top: 2px; border-top: 1px dashed #cbd5e1; padding-top: 3px;">
                 <strong>Owner:</strong> ${ownerNames}${hissaCount > 2 ? '...' : ''}
               </div>` 
            : ''
          }
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
            maxWidth: '340px'
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
            <Compass size={13} /> Cadastral Survey & Hissa Legend
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1.5px solid #0284c7',
                  borderRadius: '2px'
                }}
              />
              <span style={{ color: 'var(--gov-slate-800)' }}>
                <strong>Land Parcel</strong> (K-GIS Cadastral Polygon)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'rgba(129, 140, 248, 0.22)',
                  border: '1.8px solid #4f46e5',
                  borderRadius: '2px'
                }}
              />
              <span style={{ color: 'var(--gov-slate-800)' }}>
                <strong>Hissa-Linked Parcel</strong> (Verified Owner Record)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'rgba(59, 130, 246, 0.35)',
                  border: '2px solid #1d4ed8',
                  borderRadius: '2px'
                }}
              />
              <span style={{ color: 'var(--gov-slate-800)' }}>
                <strong>Selected Parcel</strong> (Inspector Active)
              </span>
            </div>
          </div>

          {/* Legal / GIS limitation notice */}
          <div
            style={{
              padding: '5px 8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '9.5px',
              color: '#64748b',
              lineHeight: 1.3
            }}
          >
            <em>Note: Hissa records are mapped to the parent K-GIS parcel. Internal Hissa sub-division boundary geometry is not officially digitized.</em>
          </div>
        </div>
      )}
    </div>
  );
};
