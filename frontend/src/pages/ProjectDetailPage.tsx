import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  MapPin,
  GitBranch,
  IndianRupee,
  Users,
  FileText,
  ArrowLeft,
  ChevronRight,
  Route,
  Building2,
  CheckCircle2,
  Clock,
  Layers,
  Compass,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const {
    activeProject,
    setCurrentPage,
    openProjectRoute,
    navigateToParcelInGis,
    parcels,
    compensationRecords,
    affectedFamilies,
    documents,
    canPerform
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'proposal' | 'timeline' | 'villages' | 'compensation' | 'rr' | 'documents'>('overview');

  // Filter project-specific entities safely (always before returns)
  const projectParcels = activeProject ? parcels.filter(p => p.projectId === activeProject.id) : [];
  const projectCompRecords = activeProject ? compensationRecords.filter(c => c.projectId === activeProject.id) : [];
  const projectFamilies = activeProject ? affectedFamilies.filter(f => f.projectId === activeProject.id) : [];
  const projectDocuments = activeProject ? documents.filter(d => d.projectId === activeProject.id) : [];

  if (!activeProject) {
    return (
      <div className="page-body">
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--gov-slate-200)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>No Project Selected</h2>
          <p style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginTop: '8px', marginBottom: '20px' }}>
            Please select a land acquisition project from the Projects Directory.
          </p>
          <button className="gov-btn gov-btn-primary" onClick={() => setCurrentPage('projects')}>
            <ArrowLeft size={14} /> Go to Projects Directory
          </button>
        </div>
      </div>
    );
  }

  // Acquisition Lifecycle Stages
  const lifecycleStages = [
    { key: 'Proposal', label: '1. Project Proposal' },
    { key: 'Route', label: '2. Route / Alignment' },
    { key: 'LandID', label: '3. Land Identification' },
    { key: 'Survey', label: '4. Survey' },
    { key: 'Notification', label: '5. Notification' },
    { key: 'Compensation', label: '6. Compensation' },
    { key: 'Possession', label: '7. Possession' },
    { key: 'RR', label: '8. R&R / Rehabilitation' }
  ];

  return (
    <div className="page-body">
      {/* Top Back Nav & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <button
          className="gov-btn gov-btn-secondary gov-btn-sm"
          onClick={() => setCurrentPage('projects')}
        >
          <ArrowLeft size={13} /> Back to Projects Directory
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="gov-btn gov-btn-primary"
            onClick={() => openProjectRoute(activeProject.id)}
            style={{ backgroundColor: 'var(--gov-blue-700)' }}
          >
            <Route size={14} /> {canPerform('project_update') ? 'DRAW / EDIT ROUTE' : 'VIEW ROUTE'}
          </button>
          <button
            className="gov-btn gov-btn-secondary"
            onClick={() => setCurrentPage('gis-parcels')}
          >
            <MapPin size={13} /> GIS Parcel View
          </button>
          <button
            className="gov-btn gov-btn-secondary"
            onClick={() => setCurrentPage('workflow')}
          >
            <GitBranch size={13} /> Workflow Actions
          </button>
        </div>
      </div>

      {/* Project Hero / Workspace Card */}
      <div className="gov-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: 'var(--gov-slate-100)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--gov-slate-300)'
                }}
              >
                {activeProject.code}
              </span>
              <StatusBadge status={activeProject.status} />
              <RiskBadge score={activeProject.riskScore} level={activeProject.riskLevel} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
              {activeProject.name}
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginTop: '4px', maxWidth: '850px' }}>
              {activeProject.description}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--gov-slate-50)',
              border: '1px solid var(--gov-slate-200)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              minWidth: '220px',
              fontSize: '11.5px'
            }}
          >
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}>
              Statutory Stage & Risk Profile
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-blue-700)', marginTop: '2px' }}>
              Stage: {activeProject.currentStage}
            </div>
            <div style={{ color: 'var(--gov-slate-600)', marginTop: '4px' }}>
              Acquisition Progress: <strong>{activeProject.progressPercentage}%</strong> ({activeProject.landAcquiredAcres} / {activeProject.landRequiredAcres} ac)
            </div>
          </div>
        </div>

        {/* Administrative Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--gov-slate-200)',
            fontSize: '11.5px'
          }}
        >
          <div>
            <span style={{ color: 'var(--gov-slate-500)', display: 'block', fontSize: '10.5px' }}>Parent Authority:</span>
            <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{activeProject.parentAuthority || activeProject.department}</div>
          </div>
          <div>
            <span style={{ color: 'var(--gov-slate-500)', display: 'block', fontSize: '10.5px' }}>Department:</span>
            <div style={{ fontWeight: 600 }}>{activeProject.department}</div>
          </div>
          <div>
            <span style={{ color: 'var(--gov-slate-500)', display: 'block', fontSize: '10.5px' }}>Agency Name & Type:</span>
            <div style={{ fontWeight: 600 }}>{activeProject.agencyName || activeProject.implementingAgency}</div>
            <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)' }}>{activeProject.agencyType || 'Implementing Agency'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--gov-slate-500)', display: 'block', fontSize: '10.5px' }}>State & District:</span>
            <div style={{ fontWeight: 600 }}>{activeProject.state} · {activeProject.district}</div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="gov-tabs">
        <button
          className={`gov-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Key Metrics
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'proposal' ? 'active' : ''}`}
          onClick={() => setActiveTab('proposal')}
        >
          Proposal & Alignment Specs
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Acquisition Lifecycle ({activeProject.stages.length})
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'villages' ? 'active' : ''}`}
          onClick={() => setActiveTab('villages')}
        >
          Villages & Parcels ({activeProject.villages.length} Villages)
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'compensation' ? 'active' : ''}`}
          onClick={() => setActiveTab('compensation')}
        >
          Compensation (₹{activeProject.totalCompensationAssessedCr} Cr)
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'rr' ? 'active' : ''}`}
          onClick={() => setActiveTab('rr')}
        >
          R&R & Families ({activeProject.affectedFamiliesCount})
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents ({projectDocuments.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 8 KPI Cards */}
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <MetricCard
              label="Land Required"
              value={`${activeProject.landRequiredAcres} Acres`}
              subtext="Total Project Alignment Extent"
            />
            <MetricCard
              label="Land Acquired"
              value={`${activeProject.landAcquiredAcres} Acres`}
              subtext={`${activeProject.progressPercentage}% Extent Possessed`}
              highlight
            />
            <MetricCard
              label="Acquisition Progress"
              value={`${activeProject.progressPercentage}%`}
              subtext="Overall Milestone Completion"
            />
            <MetricCard
              label="Total Parcels"
              value={projectParcels.length > 0 ? projectParcels.length : activeProject.villages.reduce((acc, v) => acc + v.totalParcels, 0)}
              subtext="Cadastral Survey Numbers"
            />
            <MetricCard
              label="Affected Families"
              value={activeProject.affectedFamiliesCount}
              subtext={`${activeProject.displacedFamiliesCount} Physically Displaced`}
            />
            <MetricCard
              label="Compensation Assessed"
              value={`₹${activeProject.totalCompensationAssessedCr} Cr`}
              subtext="Statutory Award Value"
            />
            <MetricCard
              label="Compensation Paid"
              value={`₹${activeProject.totalCompensationPaidCr} Cr`}
              subtext={`${((activeProject.totalCompensationPaidCr / activeProject.totalCompensationAssessedCr) * 100).toFixed(1)}% Disbursed`}
            />
            <MetricCard
              label="Project Progress Score"
              value={`${(100 - activeProject.riskScore)} / 100`}
              subtext={`Risk Level: ${activeProject.riskLevel}`}
            />
          </div>

          {/* Revenue Village Progress Table */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <MapPin size={16} color="var(--gov-navy-900)" />
                <span>Village Acquisition Progress Summary</span>
              </div>
              <button className="gov-btn gov-btn-primary gov-btn-sm" onClick={() => openProjectRoute(activeProject.id)}>
                <Route size={12} /> View Project Route Map
              </button>
            </div>
            <div className="table-container">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Village Name</th>
                    <th>Taluk</th>
                    <th>District</th>
                    <th style={{ textAlign: 'center' }}>Total Parcels</th>
                    <th style={{ textAlign: 'right' }}>Total Extent</th>
                    <th style={{ textAlign: 'right' }}>Acquired Extent</th>
                    <th style={{ textAlign: 'center' }}>Progress %</th>
                    <th style={{ textAlign: 'center' }}>Affected Families</th>
                    <th style={{ textAlign: 'right' }}>Comp. Disbursed (Cr)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProject.villages.map((v) => (
                    <tr key={v.villageName}>
                      <td style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{v.villageName}</td>
                      <td>{v.taluk}</td>
                      <td>{v.district}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{v.totalParcels}</td>
                      <td style={{ textAlign: 'right' }}>{v.totalAcres} ac</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gov-green-700)' }}>
                        {v.acquiredAcres} ac
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                          <div style={{ width: '40px', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${v.acquiredPercentage}%`, height: '100%', backgroundColor: 'var(--gov-blue-600)' }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>{v.acquiredPercentage}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{v.affectedFamilies}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{v.compensationDisbursedCr} Cr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPOSAL & ALIGNMENT */}
      {activeTab === 'proposal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Action Header Card */}
          <div
            style={{
              backgroundColor: 'var(--gov-navy-900)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gov-gold-400)', fontWeight: 700 }}>
                Alignment & Corridor Technical Specifications
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>
                {activeProject.routeName || activeProject.name}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--gov-slate-300)', marginTop: '4px' }}>
                Start: <strong>{activeProject.startLocation || 'KUMBALGODU JUNCTION'}</strong> → End: <strong>{activeProject.endLocation || 'NIDAGHATTA BYPASS'}</strong>
              </p>
            </div>

            <button
              className="gov-btn"
              style={{
                backgroundColor: 'var(--gov-gold-500)',
                color: 'var(--gov-navy-950)',
                fontWeight: 700,
                fontSize: '13px',
                padding: '10px 18px',
                border: 'none',
                boxShadow: 'var(--shadow-md)'
              }}
              onClick={() => openProjectRoute(activeProject.id)}
            >
              <Route size={16} /> {canPerform('project_update') ? 'DRAW / EDIT ROUTE ALIGNMENT' : 'VIEW ROUTE ALIGNMENT'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Administrative Specifications Card */}
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="gov-card-title">
                  <Building2 size={16} color="var(--gov-navy-900)" />
                  <span>Administrative Authority & Classification</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Project Category / Type:</span>
                  <span style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{activeProject.projectType || 'Highway Expansion'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Parent Authority:</span>
                  <span style={{ fontWeight: 600 }}>{activeProject.parentAuthority || activeProject.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Department:</span>
                  <span style={{ fontWeight: 600 }}>{activeProject.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Implementing Agency (PIA):</span>
                  <span style={{ fontWeight: 600 }}>{activeProject.agencyName || activeProject.implementingAgency}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Agency Category:</span>
                  <span style={{ fontWeight: 600 }}>{activeProject.agencyType || 'Autonomous Central Authority'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Highway Classification:</span>
                  <span style={{ fontWeight: 700, color: 'var(--gov-blue-700)' }}>{activeProject.highwayClassification || 'National Expressway (NE-7)'}</span>
                </div>
              </div>
            </div>

            {/* Highway Engineering Parameters Card */}
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="gov-card-title">
                  <Layers size={16} color="var(--gov-blue-600)" />
                  <span>Highway Cross-Section Specifications</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Proposed Length:</span>
                  <span style={{ fontWeight: 700 }}>{activeProject.proposedLengthKm || 56.3} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Right of Way (ROW) Width:</span>
                  <span style={{ fontWeight: 700, color: 'var(--gov-green-700)' }}>{activeProject.rowWidthM || 60} meters</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Number of Lanes:</span>
                  <span style={{ fontWeight: 600 }}>{activeProject.lanes || 10} Lanes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Carriageway Width:</span>
                  <span style={{ fontWeight: 600 }}>{activeProject.carriagewayWidthM || 35.0} meters</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gov-slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Median Width:</span>
                  <span style={{ fontWeight: 600 }}>{activeProject.medianWidthM || 5.0} meters</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gov-slate-600)' }}>Service Roads Provision:</span>
                  <span style={{ fontWeight: 700, color: 'var(--gov-green-700)' }}>{activeProject.serviceRoads !== false ? 'Yes (2-Lane Dual Side)' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Structures & Notes */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Compass size={16} color="var(--gov-navy-900)" />
                <span>Major Structures & Technical Notes</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{activeProject.technicalNotes?.structures || 42}</div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>Culverts / Structures</div>
              </div>
              <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{activeProject.technicalNotes?.bridges || 8}</div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>Major Bridges</div>
              </div>
              <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{activeProject.technicalNotes?.interchanges || 4}</div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>Trumpet Interchanges</div>
              </div>
              <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{activeProject.technicalNotes?.flyovers || 12}</div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>Flyovers / VUPs</div>
              </div>
              <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{activeProject.technicalNotes?.railwayCrossings || 2}</div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>ROB / Railway Overbridges</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gov-slate-700)', backgroundColor: 'var(--gov-blue-50)', padding: '12px', borderRadius: '4px', border: '1px solid var(--gov-blue-100)' }}>
              <strong>General Engineering Notes:</strong> {activeProject.technicalNotes?.generalNotes || activeProject.projectPurpose || 'Includes 6-lane main carriageway + 2-lane service roads on both sides with high-speed grade separation.'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <GitBranch size={16} color="var(--gov-blue-600)" />
              <span>Complete Statutory Stage Audit</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeProject.stages.map((stageItem, index) => (
              <div
                key={stageItem.stage}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: stageItem.status === 'In Progress' ? 'var(--gov-blue-50)' : '#ffffff',
                  border: `1px solid ${stageItem.status === 'In Progress' ? 'var(--gov-blue-100)' : 'var(--gov-slate-200)'}`
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: stageItem.status === 'Completed' ? 'var(--gov-green-600)' : stageItem.status === 'In Progress' ? 'var(--gov-blue-600)' : 'var(--gov-slate-200)',
                    color: stageItem.status === 'Pending' ? 'var(--gov-slate-600)' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}
                >
                  {stageItem.status === 'Completed' ? '✓' : index + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                      Stage {index + 1}: {stageItem.stage}
                    </div>
                    <StatusBadge status={stageItem.status} />
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--gov-slate-700)', marginTop: '4px' }}>
                    {stageItem.notes}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginTop: '8px',
                      fontSize: '11px',
                      color: 'var(--gov-slate-500)'
                    }}
                  >
                    <span>
                      <strong>Authority:</strong> {stageItem.responsibleAuthority}
                    </span>
                    <span>
                      <strong>Target Date:</strong> {stageItem.targetDate}
                    </span>
                    {stageItem.completedDate && (
                      <span style={{ color: 'var(--gov-green-700)' }}>
                        <strong>Completed On:</strong> {stageItem.completedDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VILLAGES & PARCELS */}
      {activeTab === 'villages' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <MapPin size={16} color="var(--gov-navy-900)" />
              <span>Survey Parcels under this Alignment</span>
            </div>
            <button className="gov-btn gov-btn-primary gov-btn-sm" onClick={() => setCurrentPage('gis-parcels')}>
              Open Cadastral GIS View <ExternalLink size={12} />
            </button>
          </div>
          <div className="table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Survey Number</th>
                  <th>Village & Taluk</th>
                  <th style={{ textAlign: 'right' }}>Extent (Acres)</th>
                  <th>Classification</th>
                  <th>Registered Khatadar</th>
                  <th>Acquisition Status</th>
                  <th style={{ textAlign: 'right' }}>Assessed Compensation</th>
                  <th>Payment</th>
                  <th>Possession</th>
                </tr>
              </thead>
              <tbody>
                {projectParcels.map((p) => (
                  <tr key={p.parcelId}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Sy. No. {p.surveyNumber}</td>
                    <td>{p.village}, {p.taluk}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{p.areaAcres} ac</td>
                    <td>{p.landType}</td>
                    <td>{p.ownerName}</td>
                    <td><StatusBadge status={p.acquisitionStatus} /></td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{(p.compensationAmount / 100000).toFixed(2)} Lakh</td>
                    <td><StatusBadge status={p.compensationStatus} size="sm" /></td>
                    <td style={{ fontWeight: 600, color: p.possessionStatus === 'Taken' ? 'var(--gov-green-700)' : 'var(--gov-amber-700)' }}>
                      {p.possessionStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: COMPENSATION */}
      {activeTab === 'compensation' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <IndianRupee size={16} color="var(--gov-navy-900)" />
              <span>Compensation Ledger & Disbursal Records</span>
            </div>
          </div>
          <div className="table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Survey No.</th>
                  <th>Beneficiary / Khatadar</th>
                  <th>Bank Account</th>
                  <th style={{ textAlign: 'right' }}>Assessed Amount</th>
                  <th style={{ textAlign: 'right' }}>Paid Amount</th>
                  <th style={{ textAlign: 'right' }}>Pending Amount</th>
                  <th>Payment Status</th>
                  <th>Award Reference</th>
                </tr>
              </thead>
              <tbody>
                {projectCompRecords.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>Sy. No. {c.surveyNumber}</td>
                    <td style={{ fontWeight: 600 }}>{c.ownerBeneficiary}</td>
                    <td style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                      {c.bankAccountMasked} ({c.ifscCode})
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{(c.assessedAmount / 100000).toFixed(2)} L</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gov-green-700)' }}>₹{(c.paidAmount / 100000).toFixed(2)} L</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gov-amber-700)' }}>₹{(c.pendingAmount / 100000).toFixed(2)} L</td>
                    <td><StatusBadge status={c.paymentStatus} size="sm" /></td>
                    <td style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>{c.awardOrderNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: R&R */}
      {activeTab === 'rr' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Users size={16} color="var(--gov-navy-900)" />
              <span>Project Affected Families (PAF) & R&R Status</span>
            </div>
          </div>
          <div className="table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Family ID</th>
                  <th>Head of Family</th>
                  <th>Village & Sy. No.</th>
                  <th style={{ textAlign: 'center' }}>Members</th>
                  <th>Tenure Category</th>
                  <th>Displaced</th>
                  <th>R&R Status</th>
                  <th>Resettlement Allotment</th>
                </tr>
              </thead>
              <tbody>
                {projectFamilies.map((f) => (
                  <tr key={f.familyId}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{f.familyId}</td>
                    <td style={{ fontWeight: 600 }}>{f.headOfFamily}</td>
                    <td>{f.village} (Sy. {f.surveyNumber})</td>
                    <td style={{ textAlign: 'center' }}>{f.familyMembersCount}</td>
                    <td>{f.affectedType}</td>
                    <td style={{ fontWeight: 600, color: f.isDisplaced ? 'var(--gov-red-700)' : 'var(--gov-slate-600)' }}>
                      {f.isDisplaced ? 'Yes (Displaced)' : 'No'}
                    </td>
                    <td><StatusBadge status={f.rrStatus} size="sm" /></td>
                    <td style={{ fontSize: '11px' }}>{f.resettlementSiteName ? `${f.resettlementSiteName} (${f.plotAllotted})` : 'In Situ / Cash Compensation'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <FileText size={16} color="var(--gov-navy-900)" />
              <span>Statutory Gazette Notifications & DPR Records</span>
            </div>
          </div>
          <div className="table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Category</th>
                  <th>Version</th>
                  <th>Uploaded By</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projectDocuments.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{d.documentName}</td>
                    <td>{d.category}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>v{d.version}</td>
                    <td>{d.uploadedBy}</td>
                    <td style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>{d.uploadedDate}</td>
                    <td><StatusBadge status={d.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
