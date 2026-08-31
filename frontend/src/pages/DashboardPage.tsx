import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import { LeafletGisMap } from '../components/gis/LeafletGisMap';
import {
  FolderKanban,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  IndianRupee,
  Users,
  ChevronRight,
  ArrowUpRight,
  FileCheck2,
  Check
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    projects,
    parcels,
    alerts,
    navigateToProject,
    navigateToParcelInGis,
    selectedJurisdictionName,
    setCurrentPage
  } = useApp();

  const openAlerts = alerts.filter(a => a.status === 'Open');

  return (
    <div className="page-body">
      {/* Top Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Land Acquisition Dashboard</h1>
          <p className="page-subtitle">
            Monitor acquisition progress across projects, districts and land parcels · Jurisdiction: {selectedJurisdictionName}
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="gov-btn gov-btn-secondary"
            onClick={() => setCurrentPage('gis-parcels')}
          >
            <MapPin size={15} />
            <span>Full GIS Cadastre</span>
          </button>
          <button
            className="gov-btn gov-btn-primary"
            onClick={() => setCurrentPage('projects')}
          >
            <FolderKanban size={15} />
            <span>All Projects ({projects.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="kpi-grid">
        <MetricCard
          label="Total Projects"
          value="128"
          subtext="6 Active in this Zone"
          icon={<FolderKanban size={16} />}
          highlight
        />
        <MetricCard
          label="Land Proposed"
          value="2.8M acres"
          subtext="3,240 Acres in Pipeline"
          icon={<MapPin size={16} />}
        />
        <MetricCard
          label="Land Acquired"
          value="1.9M acres"
          subtext="2,146 Acres Possessed"
          icon={<CheckCircle2 size={16} />}
        />
        <MetricCard
          label="Acquisition Progress"
          value="68%"
          subtext="+4.2% from last quarter"
          icon={<FileCheck2 size={16} />}
        />
        <MetricCard
          label="Compensation Assessed"
          value="₹12,480 Cr"
          subtext="₹1,283 Cr in Active Projects"
          icon={<IndianRupee size={16} />}
        />
        <MetricCard
          label="Compensation Paid"
          value="₹9,860 Cr"
          subtext="79.0% Payout Rate (DBT)"
          icon={<IndianRupee size={16} />}
        />
        <MetricCard
          label="Affected Families"
          value="48,200"
          subtext="1,222 Identified in Zone"
          icon={<Users size={16} />}
        />
        <MetricCard
          label="R&R Completed"
          value="78%"
          subtext="168 Colonies Handed Over"
          icon={<CheckCircle2 size={16} />}
        />
      </div>

      {/* Project Progress Lifecycle Stages Bar */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <div className="gov-card-title-icon blue">
              <FileCheck2 size={16} />
            </div>
            <div>
              <span>Land Acquisition Lifecycle Overview</span>
              <span className="gov-card-title-sub">
                RFCTLARR 2013 & NH Act Statutory Pipeline
              </span>
            </div>
          </div>
          <button
            className="gov-btn gov-btn-secondary gov-btn-sm"
            onClick={() => setCurrentPage('workflow')}
          >
            <span>Workflow Manager</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="workflow-stepper">
          {[
            { name: 'Proposed', count: '128 Proj', status: 'completed' },
            { name: 'Verified', count: '114 Proj', status: 'completed' },
            { name: 'Approved', count: '98 Proj', status: 'completed' },
            { name: 'Notified', count: '84 Proj', status: 'completed' },
            { name: 'Awarded', count: '62 Proj', status: 'completed' },
            { name: 'Compensation', count: '46 Proj', status: 'active' },
            { name: 'Possession', count: '38 Proj', status: 'pending' },
            { name: 'R&R', count: '29 Proj', status: 'pending' },
            { name: 'Completed', count: '22 Proj', status: 'pending' }
          ].map((stage, idx) => (
            <div key={stage.name} className={`workflow-step ${stage.status}`}>
              <div className="workflow-step-line" />
              <div className="workflow-step-node">
                {stage.status === 'completed' ? (
                  <Check size={14} strokeWidth={2.6} />
                ) : (
                  idx + 1
                )}
              </div>
              <div className="workflow-step-label">{stage.name}</div>
              <div className="workflow-step-status">{stage.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mid Section: GIS Map Preview & Alerts Attention Required */}
      <div className="dashboard-mid-grid">
        {/* GIS Map Preview */}
        <div className="gov-card gis-preview-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <div className="gov-card-title-icon blue">
                <MapPin size={16} />
              </div>
              <span>GIS Cadastral Spatial Preview</span>
            </div>
            <button
              className="gov-btn gov-btn-secondary gov-btn-sm"
              onClick={() => setCurrentPage('gis-parcels')}
            >
              <span>Open Full GIS</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="gis-preview-map-box">
            <LeafletGisMap
              parcels={parcels}
              selectedParcelId={null}
              onSelectParcel={(id) => navigateToParcelInGis(id)}
              height="320px"
              showLegend={false}
              showLayerToggle={false}
            />
          </div>
          <div className="gis-preview-footer">
            <span className="gis-preview-caption">
              Cadastral survey boundary spatial viewer
            </span>
            <span className="gis-preview-badge">
              Click any parcel to inspect
            </span>
          </div>
        </div>

        {/* Operational Attention Required Panel */}
        <div className="gov-card alerts-preview-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <div className="gov-card-title-icon amber">
                <AlertTriangle size={16} />
              </div>
              <span>Attention Required ({openAlerts.length} Action Items)</span>
            </div>
            <button
              className="gov-btn gov-btn-secondary gov-btn-sm"
              onClick={() => setCurrentPage('alerts')}
            >
              <span>All Alerts</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="alert-feed">
            {openAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`alert-item ${alert.category}`}
                onClick={() => {
                  if (alert.parcelId) navigateToParcelInGis(alert.parcelId);
                  else navigateToProject(alert.projectId);
                }}
              >
                <div className="alert-item-icon">
                  {alert.category === 'Critical' && <AlertCircle size={16} color="var(--gov-red-600)" />}
                  {alert.category === 'Warning' && <AlertTriangle size={16} color="var(--gov-amber-600)" />}
                  {alert.category === 'Information' && <FileCheck2 size={16} color="var(--gov-blue-600)" />}
                </div>
                <div className="alert-item-content">
                  <div className="alert-item-title">
                    {alert.title}
                  </div>
                  <div className="alert-item-sub">
                    <span>{alert.projectName}</span>
                    <span className="alert-sub-sep">·</span>
                    <span>{alert.assignedOfficerRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Status Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <div className="gov-card-title-icon navy">
              <FolderKanban size={16} />
            </div>
            <span>Infrastructure Projects Status Matrix</span>
          </div>
          <button
            className="gov-btn gov-btn-secondary gov-btn-sm"
            onClick={() => setCurrentPage('projects')}
          >
            <span>Manage Projects</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project Code & Name</th>
                <th>Department / Agency</th>
                <th>District</th>
                <th style={{ textAlign: 'right' }}>Land Required</th>
                <th style={{ textAlign: 'right' }}>Acquired</th>
                <th style={{ textAlign: 'center' }}>Progress</th>
                <th>Current Stage</th>
                <th>Delay Risk</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  className="clickable"
                  onClick={() => navigateToProject(proj.id)}
                >
                  <td>
                    <div className="project-table-name">{proj.name}</div>
                    <div className="project-table-code">
                      {proj.code}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{proj.implementingAgency}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>{proj.department}</div>
                  </td>
                  <td>{proj.district}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {proj.landRequiredAcres} ac
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gov-green-700)', fontVariantNumeric: 'tabular-nums' }}>
                    {proj.landAcquiredAcres} ac
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-progress-wrap">
                      <div className="gov-progress-bar">
                        <div
                          className="gov-progress-fill"
                          style={{
                            width: `${proj.progressPercentage}%`,
                            backgroundColor: proj.progressPercentage === 100 ? 'var(--gov-green-600)' : 'var(--gov-blue-600)'
                          }}
                        />
                      </div>
                      <span className="table-progress-text">{proj.progressPercentage}%</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={proj.currentStage} />
                  </td>
                  <td>
                    <RiskBadge score={proj.riskScore} level={proj.riskLevel} />
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--gov-slate-500)', whiteSpace: 'nowrap' }}>{proj.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
