import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  fetchDistrictProjectsWithCounts,
  fetchDistrictMonitoringStats,
  fetchDistrictMonitoringActivity,
  DistrictMonitoringProject,
  DistrictMonitoringStats,
  DistrictMonitoringActivity
} from '../services/api';
import { ProjectReviewModal } from '../components/district/ProjectReviewModal';
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  IndianRupee,
  Users,
  Search,
  RefreshCw,
  Eye,
  FileCheck2,
  Calendar,
  Building2,
  ShieldCheck,
  AlertCircle,
  X,
  Send,
  CornerUpLeft,
  Clock,
  Layers,
  FileText,
  Filter as FilterIcon
} from 'lucide-react';

export const DistrictDashboardPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  // District selector / jurisdiction
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');

  // Live state from MongoDB Atlas
  const [projects, setProjects] = useState<DistrictMonitoringProject[]>([]);
  const [counts, setCounts] = useState<{ pending: number; verified: number; returned: number; all: number }>({
    pending: 0,
    verified: 0,
    returned: 0,
    all: 0,
  });
  const [stats, setStats] = useState<DistrictMonitoringStats | null>(null);
  const [activities, setActivities] = useState<DistrictMonitoringActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'returned' | 'all'>('pending');

  // Selected Project for Review Modal
  const [selectedProject, setSelectedProject] = useState<DistrictMonitoringProject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load live data from MongoDB
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resProjects, statsData, activityData] = await Promise.all([
        fetchDistrictProjectsWithCounts({
          district: districtFilter === 'ALL' ? undefined : districtFilter,
          tab: activeTab,
          search: searchQuery.trim() || undefined,
        }),
        fetchDistrictMonitoringStats(districtFilter === 'ALL' ? undefined : districtFilter),
        fetchDistrictMonitoringActivity(districtFilter === 'ALL' ? undefined : districtFilter),
      ]);

      setProjects(resProjects.data || []);
      if (resProjects.counts) {
        setCounts(resProjects.counts);
      }
      setStats(statsData);
      setActivities(activityData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[DistrictMonitoring] Error loading data from MongoDB:', msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [districtFilter, activeTab, searchQuery]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleActionSuccess = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    loadDashboardData();
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="page-body">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'var(--gov-navy-900)',
            color: '#ffffff',
            borderLeft: '4px solid var(--gov-green-500)',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <CheckCircle2 size={18} color="var(--gov-green-400)" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              marginLeft: '8px',
              opacity: 0.7,
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          1. HEADER
         ─────────────────────────────────────────────────────────────────── */}
      <div className="page-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">District Monitoring</h1>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                backgroundColor: 'var(--gov-blue-50)',
                border: '1px solid var(--gov-blue-100)',
                borderRadius: '4px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'var(--gov-blue-700)',
              }}
            >
              <Building2 size={13} />
              <span>
                Jurisdiction: {districtFilter === 'ALL' ? 'All Districts' : `${districtFilter} District`}
              </span>
            </div>
          </div>
          <p className="page-subtitle">
            District-level project verification, land acquisition progress, compensation and R&R monitoring.
          </p>
        </div>

        <div className="page-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* District Selector Filter */}
          <select
            className="gov-select"
            style={{ fontSize: '12px', height: '32px', padding: '0 8px' }}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <option value="ALL">All Districts (Statewide)</option>
            <option value="Bengaluru">Bengaluru District</option>
            <option value="Dakshina Kannada">Dakshina Kannada District</option>
            <option value="Bengaluru Rural">Bengaluru Rural</option>
            <option value="Bengaluru Urban">Bengaluru Urban</option>
          </select>

          <button
            className="gov-btn gov-btn-secondary"
            onClick={loadDashboardData}
            disabled={isLoading}
            title="Reload live data from MongoDB Atlas"
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            <span>{isLoading ? 'Fetching...' : 'Sync Database'}</span>
          </button>
        </div>
      </div>

      {/* Database Error Banner */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'var(--gov-red-50)',
            border: '1px solid var(--gov-red-100)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--gov-red-700)',
            fontSize: '12.5px',
            marginBottom: '16px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>MongoDB Connection Error:</strong> {error}
          </div>
          <button className="gov-btn gov-btn-secondary gov-btn-sm" onClick={loadDashboardData}>
            Retry
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          PROJECTS PENDING DISTRICT VERIFICATION (Main Table Section)
         ─────────────────────────────────────────────────────────────────── */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <div className="gov-card-title-icon blue">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span>Projects Pending District Verification</span>
              <span className="gov-card-title-sub">
                Collection: <code>Project_Approved_Project</code> · Filtered by{' '}
                {districtFilter === 'ALL' ? 'All Districts' : `${districtFilter} District`}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="header-search-box" style={{ width: '240px', height: '32px' }}>
              <Search size={13} color="var(--gov-slate-400)" />
              <input
                type="text"
                placeholder="Search project name/code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '12px' }}
              />
            </div>
          </div>
        </div>

        {/* Tab Controls with Live MongoDB Dynamic Counts */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '10px 16px 0',
            borderBottom: '1px solid var(--gov-slate-200)',
          }}
        >
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '6px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'pending' ? '2px solid var(--gov-blue-600)' : '2px solid transparent',
              color: activeTab === 'pending' ? 'var(--gov-blue-700)' : 'var(--gov-slate-600)',
              fontWeight: activeTab === 'pending' ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Pending Verification ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            style={{
              padding: '6px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'verified' ? '2px solid var(--gov-green-600)' : '2px solid transparent',
              color: activeTab === 'verified' ? 'var(--gov-green-700)' : 'var(--gov-slate-600)',
              fontWeight: activeTab === 'verified' ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Verified & Accepted ({counts.verified})
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            style={{
              padding: '6px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'returned' ? '2px solid var(--gov-red-600)' : '2px solid transparent',
              color: activeTab === 'returned' ? 'var(--gov-red-700)' : 'var(--gov-slate-600)',
              fontWeight: activeTab === 'returned' ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Returned / Rejected ({counts.returned})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 14px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'all' ? '2px solid var(--gov-navy-800)' : '2px solid transparent',
              color: activeTab === 'all' ? 'var(--gov-navy-900)' : 'var(--gov-slate-600)',
              fontWeight: activeTab === 'all' ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            All Projects ({counts.all})
          </button>
        </div>

        {/* 10-Column Project Verification Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>PROJECT CODE & NAME</th>
                <th>PROJECT TYPE</th>
                <th>DISTRICT</th>
                <th>IMPLEMENTING AGENCY</th>
                <th style={{ textAlign: 'right' }}>LAND REQ.</th>
                <th style={{ textAlign: 'right' }}>ACQUIRED</th>
                <th style={{ textAlign: 'right' }}>EST. COMPENSATION</th>
                <th style={{ textAlign: 'center' }}>APPROVAL STATUS</th>
                <th style={{ textAlign: 'center' }}>DISTRICT STATUS</th>
                <th style={{ textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--gov-slate-500)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="spin-icon" />
                      <span>Loading real approved projects from MongoDB Atlas...</span>
                    </div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--gov-slate-500)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>
                      No {activeTab} projects found for {districtFilter === 'ALL' ? 'the selected filter' : `${districtFilter} District`}.
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--gov-slate-400)', marginTop: '4px' }}>
                      {searchQuery ? 'Try clearing your search query.' : 'All projects are currently up to date.'}
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((p) => {
                  const rawStatus = (p.districtStatus || p.districtVerification?.status || 'PENDING_REVIEW').toUpperCase();
                  const isVerified = rawStatus === 'VERIFIED';
                  const isReturned = rawStatus === 'RETURNED' || rawStatus === 'REJECTED';

                  return (
                    <tr key={p.id || p._id} className="clickable" onClick={() => setSelectedProject(p)}>
                      <td>
                        <div className="project-table-name" style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                          {p.projectName}
                        </div>
                        <div className="project-table-code" style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                          {p.projectCode}
                        </div>
                      </td>
                      <td style={{ fontSize: '11.5px', color: 'var(--gov-slate-700)' }}>
                        {p.projectType || 'General Infrastructure'}
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600,
                            color: 'var(--gov-navy-900)',
                          }}
                        >
                          <MapPin size={12} color="var(--gov-blue-600)" />
                          {p.district}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: '12px' }}>
                          {p.implementingAgency || p.agencyName}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>
                          {p.department || 'Public Works Department'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {p.landRequiredAcres !== undefined ? `${p.landRequiredAcres} ac` : '0 ac'}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: 'var(--gov-green-700)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {p.landAcquiredAcres !== undefined ? `${p.landAcquiredAcres} ac` : '0 ac'}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: 'var(--gov-blue-700)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        ₹{p.estimatedCompensationCr !== undefined ? `${p.estimatedCompensationCr} Cr` : '0 Cr'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: 'var(--gov-green-50)',
                            color: 'var(--gov-green-700)',
                            border: '1px solid var(--gov-green-100)',
                          }}
                        >
                          {p.approvalStatus || 'APPROVED'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isVerified && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: 'var(--gov-green-50)',
                              color: 'var(--gov-green-700)',
                              border: '1px solid var(--gov-green-100)',
                            }}
                          >
                            <CheckCircle2 size={11} />
                            VERIFIED
                          </span>
                        )}
                        {isReturned && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: 'var(--gov-red-50)',
                              color: 'var(--gov-red-700)',
                              border: '1px solid var(--gov-red-100)',
                            }}
                          >
                            <XCircle size={11} />
                            RETURNED
                          </span>
                        )}
                        {!isVerified && !isReturned && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: 'var(--gov-amber-50)',
                              color: 'var(--gov-amber-700)',
                              border: '1px solid var(--gov-amber-100)',
                            }}
                          >
                            <AlertTriangle size={11} />
                            PENDING REVIEW
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="gov-btn gov-btn-secondary gov-btn-sm"
                          onClick={() => setSelectedProject(p)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          <Eye size={12} />
                          <span>Review</span>
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

      {/* ───────────────────────────────────────────────────────────────────
          DISTRICT ACQUISITION SUMMARY (Live Totals)
         ─────────────────────────────────────────────────────────────────── */}
      <div className="dashboard-two-col" style={{ marginTop: '16px' }}>
        {/* Land Acquisition Progress */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <div className="gov-card-title-icon green">
                <Layers size={16} />
              </div>
              <div>
                <span>Land Acquisition Summary</span>
                <span className="gov-card-title-sub">Aggregate progress for jurisdiction</span>
              </div>
            </div>
          </div>
          <div className="gov-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Required</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                  {stats ? `${stats.totalLandRequiredAcres} ac` : '...'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Acquired</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-green-700)' }}>
                  {stats ? `${stats.totalLandAcquiredAcres} ac` : '...'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Pending</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-amber-700)' }}>
                  {stats ? `${stats.pendingLandAcres} ac` : '...'}
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Overall Acquisition Completion</span>
                <span style={{ fontWeight: 700, color: 'var(--gov-green-700)' }}>
                  {stats ? `${stats.acquisitionCompletionPercentage}%` : '0%'}
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--gov-slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${stats ? Math.min(stats.acquisitionCompletionPercentage, 100) : 0}%`,
                    backgroundColor: 'var(--gov-green-600)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compensation Disbursement Summary */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <div className="gov-card-title-icon blue">
                <IndianRupee size={16} />
              </div>
              <div>
                <span>Compensation Disbursement</span>
                <span className="gov-card-title-sub">Financial progress in ₹ Crores</span>
              </div>
            </div>
          </div>
          <div className="gov-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Estimated</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                  {stats ? `₹${stats.totalEstimatedCompensationCr} Cr` : '...'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Disbursed</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-green-700)' }}>
                  {stats ? `₹${stats.totalPaidCompensationCr} Cr` : '...'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Pending</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-blue-700)' }}>
                  {stats ? `₹${stats.pendingCompensationCr} Cr` : '...'}
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--gov-slate-600)' }}>Payout Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--gov-blue-700)' }}>
                  {stats ? `${stats.compensationPayoutPercentage}%` : '0%'}
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--gov-slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${stats ? Math.min(stats.compensationPayoutPercentage, 100) : 0}%`,
                    backgroundColor: 'var(--gov-blue-600)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          RECENT VERIFICATION ACTIVITY & AUDIT TRAIL
         ─────────────────────────────────────────────────────────────────── */}
      <div className="gov-card" style={{ marginTop: '16px' }}>
        <div className="gov-card-header">
          <div className="gov-card-title">
            <div className="gov-card-title-icon amber">
              <Clock size={16} />
            </div>
            <div>
              <span>Recent Verification Activity & Audit Trail</span>
              <span className="gov-card-title-sub">Recorded decisions by District Officers</span>
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>PROJECT</th>
                <th>DISTRICT</th>
                <th>ACTION</th>
                <th>OFFICER</th>
                <th>DATE</th>
                <th>REMARKS / REASON</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--gov-slate-400)' }}>
                    No recent verification activity recorded yet.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id || act.date}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{act.projectName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>{act.projectCode}</div>
                    </td>
                    <td>{act.district}</td>
                    <td>
                      {act.action === 'VERIFIED' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: 'var(--gov-green-50)',
                            color: 'var(--gov-green-700)',
                          }}
                        >
                          <CheckCircle2 size={11} />
                          VERIFIED
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: 'var(--gov-red-50)',
                            color: 'var(--gov-red-700)',
                          }}
                        >
                          <XCircle size={11} />
                          RETURNED
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px' }}>{act.officer}</td>
                    <td style={{ fontSize: '11.5px', color: 'var(--gov-slate-600)' }}>{formatDate(act.date)}</td>
                    <td style={{ fontSize: '12px', maxWidth: '300px' }}>{act.remarks || act.reason || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          PROJECT REVIEW & VERIFICATION MODAL COMPONENT
         ─────────────────────────────────────────────────────────────────── */}
      {selectedProject && (
        <ProjectReviewModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};
