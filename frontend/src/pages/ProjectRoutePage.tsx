import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectRouteMap, calculateTotalRouteLengthKm } from '../components/gis/ProjectRouteMap';
import { LandParcel } from '../types';
import { fetchParcels } from '../services/api';
import { featureCollectionToLandParcels } from '../utils/geoAdapter';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Route,
  ArrowLeft,
  Save,
  RotateCcw,
  Trash2,
  Check,
  X,
  MapPin,
  Compass,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  Layers,
  Building2,
  Users
} from 'lucide-react';

export const ProjectRoutePage: React.FC = () => {
  const {
    activeProject,
    projects,
    setCurrentPage,
    updateProjectRoute,
    parcels,
    selectedParcelId,
    setSelectedParcelId,
    navigateToParcelInGis
  } = useApp();

  // Route Editing State
  const [waypoints, setWaypoints] = useState<[number, number][]>(
    activeProject?.routeWaypoints || [
      [12.8440, 74.9350],
      [12.8465, 74.9395],
      [12.8490, 74.9440],
      [12.8520, 74.9485],
      [12.8550, 74.9530],
      [12.8580, 74.9575]
    ]
  );
  const [rowWidthM, setRowWidthM] = useState<number>(activeProject?.rowWidthM || 60);
  const [routeStatus, setRouteStatus] = useState<'Draft' | 'Proposed' | 'Under Review' | 'Approved'>(
    activeProject?.routeStatus || 'Proposed'
  );
  const [isDrawMode, setIsDrawMode] = useState<boolean>(false);
  const [affectedParcels, setAffectedParcels] = useState<LandParcel[]>([]);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [projectParcels, setProjectParcels] = useState<LandParcel[]>([]);

  // Keep state synced if activeProject changes
  useEffect(() => {
    if (activeProject) {
      if (activeProject.routeWaypoints && activeProject.routeWaypoints.length > 0) {
        setWaypoints(activeProject.routeWaypoints);
      }
      if (activeProject.rowWidthM) {
        setRowWidthM(activeProject.rowWidthM);
      }
      if (activeProject.routeStatus) {
        setRouteStatus(activeProject.routeStatus);
      }
    }
  }, [activeProject]);

  // Load exact parcels for activeProject from MongoDB parcel API
  useEffect(() => {
    if (!activeProject) return;

    let cancelled = false;

    const loadParcelsForProject = async () => {
      try {
        const fc = await fetchParcels({
          district: activeProject.district
        });
        const adapted = featureCollectionToLandParcels(fc);

        if (cancelled) return;

        if (activeProject.selectedParcelIds && activeProject.selectedParcelIds.length > 0) {
          const selectedSet = new Set(activeProject.selectedParcelIds);
          const matched = adapted.filter(p => selectedSet.has(p.parcelId));
          setProjectParcels(matched.length > 0 ? matched : adapted);
        } else {
          setProjectParcels(adapted);
        }
      } catch (err) {
        console.warn('[ProjectRoutePage] Could not load district parcels from API:', err);
        if (!cancelled) {
          if (activeProject.selectedParcelIds && activeProject.selectedParcelIds.length > 0) {
            const selectedSet = new Set(activeProject.selectedParcelIds);
            const matched = parcels.filter(p => selectedSet.has(p.parcelId));
            setProjectParcels(matched.length > 0 ? matched : parcels);
          } else {
            setProjectParcels(parcels);
          }
        }
      }
    };

    void loadParcelsForProject();

    return () => {
      cancelled = true;
    };
  }, [activeProject, parcels]);

  // Empty State if no project is selected
  if (!activeProject) {
    return (
      <div className="page-body">
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--gov-slate-200)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>No Project Selected for Route View</h2>
          <p style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginTop: '8px', marginBottom: '20px' }}>
            Please select a land acquisition project from the Projects Directory to view or edit its proposed alignment.
          </p>
          <button className="gov-btn gov-btn-primary" onClick={() => setCurrentPage('projects')}>
            <ArrowLeft size={14} /> Go to Projects Directory
          </button>
        </div>
      </div>
    );
  }

  const calculatedLengthKm = calculateTotalRouteLengthKm(waypoints);
  const totalAffectedExtentAcres = affectedParcels.reduce((acc, p) => acc + p.areaAcres, 0);

  // Group affected parcels by village
  const villageImpactMap: { [village: string]: { parcelsCount: number; extentAcres: number; taluk: string; district: string } } = {};
  affectedParcels.forEach((p) => {
    if (!villageImpactMap[p.village]) {
      villageImpactMap[p.village] = { parcelsCount: 0, extentAcres: 0, taluk: p.taluk, district: p.district };
    }
    villageImpactMap[p.village].parcelsCount += 1;
    villageImpactMap[p.village].extentAcres += p.areaAcres;
  });

  const handleSaveRoute = () => {
    updateProjectRoute(activeProject.id, {
      routeWaypoints: waypoints,
      proposedLengthKm: calculatedLengthKm,
      routeLengthKm: calculatedLengthKm,
      rowWidthM,
      routeStatus,
      selectedParcelIds: activeProject.selectedParcelIds
    });

    setIsDrawMode(false);
    setSaveSuccessMessage('Project route alignment successfully updated and saved to project record.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleUndoPoint = () => {
    if (waypoints.length === 0) return;
    setWaypoints(waypoints.slice(0, waypoints.length - 1));
  };

  const handleClearRoute = () => {
    if (window.confirm('Are you sure you want to clear all waypoints from this proposed route alignment?')) {
      setWaypoints([]);
    }
  };

  return (
    <div className="page-body">
      {/* Top Header Navigation & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <button
          className="gov-btn gov-btn-secondary gov-btn-sm"
          onClick={() => setCurrentPage('project-detail')}
        >
          <ArrowLeft size={13} /> Back to Project Detail
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className="gov-btn gov-btn-primary"
            onClick={() => setCurrentPage('gis-parcels')}
            style={{ backgroundColor: 'var(--gov-navy-800)' }}
          >
            <ExternalLink size={13} /> OPEN GIS PARCEL VIEW
          </button>
        </div>
      </div>

      {/* Route Header Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--gov-slate-200)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--gov-slate-100)', padding: '2px 8px', borderRadius: '4px' }}>
              {activeProject.code}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-purple-700)', backgroundColor: 'var(--gov-purple-50)', border: '1px solid var(--gov-purple-100)', padding: '2px 8px', borderRadius: '4px' }}>
              ALIGNMENT WORKBENCH
            </span>
            <StatusBadge status={routeStatus} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
            {activeProject.routeName || `${activeProject.name} Proposed Alignment`}
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginTop: '2px' }}>
            Start: <strong>{activeProject.startLocation || 'KUMBALGODU JUNCTION'}</strong> → End: <strong>{activeProject.endLocation || 'NIDAGHATTA BYPASS'}</strong>
          </div>
        </div>

        {/* Dynamic Metric Stats in Header */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right', borderRight: '1px solid var(--gov-slate-200)', paddingRight: '16px' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)', textTransform: 'uppercase', fontWeight: 600 }}>Calculated Length</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-blue-700)' }}>{calculatedLengthKm} km</div>
          </div>
          <div style={{ textAlign: 'right', borderRight: '1px solid var(--gov-slate-200)', paddingRight: '16px' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)', textTransform: 'uppercase', fontWeight: 600 }}>ROW Corridor</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-purple-700)' }}>{rowWidthM} meters</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)', textTransform: 'uppercase', fontWeight: 600 }}>Affected Parcels</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-amber-700)' }}>{affectedParcels.length} Parcels</div>
          </div>
        </div>
      </div>

      {/* Notification Message */}
      {saveSuccessMessage && (
        <div
          style={{
            backgroundColor: 'var(--gov-green-50)',
            border: '1px solid var(--gov-green-200)',
            color: 'var(--gov-green-800)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Check size={16} /> {saveSuccessMessage}
        </div>
      )}

      {/* Main Map & Editing Controls Section */}
      <div className="gov-card" style={{ padding: '16px' }}>
        {/* Route Control Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--gov-slate-200)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className={`gov-btn ${isDrawMode ? 'gov-btn-primary' : 'gov-btn-secondary'}`}
              style={{ backgroundColor: isDrawMode ? '#2563eb' : undefined }}
              onClick={() => setIsDrawMode(!isDrawMode)}
            >
              <Route size={14} /> {isDrawMode ? 'FINISH DRAWING' : 'DRAW / EDIT ALIGNMENT'}
            </button>

            {isDrawMode && (
              <>
                <button
                  className="gov-btn gov-btn-secondary gov-btn-sm"
                  onClick={handleUndoPoint}
                  disabled={waypoints.length === 0}
                >
                  <RotateCcw size={12} /> Undo Point
                </button>
                <button
                  className="gov-btn gov-btn-secondary gov-btn-sm"
                  onClick={handleClearRoute}
                  disabled={waypoints.length === 0}
                  style={{ color: 'var(--gov-red-700)' }}
                >
                  <Trash2 size={12} /> Clear Route
                </button>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--gov-slate-700)' }}>ROW Width:</span>
              <select
                className="gov-select"
                style={{ width: '100px', fontSize: '12px' }}
                value={rowWidthM}
                onChange={(e) => setRowWidthM(Number(e.target.value))}
              >
                <option value={30}>30m ROW</option>
                <option value={45}>45m ROW</option>
                <option value={60}>60m ROW</option>
                <option value={75}>75m ROW</option>
                <option value={100}>100m ROW</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--gov-slate-700)' }}>Alignment Status:</span>
              <select
                className="gov-select"
                style={{ width: '130px', fontSize: '12px' }}
                value={routeStatus}
                onChange={(e) => setRouteStatus(e.target.value as any)}
              >
                <option value="Draft">Draft</option>
                <option value="Proposed">Proposed</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="gov-btn gov-btn-primary"
              style={{ backgroundColor: 'var(--gov-green-700)' }}
              onClick={handleSaveRoute}
            >
              <Save size={14} /> SAVE ROUTE ALIGNMENT
            </button>
          </div>
        </div>

        {/* Leaflet Project Route Map */}
        <ProjectRouteMap
          waypoints={waypoints}
          onWaypointsChange={setWaypoints}
          rowWidthM={rowWidthM}
          isDrawMode={isDrawMode}
          onToggleDrawMode={setIsDrawMode}
          parcels={projectParcels.length > 0 ? projectParcels : parcels}
          selectedParcelId={selectedParcelId}
          onSelectParcel={setSelectedParcelId}
          onAffectedParcelsCalculated={setAffectedParcels}
          height="520px"
        />

        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--gov-slate-500)', fontStyle: 'italic' }}>
          * Disclaimer: The proposed alignment polyline and Right of Way (ROW) buffer corridor are preliminary administrative representations for land identification and joint survey planning.
        </div>
      </div>

      {/* Two Column Impact Analysis Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
        {/* Intersecting Cadastral Parcels Table */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <MapPin size={16} color="var(--gov-amber-700)" />
              <span>Cadastral Parcels Intersecting Proposed ROW Corridor ({affectedParcels.length})</span>
            </div>
            <button
              className="gov-btn gov-btn-secondary gov-btn-sm"
              onClick={() => alert('Exporting affected parcel survey schedule...')}
            >
              Export Schedule
            </button>
          </div>

          <div className="table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Survey Number</th>
                  <th>Village & Taluk</th>
                  <th style={{ textAlign: 'right' }}>Total Extent</th>
                  <th>Land Type</th>
                  <th>Owner / Khatadar</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {affectedParcels.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--gov-slate-500)' }}>
                      No cadastral parcels currently intersect the proposed route alignment and buffer corridor.
                    </td>
                  </tr>
                ) : (
                  affectedParcels.map((p) => {
                    const isSelected = p.parcelId === selectedParcelId;
                    return (
                      <tr
                        key={p.parcelId}
                        style={{ backgroundColor: isSelected ? 'var(--gov-blue-50)' : undefined }}
                        className="clickable"
                        onClick={() => setSelectedParcelId(p.parcelId)}
                      >
                        <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Sy. No. {p.surveyNumber}</td>
                        <td>{p.village}, {p.taluk}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{p.areaAcres} ac</td>
                        <td>{p.landType}</td>
                        <td>{p.ownerName}</td>
                        <td><StatusBadge status={p.acquisitionStatus} size="sm" /></td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="gov-btn gov-btn-secondary gov-btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToParcelInGis(p.parcelId);
                            }}
                          >
                            GIS View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Impact Summary Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Summary Box */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Compass size={16} color="var(--gov-navy-900)" />
                <span>Corridor Impact Summary</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Route Length:</span>
                <span style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{calculatedLengthKm} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Right of Way Width:</span>
                <span style={{ fontWeight: 700, color: 'var(--gov-purple-700)' }}>{rowWidthM} meters</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Intersecting Parcels:</span>
                <span style={{ fontWeight: 700, color: 'var(--gov-amber-700)' }}>{affectedParcels.length} Parcels</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Est. Total Land Extent:</span>
                <span style={{ fontWeight: 700, color: 'var(--gov-green-700)' }}>{totalAffectedExtentAcres.toFixed(2)} Acres</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Affected Revenue Villages:</span>
                <span style={{ fontWeight: 600 }}>{Object.keys(villageImpactMap).length} Villages</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Est. Affected Families:</span>
                <span style={{ fontWeight: 600 }}>{activeProject.affectedFamiliesCount} Families</span>
              </div>
            </div>
          </div>

          {/* Intersected Revenue Villages Box */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Building2 size={16} color="var(--gov-blue-600)" />
                <span>Intersected Villages</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
              {Object.keys(villageImpactMap).length === 0 ? (
                <div style={{ color: 'var(--gov-slate-500)', fontSize: '11px', textAlign: 'center', padding: '12px' }}>
                  No villages intersected
                </div>
              ) : (
                Object.entries(villageImpactMap).map(([vName, info]) => (
                  <div
                    key={vName}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--gov-slate-50)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--gov-slate-200)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{vName}</div>
                      <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)' }}>{info.taluk}, {info.district}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gov-blue-700)' }}>{info.parcelsCount} Parcels</div>
                      <div style={{ fontSize: '10px', color: 'var(--gov-slate-600)' }}>{info.extentAcres.toFixed(1)} ac</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRoutePage;
