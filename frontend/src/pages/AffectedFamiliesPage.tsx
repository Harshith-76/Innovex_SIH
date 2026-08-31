import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AffectedFamily } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
import {
  Users,
  Home,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  GraduationCap,
  IndianRupee,
  MapPin,
  FileCheck2
} from 'lucide-react';

export const AffectedFamiliesPage: React.FC = () => {
  const { affectedFamilies, searchQuery: globalSearch } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterDisplaced, setFilterDisplaced] = useState<string>('ALL');
  const [filterRrStatus, setFilterRrStatus] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedFamily, setSelectedFamily] = useState<AffectedFamily | null>(null);

  const searchKeyword = (localSearch || globalSearch).toLowerCase().trim();

  const filteredFamilies = affectedFamilies.filter((fam) => {
    const matchesType = filterType === 'ALL' || fam.affectedType === filterType;
    const matchesDisplaced =
      filterDisplaced === 'ALL' ||
      (filterDisplaced === 'YES' && fam.isDisplaced) ||
      (filterDisplaced === 'NO' && !fam.isDisplaced);
    const matchesRr = filterRrStatus === 'ALL' || fam.rrStatus === filterRrStatus;
    const matchesSearch =
      !searchKeyword ||
      fam.familyId.toLowerCase().includes(searchKeyword) ||
      fam.headOfFamily.toLowerCase().includes(searchKeyword) ||
      fam.village.toLowerCase().includes(searchKeyword) ||
      fam.surveyNumber.includes(searchKeyword);

    return matchesType && matchesDisplaced && matchesRr && matchesSearch;
  });

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Affected Families & Rehabilitation & Resettlement (R&R)</h1>
          <p className="page-subtitle">
            Socio-economic entitlement monitoring, housing layout allotments, subsistence allowances and livelihood restoration
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-grid">
        <MetricCard
          label="Affected Families"
          value="143"
          subtext="Under Project Corridor"
          icon={<Users size={18} />}
          highlight
        />
        <MetricCard
          label="Displaced Families"
          value="28"
          subtext="Requiring Physical Relocation"
          icon={<Home size={18} />}
        />
        <MetricCard
          label="R&R Housing Required"
          value="28"
          subtext="Plot / Tenement Entitlement"
          icon={<MapPin size={18} />}
        />
        <MetricCard
          label="R&R Completed"
          value="21"
          subtext="75.0% Settled in Colonies"
          icon={<CheckCircle2 size={18} />}
        />
        <MetricCard
          label="R&R Pending"
          value="7"
          subtext="Sheshagirihalli Phase-2"
          icon={<Clock size={18} />}
        />
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
            placeholder="Search Family ID, Head of Family, Village..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Tenure Category:</span>
          <select
            className="gov-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Title Holder">Title Holder</option>
            <option value="Tenant / Sharecropper">Tenant / Sharecropper</option>
            <option value="Agricultural Labourer">Agricultural Labourer</option>
            <option value="Artisan">Artisan</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Displacement:</span>
          <select
            className="gov-select"
            value={filterDisplaced}
            onChange={(e) => setFilterDisplaced(e.target.value)}
          >
            <option value="ALL">All Families</option>
            <option value="YES">Physically Displaced</option>
            <option value="NO">Non-Displaced (Land Loss Only)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>R&R Status:</span>
          <select
            className="gov-select"
            value={filterRrStatus}
            onChange={(e) => setFilterRrStatus(e.target.value)}
          >
            <option value="ALL">All R&R Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Not Required">Not Required</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Family ID</th>
                <th>Head of Family</th>
                <th>Village & Taluk</th>
                <th>Survey Number</th>
                <th style={{ textAlign: 'center' }}>Family Size</th>
                <th>Tenure Category</th>
                <th style={{ textAlign: 'center' }}>Displaced?</th>
                <th>R&R Status</th>
                <th>Resettlement Plot / Scheme</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.map((fam) => (
                <tr key={fam.familyId}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fam.familyId}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{fam.headOfFamily}</td>
                  <td>{fam.village}, {fam.taluk}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>Sy. No. {fam.surveyNumber}</td>
                  <td style={{ textAlign: 'center' }}>{fam.familyMembersCount} Members</td>
                  <td>{fam.affectedType}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: fam.isDisplaced ? 'var(--gov-red-700)' : 'var(--gov-slate-600)'
                      }}
                    >
                      {fam.isDisplaced ? 'Displaced' : 'Land Loss'}
                    </span>
                  </td>
                  <td><StatusBadge status={fam.rrStatus} size="sm" /></td>
                  <td style={{ fontSize: '11px', color: 'var(--gov-slate-700)' }}>
                    {fam.resettlementSiteName ? (
                      <div>
                        <div>{fam.resettlementSiteName}</div>
                        <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)' }}>{fam.plotAllotted}</div>
                      </div>
                    ) : (
                      'In-situ Rehabilitation'
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="gov-btn gov-btn-secondary gov-btn-sm"
                      onClick={() => setSelectedFamily(fam)}
                    >
                      <Eye size={12} /> Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Family Profile Modal */}
      <Modal
        isOpen={!!selectedFamily}
        onClose={() => setSelectedFamily(null)}
        title={selectedFamily ? `Family Entitlement Card — ${selectedFamily.familyId}` : ''}
        subtitle={selectedFamily ? `${selectedFamily.headOfFamily} (${selectedFamily.gender}, Age ${selectedFamily.age}) · ${selectedFamily.village}` : ''}
        footer={
          <button className="gov-btn gov-btn-primary" onClick={() => setSelectedFamily(null)}>
            Close Profile
          </button>
        }
      >
        {selectedFamily && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Socio-economic Attributes */}
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                border: '1px solid var(--gov-slate-200)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '11.5px'
              }}
            >
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Tenure Category:</span>
                <div style={{ fontWeight: 600 }}>{selectedFamily.affectedType}</div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Family Dependents:</span>
                <div style={{ fontWeight: 600 }}>{selectedFamily.familyMembersCount} Registered Members</div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Survey Number:</span>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Sy. No. {selectedFamily.surveyNumber}</div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>SIA Baseline Date:</span>
                <div style={{ fontWeight: 600 }}>{selectedFamily.lastAssessedDate}</div>
              </div>
            </div>

            {/* R&R Entitlements Breakdown */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
                RFCTLARR Second Schedule Entitlements Checklist
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Home size={14} color="var(--gov-blue-600)" />
                    Resettlement House / Plot Allotment
                  </span>
                  <span style={{ fontWeight: 600, color: selectedFamily.resettlementSiteName ? 'var(--gov-green-700)' : 'var(--gov-slate-500)' }}>
                    {selectedFamily.resettlementSiteName ? selectedFamily.plotAllotted : 'Cash Option Chosen'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IndianRupee size={14} color="var(--gov-green-600)" />
                    Subsistence Allowance (₹36,000 / annum)
                  </span>
                  <span style={{ fontWeight: 600, color: selectedFamily.subsistenceAllowancePaid ? 'var(--gov-green-700)' : 'var(--gov-amber-700)' }}>
                    {selectedFamily.subsistenceAllowancePaid ? '✓ Disbursed (12 Months)' : 'Pending DC Sanction'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={14} color="var(--gov-purple-700)" />
                    Livelihood & Skill Training Programme
                  </span>
                  <span style={{ fontWeight: 600, color: selectedFamily.trainingProvided ? 'var(--gov-green-700)' : 'var(--gov-slate-500)' }}>
                    {selectedFamily.trainingProvided ? '✓ Enrolled in ITI Ramanagara' : 'Scheduled in Next Batch'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
