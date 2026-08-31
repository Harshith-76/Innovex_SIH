import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  fetchDistrictProjectsWithCounts,
  fetchDistrictMonitoringStats,
  fetchDistrictMonitoringActivity,
  verifyDistrictProject,
  rejectDistrictProject,
  DistrictMonitoringProject,
  DistrictMonitoringStats,
  DistrictMonitoringActivity
} from '../services/api';
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
  const [verificationRemarks, setVerificationRemarks] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isActionSubmitting, setIsActionSubmitting] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Officer name
  const officerName = 'Shri R. K. Hegde, KAS (District Officer)';

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

  // Handle Verify & Accept
  const handleVerify = async () => {
    if (!selectedProject) return;
    setIsActionSubmitting(true);
    setActionErrorMessage(null);
    try {
      const updated = await verifyDistrictProject(
        selectedProject.id || selectedProject._id,
        officerName,
        verificationRemarks.trim() || 'Verified and accepted for district land acquisition.'
      );

      setActionSuccessMessage(`Project "${updated.projectName}" has been verified and accepted successfully.`);
      setTimeout(() => {
        setActionSuccessMessage(null);
        setSelectedProject(null);
        setVerificationRemarks('');
      }, 1200);

      // Refresh dashboard data
      await loadDashboardData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionErrorMessage(msg);
    } finally {
      setIsActionSubmitting(false);
    }
  };

  // Handle Reject / Return
  const handleReject = async () => {
    if (!selectedProject) return;
    if (!rejectReason.trim()) {
      setActionErrorMessage('Please provide a specific justification/reason for returning this project.');
      return;
    }

    setIsActionSubmitting(true);
    setActionErrorMessage(null);
    try {
      const updated = await rejectDistrictProject(
        selectedProject.id || selectedProject._id,
        rejectReason.trim(),
        officerName
      );

      setActionSuccessMessage(`Project "${updated.projectName}" has been returned to the forwarding authority.`);
      setTimeout(() => {
        setActionSuccessMessage(null);
        setSelectedProject(null);
        setIsRejecting(false);
        setRejectReason('');
      }, 1200);

      // Refresh dashboard data
      await loadDashboardData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionErrorMessage(msg);
    } finally {
      setIsActionSubmitting(false);
    }
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
          PROJECT REVIEW & VERIFICATION MODAL
         ─────────────────────────────────────────────────────────────────── */}
      {selectedProject && (
        <div className="gov-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div
            className="gov-modal-container"
            style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="gov-modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 className="gov-modal-title" style={{ fontSize: '17px', margin: 0 }}>
                    {selectedProject.projectName}
                  </h2>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'var(--gov-blue-50)',
                      color: 'var(--gov-blue-700)',
                      border: '1px solid var(--gov-blue-100)',
                    }}
                  >
                    {selectedProject.projectCode}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gov-slate-500)', marginTop: '4px' }}>
                  Forwarded by State Portal for District Verification & Jurisdiction Acceptance
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsRejecting(false);
                }}
                className="gov-btn-icon"
              >
                <X size={18} />
              </button>
            </div>

            {/* Action Feedback Messages */}
            {actionSuccessMessage && (
              <div
                style={{
                  margin: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--gov-green-50)',
                  border: '1px solid var(--gov-green-200)',
                  borderRadius: '6px',
                  color: 'var(--gov-green-800)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {actionErrorMessage && (
              <div
                style={{
                  margin: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--gov-red-50)',
                  border: '1px solid var(--gov-red-200)',
                  borderRadius: '6px',
                  color: 'var(--gov-red-800)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <AlertCircle size={16} />
                <span>{actionErrorMessage}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="gov-modal-body" style={{ padding: '20px' }}>
              {/* Project Information */}
              <div style={{ marginBottom: '20px' }}>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--gov-navy-900)',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={14} color="var(--gov-blue-600)" />
                  Project Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="info-block">
                    <span className="info-label">PROJECT TYPE</span>
                    <span className="info-val">{selectedProject.projectType || 'General Infrastructure'}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">DISTRICT</span>
                    <span className="info-val">{selectedProject.district}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">IMPLEMENTING AGENCY</span>
                    <span className="info-val">{selectedProject.implementingAgency || selectedProject.agencyName}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">PARENT AUTHORITY</span>
                    <span className="info-val">{selectedProject.parentAuthority || 'Govt of Karnataka'}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">DEPARTMENT</span>
                    <span className="info-val">{selectedProject.department || 'Public Works Department'}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">FINANCIAL STATUS</span>
                    <span className="info-val">{selectedProject.financialStatus || 'Approved'}</span>
                  </div>
                </div>
              </div>

              {/* Land Details & Financials */}
              <div style={{ marginBottom: '20px' }}>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--gov-navy-900)',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Layers size={14} color="var(--gov-blue-600)" />
                  Land & Compensation Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="info-block highlight">
                    <span className="info-label">LAND REQUIRED</span>
                    <span className="info-val" style={{ color: 'var(--gov-navy-900)' }}>
                      {selectedProject.landRequiredAcres} Acres
                    </span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">LAND ACQUIRED</span>
                    <span className="info-val" style={{ color: 'var(--gov-green-700)' }}>
                      {selectedProject.landAcquiredAcres} Acres
                    </span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">ESTIMATED COMPENSATION</span>
                    <span className="info-val" style={{ color: 'var(--gov-blue-700)' }}>
                      ₹{selectedProject.estimatedCompensationCr} Cr
                    </span>
                  </div>
                </div>
              </div>

              {/* Forwarding Record & Remarks */}
              <div style={{ marginBottom: '20px' }}>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--gov-navy-900)',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Calendar size={14} color="var(--gov-blue-600)" />
                  Approval & Forwarding Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="info-block">
                    <span className="info-label">APPROVAL STATUS</span>
                    <span className="info-val">{selectedProject.approvalStatus}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">APPROVED BY</span>
                    <span className="info-val">{selectedProject.approvedBy || 'State SLAO Directorate'}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">APPROVED DATE</span>
                    <span className="info-val">{formatDate(selectedProject.approvedAt)}</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px 14px',
                    backgroundColor: 'var(--gov-slate-50)',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-600)', marginBottom: '4px' }}>
                    FORWARDING OFFICER REMARKS
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--gov-slate-800)', lineHeight: '1.5' }}>
                    {selectedProject.officerRemarks || 'No forwarding remarks specified.'}
                  </div>
                </div>
              </div>

              {/* District Status Badge */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  backgroundColor:
                    (selectedProject.districtStatus || '').toUpperCase() === 'VERIFIED'
                      ? 'var(--gov-green-50)'
                      : (selectedProject.districtStatus || '').toUpperCase() === 'RETURNED' ||
                        (selectedProject.districtStatus || '').toUpperCase() === 'REJECTED'
                      ? 'var(--gov-red-50)'
                      : 'var(--gov-amber-50)',
                  border:
                    (selectedProject.districtStatus || '').toUpperCase() === 'VERIFIED'
                      ? '1px solid var(--gov-green-200)'
                      : (selectedProject.districtStatus || '').toUpperCase() === 'RETURNED' ||
                        (selectedProject.districtStatus || '').toUpperCase() === 'REJECTED'
                      ? '1px solid var(--gov-red-200)'
                      : '1px solid var(--gov-amber-200)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>
                      CURRENT DISTRICT VERIFICATION STATUS:
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
                      {(selectedProject.districtStatus || 'PENDING_REVIEW').toUpperCase()}
                    </div>
                  </div>
                  {selectedProject.districtVerifiedBy && (
                    <div style={{ textAlign: 'right', fontSize: '11.5px', color: 'var(--gov-slate-600)' }}>
                      Verified by <strong>{selectedProject.districtVerifiedBy}</strong> on{' '}
                      {formatDate(selectedProject.districtVerifiedAt)}
                    </div>
                  )}
                  {selectedProject.districtReviewedBy && (
                    <div style={{ textAlign: 'right', fontSize: '11.5px', color: 'var(--gov-red-700)' }}>
                      Returned by <strong>{selectedProject.districtReviewedBy}</strong> on{' '}
                      {formatDate(selectedProject.districtReviewedAt)}
                    </div>
                  )}
                </div>
                {selectedProject.districtRejectionReason && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--gov-red-800)' }}>
                    <strong>Recorded Return Justification:</strong> {selectedProject.districtRejectionReason}
                  </div>
                )}
              </div>

              {/* Verify / Reject Forms */}
              {isRejecting ? (
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--gov-red-50)',
                    border: '1px solid var(--gov-red-200)',
                    borderRadius: '6px',
                  }}
                >
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gov-red-900)', marginBottom: '6px' }}>
                    Reason for Returning / Rejecting Project (Mandatory) *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter explicit justification (e.g. boundary overlap, missing survey clearances)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '12px',
                      border: '1px solid var(--gov-red-300)',
                      borderRadius: '4px',
                      marginBottom: '10px',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      className="gov-btn gov-btn-secondary gov-btn-sm"
                      onClick={() => setIsRejecting(false)}
                      disabled={isActionSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      className="gov-btn gov-btn-danger gov-btn-sm"
                      onClick={handleReject}
                      disabled={isActionSubmitting || !rejectReason.trim()}
                    >
                      {isActionSubmitting ? 'Returning...' : 'Confirm Return / Reject'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '4px' }}>
                    Verification Remarks / Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Cadastral survey verified with Bhoomi RTC records. Approved for award determination."
                    value={verificationRemarks}
                    onChange={(e) => setVerificationRemarks(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '12px',
                      border: '1px solid var(--gov-slate-300)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div
              className="gov-modal-footer"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderTop: '1px solid var(--gov-slate-200)',
              }}
            >
              <button
                className="gov-btn gov-btn-secondary"
                onClick={() => {
                  setSelectedProject(null);
                  setIsRejecting(false);
                }}
                disabled={isActionSubmitting}
              >
                Close
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {!isRejecting && (
                  <button
                    className="gov-btn gov-btn-danger"
                    onClick={() => setIsRejecting(true)}
                    disabled={isActionSubmitting}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <XCircle size={14} />
                    <span>Return / Reject</span>
                  </button>
                )}

                {!isRejecting && (
                  <button
                    className="gov-btn gov-btn-primary"
                    onClick={handleVerify}
                    disabled={isActionSubmitting}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{isActionSubmitting ? 'Verifying...' : 'Verify & Accept Project'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
