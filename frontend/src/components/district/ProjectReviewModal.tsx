import React, { useState, useEffect } from 'react';
import {
  DistrictMonitoringProject,
  verifyDistrictProject,
  rejectDistrictProject,
  fetchParcels,
  GeoJSONFeature
} from '../../services/api';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Building2,
  Layers,
  IndianRupee,
  Calendar,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Route,
  Clock,
  ExternalLink
} from 'lucide-react';

interface ProjectReviewModalProps {
  project: DistrictMonitoringProject;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ProjectReviewModal: React.FC<ProjectReviewModalProps> = ({
  project,
  onClose,
  onSuccess,
}) => {
  const officerName = 'Shri R. K. Hegde, KAS';
  const officerRole = 'District Land Acquisition Officer';

  // Form states
  const [verificationRemarks, setVerificationRemarks] = useState<string>('');
  const [isConfirmingVerify, setIsConfirmingVerify] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [justification, setJustification] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Associated Land Parcels state
  const [associatedParcels, setAssociatedParcels] = useState<GeoJSONFeature[]>([]);
  const [isLoadingParcels, setIsLoadingParcels] = useState<boolean>(false);

  // Format date helper (DD-MM-YYYY HH:mm)
  const formatDateTime = (dateStr?: string | Date) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return String(dateStr);
    }
  };

  const landReq = Number(project.landRequiredAcres) || 0;
  const landAcq = Number(project.landAcquiredAcres) || 0;
  const pendingLand = Math.max(0, landReq - landAcq);

  // Fetch linked parcels / survey numbers if available
  useEffect(() => {
    const loadParcels = async () => {
      const rawProject = project as any;
      const ids = rawProject.selectedParcelIds || [];
      const pCode = rawProject.projectCode;

      if ((ids && ids.length > 0) || pCode) {
        setIsLoadingParcels(true);
        try {
          const res = await fetchParcels({
            ids: ids.length > 0 ? ids.join(',') : undefined,
            projectCode: pCode,
            limit: 50,
          });
          setAssociatedParcels(res.features || []);
        } catch (err) {
          console.warn('[ProjectReviewModal] Could not fetch associated parcels:', err);
        } finally {
          setIsLoadingParcels(false);
        }
      }
    };

    loadParcels();
  }, [project]);

  // Handle Verify Execution
  const handleVerify = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await verifyDistrictProject(
        project.id || project._id,
        officerName,
        project.district,
        verificationRemarks.trim() || 'Verified and cleared for district execution.',
        officerRole
      );

      onSuccess('Project successfully verified and moved to Verified & Accepted.');
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Return / Rejection Execution
  const handleReturn = async () => {
    if (!justification.trim()) {
      setErrorMessage('Reason for Return / Rejection is mandatory.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await rejectDistrictProject(
        project.id || project._id,
        justification.trim(),
        officerName,
        project.district,
        officerRole
      );

      onSuccess('Project returned with recorded justification.');
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rawStatus = (project.districtStatus || project.districtVerification?.status || 'PENDING_REVIEW').toUpperCase();
  const isVerified = rawStatus === 'VERIFIED';
  const isReturned = rawStatus === 'RETURNED' || rawStatus === 'REJECTED';
  const isPending = !isVerified && !isReturned;

  const rawProject = project as any;
  const hasLinearData = rawProject.proposedLengthKm || rawProject.routeLengthKm || rawProject.rowWidthM;

  return (
    <div className="gov-modal-backdrop" onClick={onClose}>
      <div
        className="gov-modal-container"
        style={{ maxWidth: '920px', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* A. Modal Header */}
        <div
          className="gov-modal-header"
          style={{
            backgroundColor: 'var(--gov-navy-900)',
            color: '#ffffff',
            padding: '16px 20px',
            borderBottom: '2px solid var(--gov-gold-500)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--gov-gold-400)" />
              <h2 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.5px', margin: 0, color: '#ffffff' }}>
                PROJECT VERIFICATION & REVIEW — DISTRICT JURISDICTION
              </h2>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gov-slate-300)', marginTop: '4px' }}>
              Reviewing: <strong>{project.projectName}</strong> (
              <span style={{ color: 'var(--gov-gold-400)', fontFamily: 'monospace' }}>{project.projectCode}</span>)
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            style={{
              margin: '16px 20px 0',
              padding: '12px 16px',
              backgroundColor: 'var(--gov-red-50)',
              border: '1px solid var(--gov-red-200)',
              borderRadius: '6px',
              color: 'var(--gov-red-800)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12.5px',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* B. Detailed Data Sections */}
        <div className="gov-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* 2. CONDITIONAL VERIFICATION HEADER */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: isVerified
                ? 'var(--gov-green-50)'
                : isReturned
                ? 'var(--gov-red-50)'
                : 'var(--gov-amber-50)',
              border: isVerified
                ? '1px solid var(--gov-green-200)'
                : isReturned
                ? '1px solid var(--gov-red-200)'
                : '1px solid var(--gov-amber-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>
                CURRENT DISTRICT STATUS:
              </span>
              <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isVerified && <CheckCircle2 size={15} color="var(--gov-green-700)" />}
                {isReturned && <XCircle size={15} color="var(--gov-red-700)" />}
                {isPending && <AlertTriangle size={15} color="var(--gov-amber-700)" />}
                <span
                  style={{
                    color: isVerified
                      ? 'var(--gov-green-800)'
                      : isReturned
                      ? 'var(--gov-red-800)'
                      : 'var(--gov-amber-800)',
                  }}
                >
                  {isVerified ? 'VERIFIED' : isReturned ? 'RETURNED' : 'PENDING REVIEW'}
                </span>
              </div>
            </div>

            {/* Right side conditional status detail */}
            <div style={{ fontSize: '11.5px', textAlign: 'right' }}>
              {isVerified && (
                <div style={{ color: 'var(--gov-green-900)' }}>
                  Verified by <strong>{project.districtVerifiedBy || officerName}</strong> on{' '}
                  {formatDateTime(project.districtVerifiedAt || rawProject.verifiedAt || new Date())}
                </div>
              )}
              {isPending && (
                <div style={{ color: 'var(--gov-amber-900)', fontWeight: 600 }}>
                  Awaiting District Officer Action
                </div>
              )}
              {isReturned && (
                <div style={{ color: 'var(--gov-red-900)' }}>
                  Returned with Justification
                  {project.districtReviewedBy && (
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--gov-slate-600)' }}>
                      by <strong>{project.districtReviewedBy}</strong> on {formatDateTime(project.districtReviewedAt || rawProject.returnedAt)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* If returned previously, show recorded justification */}
          {(project.districtRejectionReason || rawProject.rejectionJustification) && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--gov-red-50)',
                border: '1px solid var(--gov-red-200)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--gov-red-900)',
              }}
            >
              <strong>Recorded Return Justification:</strong>{' '}
              {project.districtRejectionReason || rawProject.rejectionJustification}
            </div>
          )}

          {/* 1. Project Identification */}
          <div className="gov-card" style={{ padding: '16px', margin: 0 }}>
            <h3
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--gov-navy-900)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FileText size={14} color="var(--gov-blue-600)" />
              1. Project Identification
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div className="info-block" style={{ gridColumn: 'span 2' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>PROJECT NAME</span>
                <span className="info-val" style={{ fontWeight: 700, color: 'var(--gov-navy-900)', fontSize: '13.5px' }}>
                  {project.projectName}
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>PROJECT CODE</span>
                <span className="info-val" style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--gov-blue-700)' }}>
                  {project.projectCode}
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>PROJECT TYPE</span>
                <span className="info-val">{project.projectType || 'General Infrastructure'}</span>
              </div>

              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>DISTRICT</span>
                <span className="info-val" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <MapPin size={12} color="var(--gov-blue-600)" />
                  {project.district}
                </span>
              </div>

              {rawProject.taluks && rawProject.taluks.length > 0 && (
                <div className="info-block">
                  <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>TALUKS / SUB-DISTRICTS</span>
                  <span className="info-val">{rawProject.taluks.join(', ')}</span>
                </div>
              )}

              {rawProject.state && (
                <div className="info-block">
                  <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>STATE JURISDICTION</span>
                  <span className="info-val">{rawProject.state}</span>
                </div>
              )}

              {hasLinearData && (
                <div className="info-block">
                  <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>ALIGNMENT / LENGTH</span>
                  <span className="info-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Route size={12} color="var(--gov-blue-600)" />
                    {rawProject.proposedLengthKm || rawProject.routeLengthKm ? `${rawProject.proposedLengthKm || rawProject.routeLengthKm} km` : '—'}
                    {rawProject.rowWidthM ? ` (RoW: ${rawProject.rowWidthM}m)` : ''}
                  </span>
                </div>
              )}

              <div className="info-block" style={{ gridColumn: 'span 4' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>DESCRIPTION / SCOPE</span>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--gov-slate-700)',
                    lineHeight: '1.5',
                    backgroundColor: 'var(--gov-slate-50)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--gov-slate-200)',
                  }}
                >
                  {project.description || project.scope || 'No description provided.'}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Agency & Department Details */}
          <div className="gov-card" style={{ padding: '16px', margin: 0 }}>
            <h3
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--gov-navy-900)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Building2 size={14} color="var(--gov-blue-600)" />
              2. Implementing Agency & Authority
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div className="info-block" style={{ gridColumn: 'span 2' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>IMPLEMENTING AGENCY</span>
                <span className="info-val" style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>
                  {project.implementingAgency || project.agencyName}
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>AGENCY NAME</span>
                <span className="info-val">{project.agencyName || project.implementingAgency || 'N/A'}</span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>AGENCY TYPE</span>
                <span className="info-val">{project.agencyType || rawProject.agencyType || 'State Authority'}</span>
              </div>
              <div className="info-block" style={{ gridColumn: 'span 2' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>DEPARTMENT</span>
                <span className="info-val">{project.department || 'Public Works Department'}</span>
              </div>
              <div className="info-block" style={{ gridColumn: 'span 2' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>PARENT AUTHORITY</span>
                <span className="info-val">{project.parentAuthority || 'Govt of Karnataka'}</span>
              </div>
            </div>
          </div>

          {/* 3. Land & Acquisition Profile + Associated Land Parcels */}
          <div className="gov-card" style={{ padding: '16px', margin: 0 }}>
            <h3
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--gov-navy-900)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Layers size={14} color="var(--gov-green-600)" />
              3. Land & Acquisition Profile
            </h3>
            
            {/* Land Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div className="info-block highlight">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>LAND REQUIRED</span>
                <span className="info-val" style={{ color: 'var(--gov-navy-900)', fontSize: '15px', fontWeight: 700 }}>
                  {landReq} Acres
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>LAND ACQUIRED</span>
                <span className="info-val" style={{ color: 'var(--gov-green-700)', fontSize: '15px', fontWeight: 700 }}>
                  {landAcq} Acres
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>PENDING ACQUISITION</span>
                <span className="info-val" style={{ color: 'var(--gov-amber-700)', fontSize: '15px', fontWeight: 700 }}>
                  {pendingLand} Acres
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>SELECTED PARCELS</span>
                <span className="info-val" style={{ fontSize: '15px', fontWeight: 700 }}>
                  {rawProject.selectedParcelCount || (rawProject.selectedParcelIds ? rawProject.selectedParcelIds.length : '—')}
                </span>
              </div>
            </div>

            {/* 4. OPTIONAL / RELATIONAL: Associated Land Parcels Sub-Table */}
            <div style={{ marginTop: '12px', borderTop: '1px solid var(--gov-slate-200)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-700)', textTransform: 'uppercase' }}>
                  Associated Land Parcels / Survey Numbers ({associatedParcels.length})
                </span>
                {isLoadingParcels && (
                  <span style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                    Loading parcels from database...
                  </span>
                )}
              </div>

              {associatedParcels.length > 0 ? (
                <div style={{ overflowX: 'auto', border: '1px solid var(--gov-slate-200)', borderRadius: '4px' }}>
                  <table className="gov-table" style={{ fontSize: '11.5px', margin: 0 }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--gov-slate-100)' }}>
                        <th style={{ padding: '6px 10px' }}>SURVEY NO.</th>
                        <th style={{ padding: '6px 10px' }}>PARCEL / CADASTRAL ID</th>
                        <th style={{ padding: '6px 10px' }}>VILLAGE</th>
                        <th style={{ padding: '6px 10px' }}>TALUK</th>
                        <th style={{ padding: '6px 10px', textAlign: 'right' }}>AREA (ACRES)</th>
                        <th style={{ padding: '6px 10px', textAlign: 'center' }}>CATEGORY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {associatedParcels.map((feat) => {
                        const p = feat.properties || {};
                        return (
                          <tr key={feat.id || p.parcel_id}>
                            <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)', padding: '6px 10px' }}>
                              {p.survey_no || '—'}
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '11px', padding: '6px 10px' }}>
                              {p.parcel_id || p.cadastral_id || feat.id}
                            </td>
                            <td style={{ padding: '6px 10px' }}>{p.village || '—'}</td>
                            <td style={{ padding: '6px 10px' }}>{p.taluk || '—'}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600, padding: '6px 10px' }}>
                              {p.area !== undefined ? `${p.area} ac` : '—'}
                            </td>
                            <td style={{ textAlign: 'center', padding: '6px 10px' }}>
                              <span
                                style={{
                                  padding: '1px 6px',
                                  borderRadius: '3px',
                                  fontSize: '10px',
                                  backgroundColor: 'var(--gov-slate-100)',
                                  color: 'var(--gov-slate-700)',
                                }}
                              >
                                {p.category || 'Parcel'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : !isLoadingParcels && (
                <div style={{ fontSize: '11.5px', color: 'var(--gov-slate-500)', fontStyle: 'italic', padding: '6px 0' }}>
                  No cadastral parcels explicitly mapped or queryable for this record.
                </div>
              )}
            </div>
          </div>

          {/* 4. Financial Status & Compensation */}
          <div className="gov-card" style={{ padding: '16px', margin: 0 }}>
            <h3
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--gov-navy-900)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <IndianRupee size={14} color="var(--gov-blue-600)" />
              4. Financial & Compensation Status
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>ESTIMATED COMPENSATION</span>
                <span className="info-val" style={{ color: 'var(--gov-blue-700)', fontWeight: 700, fontSize: '14px' }}>
                  ₹{project.estimatedCompensationCr !== undefined ? project.estimatedCompensationCr : 0} Cr
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>TOTAL ASSESSED / BUDGET</span>
                <span className="info-val" style={{ fontWeight: 600 }}>
                  ₹{rawProject.totalCompensationAssessedCr !== undefined ? rawProject.totalCompensationAssessedCr : (project.estimatedCompensationCr || 0)} Cr
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>FINANCIAL APPROVAL STATUS</span>
                <span className="info-val" style={{ fontWeight: 600, color: 'var(--gov-green-700)' }}>
                  {project.financialStatus || 'Approved'}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Forwarding & Approval History */}
          <div className="gov-card" style={{ padding: '16px', margin: 0 }}>
            <h3
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--gov-navy-900)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Calendar size={14} color="var(--gov-blue-600)" />
              5. Forwarding & Approval History
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>STATE APPROVAL STATUS</span>
                <span className="info-val" style={{ fontWeight: 700, color: 'var(--gov-green-700)' }}>
                  {project.approvalStatus || 'APPROVED'}
                </span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>APPROVED BY</span>
                <span className="info-val">{project.approvedBy || 'State SLAO Directorate'}</span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>APPROVED AT</span>
                <span className="info-val">{formatDateTime(project.approvedAt)}</span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>FORWARDED TO</span>
                <span className="info-val">{project.forwardedTo || 'DISTRICT_OFFICER'}</span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>FORWARDED AT</span>
                <span className="info-val">{formatDateTime(project.forwardedAt)}</span>
              </div>
              <div className="info-block">
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>TARGET STAGE</span>
                <span className="info-val">District Land Verification & Award</span>
              </div>
              <div className="info-block" style={{ gridColumn: 'span 3' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '3px' }}>PRIOR OFFICER REMARKS</span>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--gov-slate-800)',
                    padding: '8px 12px',
                    backgroundColor: 'var(--gov-slate-50)',
                    borderRadius: '4px',
                    border: '1px solid var(--gov-slate-200)',
                    lineHeight: '1.5',
                  }}
                >
                  {project.officerRemarks || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Input Forms */}
          {isConfirmingVerify && (
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--gov-green-50)',
                border: '1px solid var(--gov-green-200)',
                borderRadius: '6px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-green-900)', marginBottom: '8px' }}>
                Confirmation: Are you sure you want to verify this project for district execution?
              </div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--gov-green-800)', marginBottom: '4px' }}>
                Verification Remarks (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Cadastral survey verified and cleared for district execution."
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '12px',
                  border: '1px solid var(--gov-green-300)',
                  borderRadius: '4px',
                  marginBottom: '10px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  className="gov-btn gov-btn-secondary gov-btn-sm"
                  onClick={() => setIsConfirmingVerify(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="gov-btn gov-btn-primary gov-btn-sm"
                  onClick={handleVerify}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying...' : 'Confirm Acceptance / Verification'}
                </button>
              </div>
            </div>
          )}

          {isRejecting && (
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--gov-red-50)',
                border: '1px solid var(--gov-red-200)',
                borderRadius: '6px',
              }}
            >
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--gov-red-900)', marginBottom: '6px' }}>
                Reason for Return / Rejection (Mandatory) *
              </label>
              <textarea
                rows={3}
                placeholder="Enter detailed reason why the project is being returned/rejected..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="gov-btn gov-btn-danger gov-btn-sm"
                  onClick={handleReturn}
                  disabled={isSubmitting || !justification.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Return / Reject'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* C. Action Footer / Decision Controls */}
        <div
          className="gov-modal-footer"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderTop: '1px solid var(--gov-slate-200)',
            backgroundColor: 'var(--gov-slate-50)',
          }}
        >
          <button
            className="gov-btn gov-btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Close
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isRejecting && !isConfirmingVerify && (
              <button
                className="gov-btn gov-btn-danger"
                onClick={() => setIsRejecting(true)}
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <XCircle size={14} />
                <span>RETURN / REJECT</span>
              </button>
            )}

            {!isRejecting && !isConfirmingVerify && (
              <button
                className="gov-btn gov-btn-primary"
                onClick={() => setIsConfirmingVerify(true)}
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <CheckCircle2 size={14} />
                <span>ACCEPT / VERIFY PROJECT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
