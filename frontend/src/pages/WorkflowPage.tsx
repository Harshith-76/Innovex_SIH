import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
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
  ArrowRight
} from 'lucide-react';

export const WorkflowPage: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    activeProject,
    setCurrentPage,
    documents
  } = useApp();

  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(5); // default Compensation stage
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState('');

  if (!activeProject) return null;

  const currentStageDetail = activeProject.stages[selectedStageIndex] || activeProject.stages[0];

  const pendingActionItems = [
    {
      id: 'act-01',
      stage: 'Compensation',
      title: 'Disbursement Verification for 18 High-Priority Carriageway Parcels',
      authority: 'Special Land Acquisition Officer (SLAO Ramanagara)',
      deadline: '2026-09-15',
      priority: 'High',
      status: 'In Scrutiny'
    },
    {
      id: 'act-02',
      stage: 'Compensation',
      title: 'Joint Khata Probate Scrutiny for Sy. No. 85/2 (Sheshagirihalli)',
      authority: 'Tahasildar Bidadi',
      deadline: '2026-09-08',
      priority: 'High',
      status: 'Awaiting Document'
    },
    {
      id: 'act-03',
      stage: 'Possession',
      title: 'Section 3E Physical Possession Notice Service & Police Bandobast Mahazar',
      authority: 'Revenue Inspector & Circle Police Inspector',
      deadline: '2026-10-15',
      priority: 'Medium',
      status: 'Draft Prepared'
    },
    {
      id: 'act-04',
      stage: 'R&R',
      title: 'Final Allotment Order Issue for 7 Families in Sheshagirihalli Phase-2 Layout',
      authority: 'Deputy Commissioner Bengaluru Rural',
      deadline: '2026-09-30',
      priority: 'High',
      status: 'Gram Sabha Verified'
    }
  ];

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Acquisition Workflow & Stage Pipeline</h1>
          <p className="page-subtitle">
            Statutory workflow tracking under the Right to Fair Compensation and Transparency in Land Acquisition (RFCTLARR) Act 2013
          </p>
        </div>

        {/* Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Select Project:</span>
          <select
            className="gov-select"
            style={{ fontWeight: 600, maxWidth: '340px' }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.code} — {proj.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Status Overview Card */}
      <div className="gov-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontFamily: 'var(--font-mono)' }}>
              {activeProject.code} · {activeProject.implementingAgency}
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
              {activeProject.name}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Current Operational Stage</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-blue-700)' }}>
                {activeProject.currentStage}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--gov-slate-200)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Overall Acquisition Velocity</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-green-700)' }}>
                {activeProject.progressPercentage}% Completed
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Workflow Stepper */}
        <div className="workflow-stepper" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gov-slate-200)' }}>
          {activeProject.stages.map((stg, idx) => {
            const isCurrentSelected = idx === selectedStageIndex;
            return (
              <div
                key={stg.stage}
                className={`workflow-step ${stg.status === 'Completed' ? 'completed' : stg.status === 'In Progress' ? 'active' : 'pending'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedStageIndex(idx)}
              >
                <div className="workflow-step-line" />
                <div
                  className="workflow-step-node"
                  style={{
                    boxShadow: isCurrentSelected ? '0 0 0 4px rgba(29, 92, 176, 0.4)' : undefined,
                    transform: isCurrentSelected ? 'scale(1.15)' : undefined,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {stg.status === 'Completed' ? '✓' : idx + 1}
                </div>
                <div className="workflow-step-label" style={{ color: isCurrentSelected ? 'var(--gov-blue-700)' : undefined }}>
                  {stg.stage}
                </div>
                <div className="workflow-step-status">
                  {stg.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Stage Detail & Pending Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
        {/* Selected Stage Comprehensive Audit Profile */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <ShieldCheck size={16} color="var(--gov-blue-600)" />
              <span>Stage {selectedStageIndex + 1}: {currentStageDetail.stage} Details</span>
            </div>
            <StatusBadge status={currentStageDetail.status} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--gov-slate-800)', lineHeight: '1.5' }}>
              {currentStageDetail.notes}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                backgroundColor: 'var(--gov-slate-50)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--gov-slate-200)',
                fontSize: '11.5px'
              }}
            >
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Competent Authority:</span>
                <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                  {currentStageDetail.responsibleAuthority}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Target Milestone Date:</span>
                <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                  {currentStageDetail.targetDate}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Statutory Notice Period:</span>
                <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                  21 Days Gazetted Window
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Completion Date:</span>
                <div style={{ fontWeight: 600, color: currentStageDetail.completedDate ? 'var(--gov-green-700)' : 'var(--gov-amber-700)', marginTop: '2px' }}>
                  {currentStageDetail.completedDate || 'In Progress'}
                </div>
              </div>
            </div>

            {/* Document Checklist for this stage */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
                Stage Compliance Documents ({currentStageDetail.documentsCount} Registered)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11.5px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} color="var(--gov-slate-500)" />
                    Section 3A / 3G Gazette Publication Order Copy
                  </span>
                  <button
                    className="gov-btn gov-btn-secondary gov-btn-sm"
                    onClick={() => setCurrentPage('documents')}
                  >
                    View Doc
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11.5px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} color="var(--gov-slate-500)" />
                    Joint Measurement Survey (JMS) & DGPS Shapefiles
                  </span>
                  <button
                    className="gov-btn gov-btn-secondary gov-btn-sm"
                    onClick={() => setCurrentPage('gis-parcels')}
                  >
                    Cadastre
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Actions & Orders Checklist */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Clock size={16} color="var(--gov-amber-600)" />
              <span>Pending Administrative Actions ({pendingActionItems.length})</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingActionItems.map((act) => (
              <div
                key={act.id}
                style={{
                  border: '1px solid var(--gov-slate-200)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  backgroundColor: '#ffffff',
                  fontSize: '11.5px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>
                    {act.title}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: act.priority === 'High' ? 'var(--gov-red-100)' : 'var(--gov-amber-100)',
                      color: act.priority === 'High' ? 'var(--gov-red-700)' : 'var(--gov-amber-700)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {act.priority}
                  </span>
                </div>

                <div style={{ color: 'var(--gov-slate-500)', fontSize: '10.5px', marginTop: '4px' }}>
                  Authority: {act.authority} · Target: {act.deadline}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--gov-blue-700)', fontWeight: 500 }}>
                    Status: {act.status}
                  </span>
                  <button
                    className="gov-btn gov-btn-primary gov-btn-sm"
                    style={{ fontSize: '10.5px' }}
                    onClick={() => {
                      setActionTitle(act.title);
                      setIsActionModalOpen(true);
                    }}
                  >
                    Action Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Order Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Execute Administrative Action"
        subtitle={actionTitle}
        footer={
          <>
            <button className="gov-btn gov-btn-secondary" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </button>
            <button
              className="gov-btn gov-btn-primary"
              onClick={() => {
                alert('Administrative order executed, verified, and logged in state audit trail.');
                setIsActionModalOpen(false);
              }}
            >
              Sign & Issue Order
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
              Official Proceeding / Endorsement Reference
            </label>
            <input
              type="text"
              className="gov-input"
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              defaultValue="LAO/RAMANAGARA/ORDER/2026/089"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
              Verification Findings & Sanction Order Text
            </label>
            <textarea
              className="gov-input"
              rows={4}
              style={{ width: '100%', resize: 'none' }}
              defaultValue="Having verified the joint field measurement survey mahazar and khatadar identity documents under Section 3G, sanction is hereby accorded for direct bank transfer into the beneficiary Aadhaar-linked account."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
