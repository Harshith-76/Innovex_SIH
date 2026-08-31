import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
import { ProjectRouteMap } from '../components/gis/ProjectRouteMap';
import { LandAcquisitionProject, ProjectWorkflowStatus, LandParcel } from '../types';
import {
  GitBranch,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Building2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Plus,
  ArrowRight,
  Eye,
  MapPin,
  Layers,
  Send,
  RotateCcw,
  XCircle,
  ExternalLink,
  FileSearch,
  CheckSquare,
  Square,
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';

interface OwnershipDocItem {
  id: string;
  title: string;
  category: string;
  filename: string;
  svgUrl: string;
  status: 'AVAILABLE' | 'REVIEWED' | 'MISSING' | 'PENDING';
  updatedAt: string;
}

export const WorkflowPage: React.FC = () => {
  const {
    projects,
    parcels,
    selectedProjectId,
    setSelectedProjectId,
    activeProject,
    setCurrentPage,
    updateProjectVerification,
    currentRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'land-verification' | 'gis-impact' | 'documents' | 'decision'>('overview');
  const [reviewingProject, setReviewingProject] = useState<LandAcquisitionProject | null>(null);

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState<OwnershipDocItem | null>(null);

  // Checklist State
  const defaultChecklist: Record<string, boolean> = {
    projDetails: false,
    agencyVerified: false,
    landReqVerified: false,
    parcelsVerified: false,
    documentsReviewed: false,
    gisBoundariesVerified: false,
    alignmentReviewed: false,
    projectDocsReviewed: false
  };

  const [checklist, setChecklist] = useState<Record<string, boolean>>(defaultChecklist);
  const [officerRemarks, setOfficerRemarks] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Update reviewing project when activeProject or projects state changes
  useEffect(() => {
    if (reviewingProject) {
      const updated = projects.find(p => p.id === reviewingProject.id);
      if (updated) {
        setReviewingProject(updated);
      }
    }
  }, [projects]);

  // Load existing checklist and remarks if available on project
  useEffect(() => {
    if (reviewingProject) {
      if (reviewingProject.verification?.checklist) {
        setChecklist({ ...defaultChecklist, ...reviewingProject.verification.checklist });
      } else {
        setChecklist(defaultChecklist);
      }
      if (reviewingProject.verification?.officerRemarks) {
        setOfficerRemarks(reviewingProject.verification.officerRemarks);
      } else {
        setOfficerRemarks('');
      }
    }
  }, [reviewingProject?.id]);

  // Calculate dynamic KPI card numbers from actual MongoDB projects
  const newProposalsCount = projects.filter(
    p => p.status === 'SUBMITTED' || p.status === 'RESUBMITTED' || p.currentStage === 'Proposal'
  ).length;

  const underVerificationCount = projects.filter(
    p => p.status === 'UNDER_VERIFICATION'
  ).length;

  const returnedCount = projects.filter(
    p => p.status === 'RETURNED_FOR_CORRECTION'
  ).length;

  const verifiedCount = projects.filter(
    p => p.status === 'VERIFIED' || p.status === 'FORWARDED_TO_FINANCIAL_OFFICER'
  ).length;

  const highPriorityCount = projects.filter(
    p => p.riskScore >= 35 || p.status === 'UNDER_VERIFICATION' || p.status === 'SUBMITTED'
  ).length;

  // Filter projects awaiting officer verification
  const pendingProjects = projects.filter(p => 
    p.status === 'SUBMITTED' ||
    p.status === 'RESUBMITTED' ||
    p.status === 'UNDER_VERIFICATION' ||
    p.status === 'RETURNED_FOR_CORRECTION' ||
    p.status === 'VERIFIED' ||
    p.status === 'FORWARDED_TO_FINANCIAL_OFFICER' ||
    p.status === 'In Progress'
  );

  const ownershipDocs: OwnershipDocItem[] = [
    {
      id: 'doc-rtc',
      title: 'RTC / Pahani (Form 16 Extract)',
      category: 'Record of Rights & Tenancy',
      filename: 'rtc-pahani.svg',
      svgUrl: '/demo-documents/rtc-pahani.svg',
      status: 'AVAILABLE',
      updatedAt: '2026-01-12'
    },
    {
      id: 'doc-mut',
      title: 'Mutation Extract Register (JMR Form 12)',
      category: 'Title Transition Record',
      filename: 'mutation-register.svg',
      svgUrl: '/demo-documents/mutation-register.svg',
      status: 'AVAILABLE',
      updatedAt: '2026-01-14'
    },
    {
      id: 'doc-part',
      title: 'Registered Family Partition Deed Extract',
      category: 'Co-Sharer Allotment Schedule',
      filename: 'partition-deed.svg',
      svgUrl: '/demo-documents/partition-deed.svg',
      status: 'AVAILABLE',
      updatedAt: '2026-01-15'
    },
    {
      id: 'doc-inhe',
      title: 'Genealogical Tree & Survivorship Certificate (Varisu)',
      category: 'Intestate Succession Document',
      filename: 'inheritance-document.svg',
      svgUrl: '/demo-documents/inheritance-document.svg',
      status: 'AVAILABLE',
      updatedAt: '2026-01-18'
    }
  ];

  const handleStartReview = (proj: LandAcquisitionProject) => {
    setReviewingProject(proj);
    setSelectedProjectId(proj.id);
    setActiveTab('overview');
    setDecisionFeedback(null);

    // If status is SUBMITTED, transition to UNDER_VERIFICATION upon review
    if (proj.status === 'SUBMITTED' || proj.status === 'RESUBMITTED' || proj.status === 'In Progress') {
      updateProjectVerification(proj.id, {
        status: 'UNDER_VERIFICATION',
        verification: {
          ...proj.verification,
          status: 'UNDER_VERIFICATION',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Shri R. K. Hegde, SLAO'
        }
      });
    }
  };

  const handleToggleChecklist = (key: string) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const completedChecklistCount = Object.values(checklist).filter(Boolean).length;
  const isChecklistComplete = completedChecklistCount === 8;

  const handleDecision = async (decisionType: 'RETURN' | 'REJECT' | 'APPROVE') => {
    if (!reviewingProject) return;

    if ((decisionType === 'RETURN' || decisionType === 'REJECT') && !officerRemarks.trim()) {
      alert('Please enter officer verification remarks explaining the reason for return/rejection.');
      return;
    }

    if (decisionType === 'APPROVE' && !isChecklistComplete) {
      alert('All mandatory checklist items must be completed before approving and forwarding the proposal.');
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();

    let newStatus: ProjectWorkflowStatus = 'UNDER_VERIFICATION';
    let decisionCode: 'VERIFIED' | 'RETURNED' | 'REJECTED' = 'VERIFIED';

    if (decisionType === 'RETURN') {
      newStatus = 'RETURNED_FOR_CORRECTION';
      decisionCode = 'RETURNED';
    } else if (decisionType === 'REJECT') {
      newStatus = 'REJECTED';
      decisionCode = 'REJECTED';
    } else if (decisionType === 'APPROVE') {
      // Transition through VERIFIED state, then set FORWARDED_TO_FINANCIAL_OFFICER
      newStatus = 'FORWARDED_TO_FINANCIAL_OFFICER';
      decisionCode = 'VERIFIED';
    }

    const verificationPayload = {
      status: newStatus,
      officerRemarks: officerRemarks.trim(),
      checklist,
      reviewedAt: now,
      reviewedBy: 'Shri R. K. Hegde, SLAO Ramanagara',
      decision: decisionCode
    };

    try {
      await updateProjectVerification(reviewingProject.id, {
        status: newStatus,
        verification: verificationPayload
      });

      if (decisionType === 'APPROVE') {
        setDecisionFeedback('✅ Proposal successfully verified and forwarded to Financial Officer!');
      } else if (decisionType === 'RETURN') {
        setDecisionFeedback('↩️ Proposal returned to Implementing Agency for correction with officer observations.');
      } else {
        setDecisionFeedback('❌ Proposal rejected by Land Acquisition Officer.');
      }
    } catch (err) {
      console.error('Error recording officer decision:', err);
      alert('Failed to save officer decision. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract selected parcels for current reviewing project
  const selectedParcelsForReview: LandParcel[] = reviewingProject?.selectedParcelIds
    ? parcels.filter(p => reviewingProject.selectedParcelIds?.includes(p.parcelId))
    : [];

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gov-blue-700)', backgroundColor: 'var(--gov-blue-50)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--gov-blue-200)', textTransform: 'uppercase' }}>
              OFFICER VERIFICATION MODULE
            </span>
            {currentRole !== 'Land Acquisition Officer' && (
              <span style={{ fontSize: '11px', color: '#b45309', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                Note: Currently viewing in {currentRole} demo mode. Switch role in top header for officer controls.
              </span>
            )}
          </div>
          <h1 className="page-title" style={{ marginTop: '6px', fontSize: '20px', letterSpacing: '-0.01em' }}>
            LAND ACQUISITION OFFICER — ACQUISITION WINDOW
          </h1>
          <p className="page-subtitle">
            Review, verify and process land acquisition proposals submitted by implementing agencies.
          </p>
        </div>

        {/* Global Project Quick Switcher */}
        {reviewingProject && (
          <button
            className="gov-btn gov-btn-secondary"
            onClick={() => setReviewingProject(null)}
          >
            ← Back to Verification Queue
          </button>
        )}
      </div>

      {/* Top 5 Dynamic KPI Cards */}
      {!reviewingProject && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {/* Card 1: New Proposals */}
          <div className="gov-card" style={{ padding: '14px', borderLeft: '4px solid var(--gov-blue-600)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-500)', textTransform: 'uppercase' }}>
              1. NEW PROPOSALS
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gov-navy-900)', marginTop: '4px' }}>
              {newProposalsCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '4px' }}>
              Submitted by agencies
            </div>
          </div>

          {/* Card 2: Under Verification */}
          <div className="gov-card" style={{ padding: '14px', borderLeft: '4px solid var(--gov-amber-500)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-500)', textTransform: 'uppercase' }}>
              2. UNDER VERIFICATION
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gov-amber-700)', marginTop: '4px' }}>
              {underVerificationCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '4px' }}>
              In officer review queue
            </div>
          </div>

          {/* Card 3: Returned for Correction */}
          <div className="gov-card" style={{ padding: '14px', borderLeft: '4px solid #ea580c' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-500)', textTransform: 'uppercase' }}>
              3. RETURNED FOR CORRECTION
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#c2410c', marginTop: '4px' }}>
              {returnedCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '4px' }}>
              Sent back to agencies
            </div>
          </div>

          {/* Card 4: Verified */}
          <div className="gov-card" style={{ padding: '14px', borderLeft: '4px solid var(--gov-green-600)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-500)', textTransform: 'uppercase' }}>
              4. VERIFIED
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gov-green-700)', marginTop: '4px' }}>
              {verifiedCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '4px' }}>
              Verified &amp; Forwarded
            </div>
          </div>

          {/* Card 5: High Priority */}
          <div className="gov-card" style={{ padding: '14px', borderLeft: '4px solid var(--gov-red-600)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-500)', textTransform: 'uppercase' }}>
              5. HIGH PRIORITY
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gov-red-700)', marginTop: '4px' }}>
              {highPriorityCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '4px' }}>
              Requires immediate action
            </div>
          </div>
        </div>
      )}

      {/* Main Queue View when no project is open for detailed review */}
      {!reviewingProject ? (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <FileSearch size={18} color="var(--gov-blue-700)" />
              <span>PROJECTS AWAITING VERIFICATION ({pendingProjects.length})</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--gov-slate-500)' }}>
              Real-time proposals synced with MongoDB Atlas <span style={{ color: '#059669', fontWeight: 700 }}>● Live (8s Polling)</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Project Code</th>
                  <th>Project Name</th>
                  <th>Agency</th>
                  <th>Project Type</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Land Req.</th>
                  <th>Selected Land</th>
                  <th>Parcels</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingProjects.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: 'center', padding: '30px', color: 'var(--gov-slate-500)' }}>
                      No submitted project proposals currently awaiting officer verification.
                    </td>
                  </tr>
                ) : (
                  pendingProjects.map((proj) => {
                    const isNew = proj.status === 'SUBMITTED' || proj.status === 'RESUBMITTED';
                    return (
                      <tr key={proj.id} style={{ backgroundColor: isNew ? '#f0fdf4' : undefined }}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gov-blue-700)' }}>
                          {proj.code}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>
                          {proj.name}
                        </td>
                        <td style={{ fontSize: '11.5px', color: 'var(--gov-slate-700)' }}>
                          {proj.implementingAgency || proj.agencyName || 'KSHIP'}
                        </td>
                        <td style={{ fontSize: '11.5px' }}>
                          {proj.projectType || 'Highway Infrastructure'}
                        </td>
                        <td>{proj.state || 'Karnataka'}</td>
                        <td style={{ fontWeight: 600 }}>{proj.district}</td>
                        <td style={{ fontWeight: 600 }}>{proj.landRequiredAcres} Ac</td>
                        <td style={{ color: 'var(--gov-blue-700)', fontWeight: 600 }}>
                          {proj.landAcquiredAcres || 0} Ac
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>
                          {proj.selectedParcelIds?.length || 0}
                        </td>
                        <td style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                          {proj.submittedAt || proj.lastUpdated || 'Today'}
                        </td>
                        <td>
                          <StatusBadge status={proj.status} />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="gov-btn gov-btn-primary gov-btn-sm"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                            onClick={() => handleStartReview(proj)}
                          >
                            <Eye size={12} />
                            REVIEW PROJECT
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
      ) : (
        /* Detailed Officer Project Verification Workspace */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Project Summary Banner */}
          <div className="gov-card" style={{ backgroundColor: '#ffffff', borderTop: '4px solid var(--gov-blue-700)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--gov-blue-700)', backgroundColor: 'var(--gov-blue-50)', padding: '2px 8px', borderRadius: '4px' }}>
                    {reviewingProject.code}
                  </span>
                  <StatusBadge status={reviewingProject.status} />
                  <span style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                    Submitted: {reviewingProject.submittedAt || reviewingProject.lastUpdated || '2026-01-10'}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gov-navy-900)', marginTop: '6px' }}>
                  {reviewingProject.name}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginTop: '2px' }}>
                  Agency: <strong>{reviewingProject.implementingAgency || reviewingProject.agencyName}</strong> · District: <strong>{reviewingProject.district}</strong> · State: <strong>{reviewingProject.state}</strong>
                </div>
              </div>

              {/* Action items feedback banner if set */}
              {decisionFeedback && (
                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, color: '#047857', maxWidth: '400px' }}>
                  {decisionFeedback}
                </div>
              )}
            </div>

            {/* Dark Blue Navigation Buttons for Officer Review */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--gov-slate-200)' }}>
              {[
                { id: 'overview', label: '1. PROJECT OVERVIEW' },
                { id: 'land-verification', label: `2. LAND & TITLE VERIFICATION (${reviewingProject.selectedParcelIds?.length || 0} PARCELS)` },
                { id: 'gis-impact', label: '3. GIS / LAND IMPACT' },
                { id: 'documents', label: '4. DOCUMENTS' },
                { id: 'decision', label: `5. VERIFICATION & DECISION (${completedChecklistCount}/8)` }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      backgroundColor: isActive ? '#0f2942' : '#1b365d',
                      color: '#ffffff',
                      border: isActive ? '1.5px solid #38bdf8' : '1px solid #14284b',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 2px 5px rgba(0, 0, 0, 0.25)' : '0 1px 2px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.15s ease',
                      letterSpacing: '0.01em'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#132847';
                        e.currentTarget.style.borderColor = '#254b7c';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#1b365d';
                        e.currentTarget.style.borderColor = '#14284b';
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: PROJECT OVERVIEW (Read-only agency proposal) */}
          {activeTab === 'overview' && (
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="gov-card-title">
                  <Building2 size={16} color="var(--gov-blue-700)" />
                  <span>AGENCY SUBMITTED PROPOSAL SPECIFICATIONS (READ-ONLY)</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                  Submitted by implementing agency. Values cannot be altered by officer.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '12.5px' }}>
                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Project Code</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    {reviewingProject.code}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Project Name</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                    {reviewingProject.name}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Project Type</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                    {reviewingProject.projectType || 'Highway Infrastructure'}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Parent Authority</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                    {reviewingProject.parentAuthority || 'Public Works Department, Govt of Karnataka'}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Agency Name &amp; Type</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                    {reviewingProject.agencyName || reviewingProject.implementingAgency} ({reviewingProject.agencyType || 'State Authority'})
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>State &amp; District</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                    {reviewingProject.state} · {reviewingProject.district}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Land Requirement</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-blue-700)', marginTop: '2px' }}>
                    {reviewingProject.landRequiredAcres} Acres Required
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Selected Land Parcels</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-green-700)', marginTop: '2px' }}>
                    {reviewingProject.landAcquiredAcres || 0} Acres ({reviewingProject.selectedParcelIds?.length || 0} Parcels)
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--gov-slate-50)', padding: '12px', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Estimated Compensation Assessment</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                    ₹ {reviewingProject.totalCompensationAssessedCr || 0} Cr
                  </div>
                </div>
              </div>

              {/* Scope & Description */}
              <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--gov-slate-200)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-slate-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  PROPOSAL PURPOSE &amp; SCOPE STATEMENT
                </div>
                <div style={{ fontSize: '13px', color: 'var(--gov-navy-900)', lineHeight: '1.6' }}>
                  {reviewingProject.description || 'Public infrastructure land acquisition proposal submitted for statutory review and verification under RFCTLARR Act 2013.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAND & TITLE VERIFICATION */}
          {activeTab === 'land-verification' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Land Metrics Bar */}
              <div className="gov-card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Required Land</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                      {reviewingProject.landRequiredAcres} Ac
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Selected Land</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gov-blue-700)', marginTop: '2px' }}>
                      {reviewingProject.landAcquiredAcres || 0} Ac
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Remaining / Excess</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gov-amber-700)', marginTop: '2px' }}>
                      {Math.max(0, reviewingProject.landRequiredAcres - (reviewingProject.landAcquiredAcres || 0)).toFixed(2)} Ac
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Selected Parcels</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gov-green-700)', marginTop: '2px' }}>
                      {reviewingProject.selectedParcelIds?.length || 0}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Affected Villages</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                      {reviewingProject.villagesCount || 1}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Affected Families</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                      {reviewingProject.affectedFamiliesCount || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Parcels Schedule Table */}
              <div className="gov-card">
                <div className="gov-card-header">
                  <div className="gov-card-title">
                    <MapPin size={16} color="var(--gov-blue-700)" />
                    <span>SELECTED CADASTRAL LAND PARCELS (from lams_db.parcels)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                    Exact parcels linked via selectedParcelIds
                  </div>
                </div>

                {selectedParcelsForReview.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gov-slate-500)', fontSize: '12.5px' }}>
                    No selected land parcels have been associated with this project document yet.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th>Parcel ID</th>
                          <th>Survey No.</th>
                          <th>Cadastral ID</th>
                          <th>District</th>
                          <th>Taluk</th>
                          <th>Hobli</th>
                          <th>Village</th>
                          <th>Area</th>
                          <th>Category</th>
                          <th>Owner / Khatadar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedParcelsForReview.map(p => (
                          <tr key={p.parcelId}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gov-blue-700)' }}>
                              {p.parcelId}
                            </td>
                            <td style={{ fontWeight: 700 }}>{p.surveyNumber}</td>
                            <td style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{p.cadastralId || p.parcelId}</td>
                            <td>{p.district}</td>
                            <td>{p.taluk}</td>
                            <td>{p.hobli || 'Central'}</td>
                            <td style={{ fontWeight: 600 }}>{p.village}</td>
                            <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{p.areaAcres} {p.areaUnit}</td>
                            <td>{p.landType}</td>
                            <td style={{ fontSize: '11.5px', fontWeight: 600 }}>{p.ownerName || 'State Record'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* LAND OWNERSHIP & TITLE EVIDENCE DOCUMENTS */}
              <div className="gov-card">
                <div className="gov-card-header">
                  <div className="gov-card-title">
                    <FileText size={16} color="var(--gov-blue-700)" />
                    <span>LAND OWNERSHIP &amp; TITLE EVIDENCE DOCUMENTS</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                    Supporting local demo documents for officer scrutiny
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {ownershipDocs.map(doc => (
                    <div
                      key={doc.id}
                      style={{
                        border: '1px solid var(--gov-slate-200)',
                        borderRadius: '6px',
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                            {doc.title}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              backgroundColor: '#ecfdf5',
                              color: '#047857',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            {doc.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginTop: '2px' }}>
                          Category: {doc.category} · File: {doc.filename}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--gov-slate-100)' }}>
                        <span style={{ fontSize: '10.5px', color: 'var(--gov-slate-400)' }}>
                          Updated: {doc.updatedAt}
                        </span>
                        <button
                          className="gov-btn gov-btn-secondary gov-btn-sm"
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                          onClick={() => setViewingDoc(doc)}
                        >
                          <Eye size={12} />
                          VIEW DOCUMENT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* OWNERSHIP CROSS-VERIFICATION PANEL */}
              <div className="gov-card" style={{ borderLeft: '4px solid var(--gov-blue-600)' }}>
                <div className="gov-card-header">
                  <div className="gov-card-title">
                    <CheckCircle2 size={16} color="var(--gov-blue-700)" />
                    <span>OWNERSHIP CROSS-VERIFICATION COMPARISON MATRIX</span>
                  </div>
                </div>

                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>Verification Field</th>
                      <th>Land Record / Parcel Data</th>
                      <th>Document Evidence</th>
                      <th style={{ textAlign: 'center' }}>Verification Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Survey Number</td>
                      <td>Sy. No. 142/3A</td>
                      <td>Sy. No. 142/3A (RTC &amp; Mutation)</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          ✓ MATCH
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Extent / Area</td>
                      <td>4.625 Acres (4 Ac 25 Guntas)</td>
                      <td>4.625 Acres (Form 16 Pahani)</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          ✓ MATCH
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Village &amp; Taluk</td>
                      <td>Kenjaru, Mangaluru</td>
                      <td>Kenjaru, Mangaluru Taluk</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          ✓ MATCH
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Claimed / Recorded Khatadar</td>
                      <td>Smt. Parvathi Amma &amp; Ramesh Bhat</td>
                      <td>Parvathi Amma &amp; Ramesh Bhat (Partition Deed)</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          ✓ MATCH
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GIS / LAND IMPACT */}
          {activeTab === 'gis-impact' && (
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="gov-card-title">
                  <Layers size={16} color="var(--gov-blue-700)" />
                  <span>GIS CADASTRAL MAP &amp; ROUTE ALIGNMENT INSPECTION</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gov-blue-700)', backgroundColor: 'var(--gov-blue-50)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--gov-blue-200)' }}>
                    VIEW ALIGNMENT MODE (READ-ONLY)
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginBottom: '12px' }}>
                Showing exact selected project parcels ({reviewingProject.selectedParcelIds?.length || 0}) loaded from <code>lams_db.parcels</code> and saved alignment corridor (<code>routeWaypoints</code>).
              </div>

              <div style={{ height: '480px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--gov-slate-300)' }}>
                <ProjectRouteMap
                  waypoints={reviewingProject.routeWaypoints || []}
                  onWaypointsChange={() => {}}
                  rowWidthM={reviewingProject.rowWidthM || 30}
                  isDrawMode={false}
                  onToggleDrawMode={() => {}}
                  parcels={selectedParcelsForReview.length > 0 ? selectedParcelsForReview : parcels}
                  selectedParcelId={null}
                  onSelectParcel={() => {}}
                  height="480px"
                />
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="gov-card-title">
                  <FileText size={16} color="var(--gov-blue-700)" />
                  <span>PROJECT &amp; PARCEL DOCUMENT REPOSITORY</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '10px' }}>
                    PROJECT-LEVEL STATUTORY DOCUMENTS
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Project Proposal & DPR', 'Land Schedule Matrix', 'Approved Alignment Plan', 'Administrative Sanction Order'].map((docName, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid var(--gov-slate-200)', borderRadius: '4px', fontSize: '12px' }}>
                        <span>{docName}</span>
                        <button className="gov-btn gov-btn-secondary gov-btn-sm" style={{ fontSize: '10.5px' }}>
                          <Eye size={11} /> View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '10px' }}>
                    PARCEL OWNERSHIP EVIDENCE
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ownershipDocs.map(doc => (
                      <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid var(--gov-slate-200)', borderRadius: '4px', fontSize: '12px' }}>
                        <span>{doc.title}</span>
                        <button
                          className="gov-btn gov-btn-secondary gov-btn-sm"
                          style={{ fontSize: '10.5px' }}
                          onClick={() => setViewingDoc(doc)}
                        >
                          <Eye size={11} /> View Demo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VERIFICATION & DECISION */}
          {activeTab === 'decision' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Mandatory Checklist Section */}
              <div className="gov-card">
                <div className="gov-card-header">
                  <div className="gov-card-title">
                    <CheckSquare size={16} color="var(--gov-blue-700)" />
                    <span>MANDATORY OFFICER VERIFICATION CHECKLIST ({completedChecklistCount}/8)</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isChecklistComplete ? 'var(--gov-green-700)' : 'var(--gov-amber-700)' }}>
                    {isChecklistComplete ? '✓ All Items Completed' : `${8 - completedChecklistCount} items remaining`}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gov-slate-200)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(completedChecklistCount / 8) * 100}%`,
                      backgroundColor: isChecklistComplete ? 'var(--gov-green-600)' : 'var(--gov-blue-600)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { key: 'projDetails', label: '1. Project proposal specifications & scope verified' },
                    { key: 'agencyVerified', label: '2. Implementing agency credentials & authority verified' },
                    { key: 'landReqVerified', label: '3. Total land requirement & acreage verified' },
                    { key: 'parcelsVerified', label: '4. Selected cadastral parcel IDs & survey numbers verified' },
                    { key: 'documentsReviewed', label: '5. Land ownership documents (RTC, Mutation, Partition) reviewed' },
                    { key: 'gisBoundariesVerified', label: '6. GIS parcel boundaries & spatial geometry verified' },
                    { key: 'alignmentReviewed', label: '7. Proposed highway / infrastructure alignment reviewed' },
                    { key: 'projectDocsReviewed', label: '8. Required statutory DPR & land schedule documents reviewed' }
                  ].map(item => (
                    <div
                      key={item.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        border: '1px solid var(--gov-slate-200)',
                        borderRadius: '4px',
                        backgroundColor: checklist[item.key] ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleToggleChecklist(item.key)}
                    >
                      <input
                        type="checkbox"
                        checked={checklist[item.key] || false}
                        onChange={() => {}}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: checklist[item.key] ? 700 : 500, color: checklist[item.key] ? 'var(--gov-green-800)' : 'var(--gov-navy-900)' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Remarks Textarea */}
              <div className="gov-card">
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '6px' }}>
                  LAND ACQUISITION OFFICER VERIFICATION OBSERVATIONS &amp; REMARKS
                </div>
                <textarea
                  className="gov-input"
                  rows={4}
                  style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: '12.5px' }}
                  placeholder="Enter detailed verification findings, survey observations, or reasons for return/rejection..."
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                />
              </div>

              {/* Decision Action Buttons */}
              <div className="gov-card" style={{ borderTop: '4px solid var(--gov-blue-700)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '12px' }}>
                  OFFICER VERIFICATION DECISION
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="gov-btn"
                      style={{ backgroundColor: '#fff7ed', color: '#c2410c', borderColor: '#ffedd5', fontSize: '12px', fontWeight: 700 }}
                      onClick={() => handleDecision('RETURN')}
                      disabled={isSubmitting}
                    >
                      <RotateCcw size={14} />
                      RETURN FOR CORRECTION
                    </button>

                    <button
                      className="gov-btn"
                      style={{ backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fee2e2', fontSize: '12px', fontWeight: 700 }}
                      onClick={() => handleDecision('REJECT')}
                      disabled={isSubmitting}
                    >
                      <XCircle size={14} />
                      REJECT PROPOSAL
                    </button>
                  </div>

                  <button
                    className="gov-btn gov-btn-primary"
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      padding: '8px 20px',
                      opacity: !isChecklistComplete ? 0.6 : 1
                    }}
                    onClick={() => handleDecision('APPROVE')}
                    disabled={isSubmitting || !isChecklistComplete}
                  >
                    <Send size={14} />
                    APPROVE &amp; FORWARD TO FINANCIAL OFFICER
                  </button>
                </div>

                {!isChecklistComplete && (
                  <div style={{ fontSize: '11px', color: 'var(--gov-amber-700)', marginTop: '8px' }}>
                    ⚠️ APPROVE &amp; FORWARD will become enabled once all 8 mandatory checklist items are checked.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SVG DEMO DOCUMENT VIEWER MODAL */}
      <Modal
        isOpen={viewingDoc !== null}
        onClose={() => setViewingDoc(null)}
        title={viewingDoc?.title || 'Document Viewer'}
        subtitle={`Local Static Demo File: ${viewingDoc?.filename || ''}`}
      >
        {viewingDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Disclaimer Badge inside Modal */}
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: '4px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#dc2626' }}>
              ⚠️ SAMPLE — NOT A GOVERNMENT DOCUMENT ⚠️
            </div>

            {/* Embedded SVG Viewer */}
            <div style={{ width: '100%', height: '520px', border: '1px solid var(--gov-slate-300)', borderRadius: '4px', overflow: 'auto', backgroundColor: '#fcfcf9' }}>
              <iframe
                src={viewingDoc.svgUrl}
                title={viewingDoc.title}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
