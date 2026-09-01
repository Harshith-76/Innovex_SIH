import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SystemAlert, AlertSeverity } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
import {
  BellRing,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  UserCheck,
  RotateCcw
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const {
    alerts,
    resolveAlert,
    navigateToProject,
    navigateToParcelInGis,
    searchQuery: globalSearch,
    t
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [resolvingAlert, setResolvingAlert] = useState<SystemAlert | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('');

  const searchKeyword = (localSearch || globalSearch).toLowerCase().trim();

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSev = filterSeverity === 'ALL' || alt.category === filterSeverity;
    const matchesStat = filterStatus === 'ALL' || alt.status === filterStatus;
    const matchesSearch =
      !searchKeyword ||
      alt.title.toLowerCase().includes(searchKeyword) ||
      alt.description.toLowerCase().includes(searchKeyword) ||
      alt.projectName.toLowerCase().includes(searchKeyword) ||
      alt.assignedOfficer.toLowerCase().includes(searchKeyword);

    return matchesSev && matchesStat && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.category === 'Critical' && a.status !== 'Resolved').length;
  const warningCount = alerts.filter(a => a.category === 'Warning' && a.status !== 'Resolved').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;

  const handleConfirmResolve = () => {
    if (!resolvingAlert) return;
    resolveAlert(resolvingAlert.id, resolutionNote || 'Resolved following administrative verification by SLAO.');
    setResolvingAlert(null);
    setResolutionNote('');
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{t('alerts.title', 'OPERATIONAL ALERTS & NOTIFICATIONS')}</h1>
          <p className="page-subtitle">
            {t('alerts.subtitle', 'System alerts, high risk acquisition warnings, boundary disputes, and pending reviews.')}
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #fca5a5',
            borderLeft: '4px solid var(--gov-red-600)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-red-700)', textTransform: 'uppercase' }}>
            Critical Action Required
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--gov-red-700)', marginTop: '2px' }}>
            {criticalCount} Alerts
          </div>
          <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginTop: '2px' }}>
            Overdue compensation & possession stays
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #fde68a',
            borderLeft: '4px solid var(--gov-amber-600)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-amber-700)', textTransform: 'uppercase' }}>
            Statutory Warnings
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--gov-amber-700)', marginTop: '2px' }}>
            {warningCount} Alerts
          </div>
          <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginTop: '2px' }}>
            Notifications approaching deadline
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #bbf7d0',
            borderLeft: '4px solid var(--gov-green-600)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-green-700)', textTransform: 'uppercase' }}>
            Resolved This Month
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--gov-green-700)', marginTop: '2px' }}>
            {resolvedCount} Items
          </div>
          <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginTop: '2px' }}>
            Actioned and logged into state record
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--gov-slate-200)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 240px' }}>
          <Search size={14} color="var(--gov-slate-400)" />
          <input
            type="text"
            className="gov-input"
            style={{ width: '100%' }}
            placeholder="Search alert subject, project, officer..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Severity:</span>
          <select
            className="gov-select"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Information">Information</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Status:</span>
          <select
            className="gov-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredAlerts.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '36px', color: 'var(--gov-slate-500)' }}>
            No operational alerts matching selected criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${alert.category}`}
              style={{ padding: '14px 16px' }}
            >
              <div style={{ marginTop: '2px' }}>
                {alert.category === 'Critical' && <AlertCircle size={20} color="var(--gov-red-600)" />}
                {alert.category === 'Warning' && <AlertTriangle size={20} color="var(--gov-amber-600)" />}
                {alert.category === 'Information' && <Info size={20} color="var(--gov-blue-600)" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--gov-navy-900)' }}>
                      {alert.title}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginTop: '2px' }}>
                      {alert.projectName} {alert.surveyNumber ? `· Sy. No. ${alert.surveyNumber}` : ''} · District: {alert.district}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status={alert.status} size="sm" />
                    <span style={{ fontSize: '10.5px', color: 'var(--gov-slate-400)' }}>
                      {alert.createdDate}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--gov-slate-700)', marginTop: '6px', lineHeight: '1.45' }}>
                  {alert.description}
                </p>

                {alert.resolutionNotes && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '6px 10px',
                      backgroundColor: 'var(--gov-green-50)',
                      border: '1px solid var(--gov-green-100)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      color: 'var(--gov-green-700)'
                    }}
                  >
                    <strong>Resolution Note:</strong> {alert.resolutionNotes}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>
                    Assigned Officer: <strong>{alert.assignedOfficer}</strong> ({alert.assignedOfficerRole})
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {alert.parcelId && (
                      <button
                        className="gov-btn gov-btn-secondary gov-btn-sm"
                        onClick={() => navigateToParcelInGis(alert.parcelId!)}
                      >
                        Inspect Parcel <ExternalLink size={11} />
                      </button>
                    )}
                    <button
                      className="gov-btn gov-btn-secondary gov-btn-sm"
                      onClick={() => navigateToProject(alert.projectId)}
                    >
                      Project Workspace <ExternalLink size={11} />
                    </button>
                    {alert.status !== 'Resolved' && (
                      <button
                        className="gov-btn gov-btn-primary gov-btn-sm"
                        onClick={() => setResolvingAlert(alert)}
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolve Alert Modal */}
      <Modal
        isOpen={!!resolvingAlert}
        onClose={() => setResolvingAlert(null)}
        title="Resolve Operational Alert"
        subtitle={resolvingAlert ? resolvingAlert.title : ''}
        footer={
          <>
            <button className="gov-btn gov-btn-secondary" onClick={() => setResolvingAlert(null)}>
              Cancel
            </button>
            <button className="gov-btn gov-btn-primary" onClick={handleConfirmResolve}>
              Confirm Resolution
            </button>
          </>
        }
      >
        {resolvingAlert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
                Administrative Action & Resolution Remarks
              </label>
              <textarea
                className="gov-input"
                rows={4}
                style={{ width: '100%', resize: 'none' }}
                placeholder="Detail the field verification, treasury transfer ref, or court order compliance that resolved this alert..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
