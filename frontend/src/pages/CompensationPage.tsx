import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompensationRecord, CompensationStatus } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Send,
  RefreshCw,
  FileSpreadsheet,
  Building
} from 'lucide-react';

export const CompensationPage: React.FC = () => {
  const {
    compensationRecords,
    updateCompensationStatus,
    activeProject,
    searchQuery: globalSearch,
    approvedProjectsLA,
    currentRole
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterVillage, setFilterVillage] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<CompensationRecord | null>(null);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);

  const searchKeyword = (localSearch || globalSearch).toLowerCase().trim();

  const filteredRecords = compensationRecords.filter((rec) => {
    const matchesStatus = filterStatus === 'ALL' || rec.paymentStatus === filterStatus;
    const matchesVillage = filterVillage === 'ALL' || rec.village === filterVillage;
    const matchesSearch =
      !searchKeyword ||
      rec.ownerBeneficiary.toLowerCase().includes(searchKeyword) ||
      rec.surveyNumber.toLowerCase().includes(searchKeyword) ||
      rec.khataNumber.toLowerCase().includes(searchKeyword) ||
      rec.awardOrderNumber.toLowerCase().includes(searchKeyword);

    return matchesStatus && matchesVillage && matchesSearch;
  });

  const totalAssessed = compensationRecords.reduce((sum, r) => sum + r.assessedAmount, 0);
  const totalPaid = compensationRecords.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalPending = compensationRecords.reduce((sum, r) => sum + r.pendingAmount, 0);

  const handleDisbursePayment = () => {
    if (!selectedRecord) return;
    updateCompensationStatus(selectedRecord.id, 'Paid', `RBI-NEFT-${Date.now().toString().slice(-8)}`);
    setIsDisburseModalOpen(false);
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Compensation Management & Direct Benefit Transfer</h1>
          <p className="page-subtitle">
            Section 3G / RFCTLARR statutory award compensation ledger, e-Kuber bank disbursements and escrow management
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="gov-btn gov-btn-secondary"
            onClick={() => alert('Exporting Treasury RTGS payment scroll (RBI NEFT format)...')}
          >
            <Download size={13} /> Export Bank Scroll
          </button>
          <button
            className="gov-btn gov-btn-primary"
            onClick={() => alert('Batch processing 18 verified DBT payments to Lead Bank Gateway...')}
          >
            <Send size={13} /> Batch Disburse via e-Kuber
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <MetricCard
          label="Total Assessed"
          value="₹120.4 Cr"
          subtext="Under Section 3G Awards"
          icon={<IndianRupee size={18} />}
          highlight
        />
        <MetricCard
          label="Compensation Paid"
          value="₹95.2 Cr"
          subtext="79.0% Transferred"
          icon={<CheckCircle2 size={18} />}
        />
        <MetricCard
          label="Pending Disbursement"
          value="₹25.2 Cr"
          subtext="18 Parcels in Scrutiny"
          icon={<Clock size={18} />}
        />
        <MetricCard
          label="Total Beneficiaries"
          value="143"
          subtext="Title Holders & Tenants"
          icon={<Building size={18} />}
        />
      </div>

      {/* Assessed vs Paid Progress Visual Card */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <span>Disbursement Progress Overview</span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--gov-slate-500)' }}>
              e-Kuber Direct Benefit Transfer (DBT) Payout Efficiency
            </span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-green-700)' }}>
            79.0% Completed
          </span>
        </div>

        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--gov-slate-200)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: '79%', height: '100%', backgroundColor: 'var(--gov-green-600)' }} title="Paid: ₹95.2 Cr" />
          <div style={{ width: '15%', height: '100%', backgroundColor: 'var(--gov-amber-500)' }} title="Processing: ₹18.1 Cr" />
          <div style={{ width: '6%', height: '100%', backgroundColor: 'var(--gov-red-500)' }} title="Disputed/Failed: ₹7.1 Cr" />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '11.5px', color: 'var(--gov-slate-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--gov-green-600)', borderRadius: '2px' }} />
            <span>Disbursed & Reconciled (₹95.2 Cr)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--gov-amber-500)', borderRadius: '2px' }} />
            <span>Processing / Treasury Queue (₹18.1 Cr)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--gov-red-500)', borderRadius: '2px' }} />
            <span>Failed / Joint Khata Dispute (₹7.1 Cr)</span>
          </div>
        </div>
      </div>

      {/* APPROVED PROJECTS QUEUE FOR FINANCIAL OFFICER (FETCHED FROM lams_db.Project_Approval_LA) */}
      <div className="gov-card" style={{ borderLeft: '4px solid var(--gov-green-600)' }}>
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Building size={16} color="var(--gov-green-700)" />
            <span>APPROVED PROJECTS FOR FINANCIAL DISBURSEMENT (from lams_db.Project_Approval_LA)</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
            Source of Truth: MongoDB Collection <code>Project_Approval_LA</code> ({approvedProjectsLA.length} Approved Projects)
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project Code</th>
                <th>Project Title</th>
                <th>Implementing Agency</th>
                <th>District</th>
                <th>Land Req / Selected</th>
                <th>Parcels</th>
                <th>Assessed Comp.</th>
                <th>Approved By (Minister/SLAO)</th>
                <th>Approval Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedProjectsLA.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: 'var(--gov-slate-500)', fontSize: '12px' }}>
                    No approved projects currently found in <code>lams_db.Project_Approval_LA</code>. Proposals approved by the Land Acquisition Officer will appear here automatically.
                  </td>
                </tr>
              ) : (
                approvedProjectsLA.map((ap: any) => (
                  <tr key={ap.id || ap.sourceProjectId} style={{ backgroundColor: '#f0fdf4' }}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gov-blue-700)' }}>
                      {ap.projectCode || ap.code}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>
                      {ap.projectName || ap.name}
                    </td>
                    <td style={{ fontSize: '11.5px' }}>
                      {ap.implementingAgency || ap.agencyName || 'KSHIP'}
                    </td>
                    <td style={{ fontWeight: 600 }}>{ap.district}</td>
                    <td style={{ fontSize: '11.5px' }}>
                      <strong>{ap.landRequiredAcres} Ac</strong> / {ap.landAcquiredAcres || ap.selectedLandAcres || 0} Ac
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>
                      {ap.selectedParcelCount || ap.selectedParcelIds?.length || 0}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                      ₹ {ap.estimatedCompensationCr || ap.totalCompensationAssessedCr || 0} Cr
                    </td>
                    <td style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--gov-navy-800)' }}>
                      {ap.approvedBy || ap.verification?.reviewedBy || 'Shri R. K. Hegde, SLAO'}
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                      {ap.approvedAt ? new Date(ap.approvedAt).toLocaleString('en-IN') : 'Just now'}
                    </td>
                    <td>
                      <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                        FORWARDED TO FINANCE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
            placeholder="Search Beneficiary name, Sy. No., Khata, Bank..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Village:</span>
          <select
            className="gov-select"
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
          >
            <option value="ALL">All Villages</option>
            <option value="Avverahalli">Avverahalli</option>
            <option value="Kallugopahalli">Kallugopahalli</option>
            <option value="Sheshagirihalli">Sheshagirihalli</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Payment Status:</span>
          <select
            className="gov-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Payment Failed">Payment Failed</option>
          </select>
        </div>
      </div>

      {/* Compensation Data Table */}
      <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Survey Number</th>
                <th>Owner / Beneficiary</th>
                <th>Village & Taluk</th>
                <th>Khata Number</th>
                <th style={{ textAlign: 'right' }}>Assessed Amount</th>
                <th style={{ textAlign: 'right' }}>Approved Amount</th>
                <th style={{ textAlign: 'right' }}>Paid Amount</th>
                <th style={{ textAlign: 'right' }}>Pending Amount</th>
                <th>Payment Status</th>
                <th>Disbursement Ref</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Sy. No. {rec.surveyNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{rec.ownerBeneficiary}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)', fontFamily: 'var(--font-mono)' }}>
                      {rec.bankAccountMasked} ({rec.ifscCode})
                    </div>
                  </td>
                  <td>{rec.village}, {rec.taluk}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{rec.khataNumber}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{(rec.assessedAmount / 100000).toFixed(2)} L</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{(rec.approvedAmount / 100000).toFixed(2)} L</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gov-green-700)' }}>
                    ₹{(rec.paidAmount / 100000).toFixed(2)} L
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: rec.pendingAmount > 0 ? 'var(--gov-amber-700)' : 'var(--gov-slate-500)' }}>
                    ₹{(rec.pendingAmount / 100000).toFixed(2)} L
                  </td>
                  <td><StatusBadge status={rec.paymentStatus} size="sm" /></td>
                  <td style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--gov-slate-500)' }}>
                    {rec.transactionReference || 'Awaiting Batch'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {rec.paymentStatus !== 'Paid' ? (
                      <button
                        className="gov-btn gov-btn-primary gov-btn-sm"
                        onClick={() => {
                          setSelectedRecord(rec);
                          setIsDisburseModalOpen(true);
                        }}
                      >
                        Process Payout
                      </button>
                    ) : (
                      <button
                        className="gov-btn gov-btn-secondary gov-btn-sm"
                        onClick={() => alert(`Receipt Reference: ${rec.transactionReference}\nAward Order: ${rec.awardOrderNumber}`)}
                      >
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disburse Modal */}
      <Modal
        isOpen={isDisburseModalOpen}
        onClose={() => setIsDisburseModalOpen(false)}
        title="Sanction & Disburse Compensation"
        subtitle={selectedRecord ? `Sy. No. ${selectedRecord.surveyNumber} · ${selectedRecord.ownerBeneficiary}` : ''}
        footer={
          <>
            <button className="gov-btn gov-btn-secondary" onClick={() => setIsDisburseModalOpen(false)}>
              Cancel
            </button>
            <button className="gov-btn gov-btn-primary" onClick={handleDisbursePayment}>
              Authorize Bank Transfer (e-Kuber)
            </button>
          </>
        }
      >
        {selectedRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--gov-slate-200)',
                fontSize: '11.5px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}
            >
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Approved Amount:</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                  ₹{(selectedRecord.approvedAmount / 100000).toFixed(2)} Lakh
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Bank Account:</span>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {selectedRecord.bankAccountMasked}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>IFSC Code:</span>
                <div style={{ fontWeight: 600 }}>{selectedRecord.ifscCode}</div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Award Order:</span>
                <div style={{ fontWeight: 600 }}>{selectedRecord.awardOrderNumber}</div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
                Payment Gateway Channel
              </label>
              <select className="gov-select" style={{ width: '100%' }} defaultValue="Direct RTGS">
                <option value="Direct RTGS">RBI e-Kuber / State Treasury Direct RTGS</option>
                <option value="Escrow">State Land Acquisition Escrow Account</option>
                <option value="Court">Civil Court Reference Deposit (Dispute)</option>
              </select>
            </div>

            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--gov-green-50)',
                border: '1px solid var(--gov-green-100)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                color: 'var(--gov-green-700)'
              }}
            >
              Aadhaar & Bank Account DBT authentication verified via National Payments Corporation of India (NPCI) gateway.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
